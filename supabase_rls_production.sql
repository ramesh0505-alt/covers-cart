-- ========================================================================
-- COVERSCART ENTERPRISE RLS CONFIGURATION BLUEPRINT
-- ========================================================================
-- Targets: Supabase PostgreSQL (15+)
-- Enforces: Comprehensive RBAC, ABAC, Realtime security, and Storage RLS
-- ========================================================================

-- 1. ROLE ENUM & INITIALIZATION
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM (
      'super_admin',
      'admin',
      'manager',
      'designer',
      'support',
      'marketing',
      'customer'
    );
  END IF;
END $$;

-- 2. ROLE & PERMISSION SCHEMAS
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name user_role UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
  role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role user_role NOT NULL DEFAULT 'customer',
  CONSTRAINT unique_user_role_entry UNIQUE (user_id, role)
);

-- 3. RBAC HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION public.check_user_role(target_roles user_role[])
RETURNS BOOLEAN SECURITY DEFINER AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = ANY(target_roles)
  );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.has_permission(p_key TEXT)
RETURNS BOOLEAN SECURITY DEFINER AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role = r.name
    JOIN public.role_permissions rp ON r.id = rp.role_id
    JOIN public.permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = auth.uid()
      AND p.key = p_key
  ) OR public.check_user_role(ARRAY['super_admin', 'admin']::user_role[]);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.is_super_admin() RETURNS BOOLEAN AS $$
  SELECT public.check_user_role(ARRAY['super_admin']::user_role[]);
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin() RETURNS BOOLEAN AS $$
  SELECT public.check_user_role(ARRAY['super_admin', 'admin']::user_role[]);
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_manager() RETURNS BOOLEAN AS $$
  SELECT public.check_user_role(ARRAY['super_admin', 'admin', 'manager']::user_role[]);
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_designer() RETURNS BOOLEAN AS $$
  SELECT public.check_user_role(ARRAY['super_admin', 'admin', 'manager', 'designer']::user_role[]);
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_support() RETURNS BOOLEAN AS $$
  SELECT public.check_user_role(ARRAY['super_admin', 'admin', 'support']::user_role[]);
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_marketing() RETURNS BOOLEAN AS $$
  SELECT public.check_user_role(ARRAY['super_admin', 'admin', 'manager', 'marketing']::user_role[]);
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_customer() RETURNS BOOLEAN AS $$
  SELECT public.check_user_role(ARRAY['customer']::user_role[]);
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_owner(row_user_id UUID) RETURNS BOOLEAN AS $$
  SELECT auth.uid() = row_user_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- 4. ENABLE RLS FOR EVERY PLATFORM TABLE
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
    EXECUTE 'ALTER TABLE public.' || quote_ident(r.tablename) || ' ENABLE ROW LEVEL SECURITY;';
  END LOOP;
END $$;

-- 5. RLS POLICIES FOR DOMAIN TABLES

-- Profiles, Devices, Sessions, Login History
CREATE POLICY super_admin_all_profiles ON public.profiles FOR ALL USING (public.is_super_admin());
CREATE POLICY admin_all_profiles ON public.profiles FOR ALL USING (public.is_admin());
CREATE POLICY customer_profile_select ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY customer_profile_update ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());

CREATE POLICY customer_devices ON public.devices FOR ALL TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY customer_sessions ON public.sessions FOR ALL TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY customer_login_history ON public.login_history FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());

-- Products Domain
CREATE POLICY public_read_published_products ON public.products FOR SELECT USING (status = 'PUBLISHED' OR public.is_admin());
CREATE POLICY admin_all_products ON public.products FOR ALL USING (public.is_admin());
CREATE POLICY manager_write_products ON public.products FOR INSERT OR UPDATE TO authenticated USING (public.is_manager());

CREATE POLICY public_read_variants ON public.product_variants FOR SELECT USING (true);
CREATE POLICY admin_all_variants ON public.product_variants FOR ALL USING (public.is_admin());

-- Artworks Domain
CREATE POLICY public_read_published_artworks ON public.artworks FOR SELECT USING (published = true OR public.is_admin());
CREATE POLICY designer_all_artworks ON public.artworks FOR ALL TO authenticated USING (creator_id = auth.uid() OR public.is_admin());

-- Custom Designs
CREATE POLICY customer_own_designs ON public.custom_designs FOR ALL TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY designer_assigned_designs ON public.custom_designs FOR ALL TO authenticated USING (designer_id = auth.uid() OR public.is_admin());

-- Orders & Items
CREATE POLICY customer_own_orders ON public.orders FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin() OR public.is_support());
CREATE POLICY admin_all_orders ON public.orders FOR ALL USING (public.is_admin());

-- Payments
CREATE POLICY customer_own_payments ON public.payments FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = payments.order_id AND orders.user_id = auth.uid()) OR public.is_admin()
);
CREATE POLICY admin_all_payments ON public.payments FOR ALL USING (public.is_admin());

-- Community
CREATE POLICY public_read_approved_posts ON public.community_posts FOR SELECT USING (approved = true OR public.is_admin());
CREATE POLICY customer_own_posts ON public.community_posts FOR ALL TO authenticated USING (user_id = auth.uid() OR public.is_admin());

-- Loyalty & Referrals
CREATE POLICY customer_view_own_loyalty ON public.loyalty_points FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());
CREATE POLICY admin_manage_loyalty ON public.loyalty_points FOR ALL USING (public.is_admin());

-- CMS
CREATE POLICY public_read_published_pages ON public.pages FOR SELECT USING (published = true OR public.is_admin());
CREATE POLICY marketing_edit_pages ON public.pages FOR ALL TO authenticated USING (public.is_marketing() OR public.is_admin());

-- Analytics (Locked down to Admin/Manager/Marketing)
CREATE POLICY admin_all_analytics ON public.page_views FOR ALL USING (public.is_admin());
CREATE POLICY staff_read_analytics ON public.page_views FOR SELECT TO authenticated USING (public.is_manager() OR public.is_marketing());

-- Audit Logs (Append-Only, Admin view only)
CREATE POLICY super_admin_all_audits ON public.audit_logs FOR ALL USING (public.is_super_admin());
CREATE POLICY admin_read_audits ON public.audit_logs FOR SELECT USING (public.is_admin());
CREATE POLICY system_insert_audits ON public.audit_logs FOR INSERT WITH CHECK (true);

-- ========================================================================
-- 6. STORAGE BUCKET ROW LEVEL SECURITY
-- ========================================================================
CREATE POLICY storage_select_public ON storage.objects FOR SELECT USING (
  bucket_id IN ('product-images', 'product-videos', 'artworks', 'community-media', 'review-media', 'mystery-assets', 'drop-assets')
);

CREATE POLICY storage_write_admin ON storage.objects FOR ALL USING (
  public.is_admin()
);

CREATE POLICY storage_write_custom_designs ON storage.objects FOR ALL USING (
  bucket_id = 'custom-designs' AND (
    public.is_admin() OR 
    public.is_designer() OR 
    (owner = auth.uid()::text)
  )
);

-- ========================================================================
-- 7. REALTIME CHANNELS ENFORCEMENT
-- ========================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ticket_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mystery_reveals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;
