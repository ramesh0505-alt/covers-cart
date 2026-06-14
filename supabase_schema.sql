-- ========================================================================
-- COVERSCART HEADLESS COMMERCE PLATFORM - PRODUCTION SCHEMA (v1.0.0)
-- ========================================================================
-- Targets: Supabase PostgreSQL (15+)
-- Contains: Tables, Foreign Keys, Indexes, Enums, Views, Triggers, Functions
-- ========================================================================

-- ========================================================================
-- 1. DATABASE ENUMS & CUSTOM TYPES
-- ========================================================================
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'platform_role') THEN
    CREATE TYPE platform_role AS ENUM (
      'super_admin',
      'admin',
      'manager',
      'designer',
      'support',
      'marketing',
      'customer'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_state') THEN
    CREATE TYPE order_state AS ENUM (
      'PENDING',
      'PROCESSING',
      'SHIPPED',
      'DELIVERED',
      'CANCELLED',
      'RETURNED',
      'EXCHANGED'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_state') THEN
    CREATE TYPE payment_state AS ENUM (
      'PENDING',
      'PAID',
      'FAILED',
      'REFUNDED'
    );
  END IF;
END $$;

-- ========================================================================
-- 2. SCHEMAS & TABLES DEFINITIONS
-- ========================================================================

-- Identity / Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role platform_role NOT NULL DEFAULT 'customer',
  assigned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_user_role UNIQUE (user_id, role)
);

CREATE TABLE IF NOT EXISTS public.devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  device_name TEXT NOT NULL,
  model_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  ip_address TEXT,
  user_agent TEXT,
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.login_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  ip_address TEXT,
  successful BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Catalog Domain
CREATE TABLE IF NOT EXISTS public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.product_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(12,2) NOT NULL,
  sale_price NUMERIC(12,2),
  status TEXT DEFAULT 'DRAFT' NOT NULL, -- DRAFT, PUBLISHED
  category_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,
  collection_id UUID REFERENCES public.product_collections(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku TEXT UNIQUE NOT NULL,
  color TEXT NOT NULL,
  material TEXT NOT NULL,
  stock INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.product_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  video_url TEXT NOT NULL,
  display_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.device_brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.device_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES public.device_brands(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.compatibility_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  model_id UUID NOT NULL REFERENCES public.device_models(id) ON DELETE CASCADE,
  CONSTRAINT unique_compatibility UNIQUE (product_id, model_id)
);

-- Commerce Domain
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  total_amount NUMERIC(12,2) NOT NULL,
  status order_state DEFAULT 'PENDING' NOT NULL,
  shipping_address TEXT NOT NULL,
  payment_method TEXT DEFAULT 'COD' NOT NULL,
  payment_status payment_state DEFAULT 'PENDING' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  price NUMERIC(12,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status order_state NOT NULL,
  notes TEXT,
  changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  status payment_state DEFAULT 'PENDING' NOT NULL,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Custom Designs
CREATE TABLE IF NOT EXISTS public.custom_designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  designer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'SUBMITTED' NOT NULL, -- SUBMITTED, IN_DESIGN, APPROVED, REJECTED
  device_model_id UUID REFERENCES public.device_models(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.design_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id UUID NOT NULL REFERENCES public.custom_designs(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.design_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id UUID NOT NULL REFERENCES public.custom_designs(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.design_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  design_id UUID NOT NULL REFERENCES public.custom_designs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Community
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  approved BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.community_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.community_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT unique_post_user_like UNIQUE (post_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.community_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Mystery System
CREATE TABLE IF NOT EXISTS public.mystery_pools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  active BOOLEAN DEFAULT true NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.mystery_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pool_id UUID NOT NULL REFERENCES public.mystery_pools(id) ON DELETE CASCADE,
  reward_name TEXT NOT NULL,
  probability NUMERIC(5,4) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.mystery_reveals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pool_id UUID REFERENCES public.mystery_pools(id) ON DELETE SET NULL,
  reward_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Loyalty
CREATE TABLE IF NOT EXISTS public.loyalty_points (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  balance INT DEFAULT 0 NOT NULL
);

CREATE TABLE IF NOT EXISTS public.loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.loyalty_points(user_id) ON DELETE CASCADE,
  amount INT NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.reward_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reward_name TEXT NOT NULL,
  cost_points INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Support
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_agent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'OPEN' NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ticket_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES public.ticket_messages(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL
);

-- Artworks
CREATE TABLE IF NOT EXISTS public.artworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  published BOOLEAN DEFAULT false NOT NULL
);

CREATE TABLE IF NOT EXISTS public.artwork_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artwork_id UUID NOT NULL REFERENCES public.artworks(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  version_number INT DEFAULT 1 NOT NULL
);

-- Production Pipeline
CREATE TABLE IF NOT EXISTS public.production_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id UUID NOT NULL REFERENCES public.order_items(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'QUEUED' NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.print_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_id UUID NOT NULL REFERENCES public.production_queue(id) ON DELETE CASCADE,
  printer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.quality_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_id UUID NOT NULL REFERENCES public.production_queue(id) ON DELETE CASCADE,
  passed BOOLEAN NOT NULL,
  defect_reason TEXT,
  checked_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Limited Drops
CREATE TABLE IF NOT EXISTS public.limited_drops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  drop_at TIMESTAMP WITH TIME ZONE NOT NULL,
  active BOOLEAN DEFAULT true NOT NULL
);

CREATE TABLE IF NOT EXISTS public.drop_waitlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drop_id UUID NOT NULL REFERENCES public.limited_drops(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Spin Campaigns
CREATE TABLE IF NOT EXISTS public.spin_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  active BOOLEAN DEFAULT true NOT NULL
);

CREATE TABLE IF NOT EXISTS public.spin_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES public.spin_campaigns(id) ON DELETE CASCADE,
  reward_details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- CMS
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  html_content TEXT,
  published BOOLEAN DEFAULT false NOT NULL
);

CREATE TABLE IF NOT EXISTS public.menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  links JSONB
);

CREATE TABLE IF NOT EXISTS public.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  link_url TEXT,
  active BOOLEAN DEFAULT true NOT NULL
);

-- Analytics & Views
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL,
  referrer TEXT,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.product_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.checkout_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  step TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.security_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event TEXT NOT NULL,
  ip_address TEXT,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ========================================================================
-- 3. INDEXES FOR PERFORMANCE AND RLS OPTIMIZATION
-- ========================================================================
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_devices_user_id ON public.devices(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_login_history_user_id ON public.login_history(user_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_collection ON public.products(collection_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_compatibility_rules_product ON public.compatibility_rules(product_id);
CREATE INDEX IF NOT EXISTS idx_compatibility_rules_model ON public.compatibility_rules(model_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_order ON public.order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_custom_designs_user_id ON public.custom_designs(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_designs_designer_id ON public.custom_designs(designer_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON public.community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON public.community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_user_id ON public.community_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_mystery_reveals_user_id ON public.mystery_reveals(user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_user_id ON public.loyalty_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON public.tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned_agent ON public.tickets(assigned_agent_id);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket ON public.ticket_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_artworks_creator_id ON public.artworks(creator_id);
CREATE INDEX IF NOT EXISTS idx_drop_waitlists_user ON public.drop_waitlists(user_id);
CREATE INDEX IF NOT EXISTS idx_spin_history_user ON public.spin_history(user_id);
CREATE INDEX IF NOT EXISTS idx_page_views_user ON public.page_views(user_id);
CREATE INDEX IF NOT EXISTS idx_product_views_user ON public.product_views(user_id);

-- ========================================================================
-- 4. VIEWS & MATERIALIZED VIEWS
-- ========================================================================
CREATE OR REPLACE VIEW public.vw_catalog_active AS
SELECT p.id, p.title, p.price, p.sale_price, c.name AS category_name, col.name AS collection_name
FROM public.products p
LEFT JOIN public.product_categories c ON p.category_id = c.id
LEFT JOIN public.product_collections col ON p.collection_id = col.id
WHERE p.status = 'PUBLISHED';

-- Materialized View for Daily Financial Reporting
CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_daily_sales_kpi AS
SELECT 
  date_trunc('day', created_at) AS sale_date,
  COUNT(id) AS total_orders,
  SUM(total_amount) AS gross_revenue,
  COUNT(CASE WHEN payment_status = 'PAID' THEN 1 END) AS successful_payments
FROM public.orders
GROUP BY 1
WITH NO DATA;

CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_daily_sales_kpi_date ON public.mv_daily_sales_kpi(sale_date);
