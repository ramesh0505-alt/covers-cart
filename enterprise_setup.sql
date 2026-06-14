-- CoversCartOnline — Enterprise Extension Migration SQL
-- Run this script in the Supabase SQL Editor to initialize all 22 enterprise modules.

-- ==================================================
-- 1. ABANDONED CART SYSTEM TABLES
-- ==================================================
CREATE TABLE IF NOT EXISTS public.abandoned_carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    cart_value NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    recovered BOOLEAN NOT NULL DEFAULT false,
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.abandoned_cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    abandoned_cart_id UUID REFERENCES public.abandoned_carts(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price NUMERIC(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.abandoned_cart_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    channel TEXT NOT NULL, -- 'EMAIL', 'SMS', 'WHATSAPP'
    delay_minutes INTEGER NOT NULL,
    template_id TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.abandoned_cart_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    abandoned_cart_id UUID REFERENCES public.abandoned_carts(id) ON DELETE CASCADE NOT NULL,
    campaign_id UUID REFERENCES public.abandoned_cart_campaigns(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL, -- 'TRIGGERED', 'SENT', 'CLICKED', 'RECOVERED'
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==================================================
-- 2. RETURNS MANAGEMENT TABLES
-- ==================================================
CREATE TABLE IF NOT EXISTS public.returns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE RESTRICT NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL DEFAULT 'REQUESTED', -- 'REQUESTED', 'APPROVED', 'PICKUP_SCHEDULED', 'RECEIVED', 'REFUNDED', 'REJECTED'
    refund_amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.return_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    return_id UUID REFERENCES public.returns(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT NOT NULL,
    quantity INTEGER NOT NULL,
    reason_id UUID NOT NULL
);

CREATE TABLE IF NOT EXISTS public.return_reasons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reason_text TEXT UNIQUE NOT NULL,
    requires_attachment BOOLEAN DEFAULT true NOT NULL
);

CREATE TABLE IF NOT EXISTS public.return_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    return_id UUID REFERENCES public.returns(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL,
    notes TEXT,
    updated_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.return_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    return_id UUID REFERENCES public.returns(id) ON DELETE CASCADE NOT NULL,
    file_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==================================================
-- 3. EXCHANGE MANAGEMENT TABLES
-- ==================================================
CREATE TABLE IF NOT EXISTS public.exchanges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE RESTRICT NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    replacement_order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'REQUESTED', -- 'REQUESTED', 'APPROVED', 'SHIPPED', 'COMPLETED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.exchange_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exchange_id UUID REFERENCES public.exchanges(id) ON DELETE CASCADE NOT NULL,
    original_product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT NOT NULL,
    new_product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT NOT NULL,
    quantity INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS public.exchange_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exchange_id UUID REFERENCES public.exchanges(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL,
    notes TEXT,
    updated_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==================================================
-- 4. STORE CREDIT SYSTEM TABLES
-- ==================================================
CREATE TABLE IF NOT EXISTS public.store_credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    balance NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'INR',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.store_credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_credit_id UUID REFERENCES public.store_credits(id) ON DELETE CASCADE NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    type TEXT NOT NULL, -- 'CREDIT', 'DEBIT'
    source TEXT NOT NULL, -- 'REFUND', 'GIFT_CARD', 'PROMO', 'ORDER_PURCHASE'
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.store_credit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_credit_id UUID REFERENCES public.store_credits(id) ON DELETE CASCADE NOT NULL,
    action TEXT NOT NULL,
    actor_id UUID REFERENCES public.profiles(id),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==================================================
-- 5. GIFT CARD SYSTEM TABLES
-- ==================================================
CREATE TABLE IF NOT EXISTS public.gift_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    initial_balance NUMERIC(10, 2) NOT NULL,
    current_balance NUMERIC(10, 2) NOT NULL,
    purchaser_id UUID REFERENCES public.profiles(id),
    recipient_email TEXT,
    expiry_date TIMESTAMP WITH TIME ZONE,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.gift_card_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gift_card_id UUID REFERENCES public.gift_cards(id) ON DELETE CASCADE NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    type TEXT NOT NULL, -- 'REDEEMED', 'REVERSAL'
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.gift_card_redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gift_card_id UUID REFERENCES public.gift_cards(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==================================================
-- 6. WAITLIST SYSTEM TABLES
-- ==================================================
CREATE TABLE IF NOT EXISTS public.waitlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.waitlist_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    waitlist_id UUID REFERENCES public.waitlists(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    device_model TEXT,
    notified BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==================================================
-- 7. PREORDER SYSTEM TABLES
-- ==================================================
CREATE TABLE IF NOT EXISTS public.preorders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE UNIQUE NOT NULL,
    release_date TIMESTAMP WITH TIME ZONE NOT NULL,
    max_preorder_limit INTEGER NOT NULL,
    current_preorders INTEGER DEFAULT 0 NOT NULL,
    active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.preorder_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    preorder_id UUID REFERENCES public.preorders(id) ON DELETE CASCADE NOT NULL,
    order_item_id UUID NOT NULL,
    user_id UUID REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.preorder_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    preorder_id UUID REFERENCES public.preorders(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==================================================
-- 8. VENDOR MANAGEMENT TABLES
-- ==================================================
CREATE TABLE IF NOT EXISTS public.vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT UNIQUE NOT NULL,
    contact_name TEXT,
    email TEXT,
    phone TEXT,
    score NUMERIC(3, 2) DEFAULT 5.00,
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.vendor_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    role TEXT
);

CREATE TABLE IF NOT EXISTS public.vendor_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    unit_cost NUMERIC(10, 2) NOT NULL,
    sku TEXT,
    lead_time_days INTEGER
);

CREATE TABLE IF NOT EXISTS public.vendor_purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE RESTRICT NOT NULL,
    status TEXT DEFAULT 'DRAFT', -- 'DRAFT', 'SENT', 'RECEIVED'
    total_amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.vendor_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_id UUID REFERENCES public.vendor_purchase_orders(id) ON DELETE CASCADE NOT NULL,
    invoice_number TEXT NOT NULL,
    amount_due NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'UNPAID'
);

CREATE TABLE IF NOT EXISTS public.vendor_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
    metric_name TEXT NOT NULL,
    score NUMERIC(5, 2) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==================================================
-- 9. MEDIA LIBRARY TABLES
-- ==================================================
CREATE TABLE IF NOT EXISTS public.media_folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    parent_id UUID REFERENCES public.media_folders(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.media_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename TEXT NOT NULL,
    url TEXT NOT NULL,
    size INTEGER NOT NULL,
    mime_type TEXT,
    folder_id UUID REFERENCES public.media_folders(id) ON DELETE SET NULL,
    uploaded_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.media_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_id UUID REFERENCES public.media_library(id) ON DELETE CASCADE NOT NULL,
    tag TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.media_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    media_id UUID REFERENCES public.media_library(id) ON DELETE CASCADE NOT NULL,
    version_number INTEGER NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==================================================
-- 10. SEO MANAGEMENT TABLES
-- ==================================================
CREATE TABLE IF NOT EXISTS public.seo_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_type TEXT UNIQUE NOT NULL, -- 'PRODUCT', 'CATEGORY', 'COLLECTION', 'HOMEPAGE'
    title_template TEXT NOT NULL,
    description_template TEXT NOT NULL,
    og_image_template TEXT
);

CREATE TABLE IF NOT EXISTS public.redirect_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_url TEXT UNIQUE NOT NULL,
    target_url TEXT NOT NULL,
    status_code INTEGER DEFAULT 301 NOT NULL,
    active BOOLEAN DEFAULT true NOT NULL
);

CREATE TABLE IF NOT EXISTS public.sitemap_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT UNIQUE NOT NULL,
    priority NUMERIC(2, 1) DEFAULT 0.5,
    changefreq TEXT DEFAULT 'daily',
    lastmod TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.schema_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_type TEXT UNIQUE NOT NULL,
    schema_json JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS public.seo_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_path TEXT NOT NULL,
    referrer TEXT,
    is_broken BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==================================================
-- 11. NOTIFICATION SYSTEM TABLES
-- ==================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    status TEXT DEFAULT 'UNREAD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    subject TEXT,
    body TEXT NOT NULL,
    channels TEXT[] DEFAULT '{}'::TEXT[] NOT NULL -- 'EMAIL', 'SMS', 'PUSH', 'WHATSAPP'
);

CREATE TABLE IF NOT EXISTS public.notification_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id),
    template_id UUID REFERENCES public.notification_templates(id),
    channel TEXT NOT NULL,
    status TEXT NOT NULL, -- 'SUCCESS', 'FAILED', 'RETRIED'
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    html_content TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.sms_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.push_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.whatsapp_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL
);

-- ==================================================
-- 12. SUPPORT CENTER TABLES
-- ==================================================
CREATE TABLE IF NOT EXISTS public.support_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.knowledge_base_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.support_categories(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    views_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.support_escalations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL,
    escalation_reason TEXT NOT NULL,
    sla_due TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'OPEN'
);

CREATE TABLE IF NOT EXISTS public.support_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    feedback TEXT,
    user_id UUID REFERENCES public.profiles(id)
);

-- ==================================================
-- 13. WORKFLOW AUTOMATION ENGINE TABLES
-- ==================================================
CREATE TABLE IF NOT EXISTS public.automation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.automation_triggers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_id UUID REFERENCES public.automation_rules(id) ON DELETE CASCADE NOT NULL,
    event_type TEXT NOT NULL, -- 'ORDER_PLACED', 'INVENTORY_LOW', 'SUPPORT_CREATED'
    conditions JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS public.automation_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_id UUID REFERENCES public.automation_rules(id) ON DELETE CASCADE NOT NULL,
    action_type TEXT NOT NULL, -- 'SEND_EMAIL', 'ADJUST_INVENTORY', 'ASSIGN_AGENT'
    parameters JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS public.automation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_id UUID REFERENCES public.automation_rules(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL,
    execution_time_ms INTEGER,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==================================================
-- 14. BACKGROUND JOB SYSTEM TABLES
-- ==================================================
CREATE TABLE IF NOT EXISTS public.job_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_type TEXT NOT NULL, -- 'BULK_UPLOAD', 'REPORTS_GEN', 'SYNC_PRODUCTS'
    payload JSONB NOT NULL,
    status TEXT DEFAULT 'PENDING', -- 'PENDING', 'RUNNING', 'COMPLETED', 'FAILED'
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    run_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.job_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES public.job_queue(id) ON DELETE CASCADE NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL,
    error_message TEXT,
    worker_id TEXT
);

CREATE TABLE IF NOT EXISTS public.scheduled_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    cron_expression TEXT NOT NULL,
    payload JSONB,
    active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.cron_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES public.scheduled_tasks(id) ON DELETE CASCADE NOT NULL,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    success BOOLEAN NOT NULL,
    error_message TEXT
);

-- ==================================================
-- 15. FEATURE FLAGS SYSTEM TABLES
-- ==================================================
CREATE TABLE IF NOT EXISTS public.feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    description TEXT,
    enabled BOOLEAN DEFAULT false,
    rules JSONB NOT NULL DEFAULT '{}'::JSONB, -- {"users": [...], "percent": 10}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.feature_rollouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flag_id UUID REFERENCES public.feature_flags(id) ON DELETE CASCADE NOT NULL,
    environment TEXT NOT NULL, -- 'DEV', 'STAGING', 'PRODUCTION'
    percentage INTEGER DEFAULT 0 NOT NULL
);

CREATE TABLE IF NOT EXISTS public.feature_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flag_id UUID REFERENCES public.feature_flags(id) ON DELETE CASCADE NOT NULL,
    action TEXT NOT NULL,
    actor_id UUID REFERENCES public.profiles(id),
    previous_state JSONB,
    new_state JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==================================================
-- 16. OBSERVABILITY SYSTEM TABLES
-- ==================================================
CREATE TABLE IF NOT EXISTS public.error_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message TEXT NOT NULL,
    stack TEXT,
    context JSONB,
    severity TEXT NOT NULL DEFAULT 'ERROR',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.performance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route TEXT NOT NULL,
    duration_ms INTEGER NOT NULL,
    query_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.api_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    method TEXT NOT NULL,
    path TEXT NOT NULL,
    status_code INTEGER NOT NULL,
    ip_address TEXT,
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.security_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event TEXT NOT NULL,
    details JSONB,
    ip_address TEXT,
    user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==================================================
-- 17. FRAUD DETECTION SYSTEM TABLES
-- ==================================================
CREATE TABLE IF NOT EXISTS public.fraud_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    rule_type TEXT NOT NULL, -- 'VELOCITY', 'BLACKLIST', 'COUPON_LIMIT'
    config JSONB NOT NULL,
    active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.fraud_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    score INTEGER NOT NULL DEFAULT 0, -- 0 (Safe) to 100 (Critical)
    risk_level TEXT DEFAULT 'LOW',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.fraud_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id),
    event_type TEXT NOT NULL, -- 'PAYMENT_FAILED', 'COUPON_SPAM', 'MULTIPLE_ACCOUNTS'
    severity TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==================================================
-- 18. WAREHOUSE OPERATIONS TABLES
-- ==================================================
CREATE TABLE IF NOT EXISTS public.warehouse_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    warehouse_id TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'PICKER' -- 'PICKER', 'PACKER', 'MANAGER'
);

CREATE TABLE IF NOT EXISTS public.warehouse_bins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bin_code TEXT UNIQUE NOT NULL, -- e.g., 'A-12-B'
    zone TEXT NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    quantity INTEGER DEFAULT 0 NOT NULL
);

CREATE TABLE IF NOT EXISTS public.pick_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    assigned_picker_id UUID REFERENCES public.profiles(id),
    status TEXT DEFAULT 'PENDING', -- 'PENDING', 'PICKING', 'PICKED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.packing_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status TEXT DEFAULT 'PENDING', -- 'PENDING', 'PACKING', 'PACKED'
    packer_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.shipping_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    carrier_name TEXT NOT NULL,
    tracking_number TEXT,
    status TEXT DEFAULT 'MANIFESTED'
);

-- ==================================================
-- 19. ADVANCED SEARCH ENGINE TABLES
-- ==================================================
CREATE TABLE IF NOT EXISTS public.search_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query TEXT NOT NULL,
    user_id UUID,
    results_count INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.search_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query_id UUID REFERENCES public.search_queries(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    clicked_position INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.search_synonyms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    word TEXT NOT NULL,
    synonyms TEXT[] DEFAULT '{}'::TEXT[] NOT NULL
);

CREATE TABLE IF NOT EXISTS public.search_boost_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    keyword TEXT NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    boost_factor NUMERIC(3, 2) NOT NULL DEFAULT 1.00
);

-- ==================================================
-- 20. DEVICE ECOSYSTEM TABLES
-- ==================================================
CREATE TABLE IF NOT EXISTS public.device_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand TEXT NOT NULL, -- 'APPLE', 'SAMSUNG', 'ONEPLUS'
    series TEXT NOT NULL, -- 'IPHONE_15', 'GALAXY_S24'
    name TEXT UNIQUE NOT NULL, -- e.g., 'iPhone 15 Pro'
    release_year INTEGER
);

CREATE TABLE IF NOT EXISTS public.device_specifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    generation_id UUID REFERENCES public.device_generations(id) ON DELETE CASCADE NOT NULL,
    dimension_width_mm NUMERIC(5, 2),
    dimension_height_mm NUMERIC(5, 2),
    camera_bump_details JSONB
);

CREATE TABLE IF NOT EXISTS public.compatibility_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    generation_id UUID REFERENCES public.device_generations(id) ON DELETE CASCADE NOT NULL,
    material_compatibility TEXT[] DEFAULT '{}'::TEXT[] NOT NULL -- 'GLASS', 'SILICONE'
);

-- ==================================================
-- 21. ARTWORK ECOSYSTEM TABLES
-- ==================================================
CREATE TABLE IF NOT EXISTS public.creator_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
    pen_name TEXT NOT NULL,
    royalty_percentage NUMERIC(4, 2) DEFAULT 10.00,
    portfolio_url TEXT
);

CREATE TABLE IF NOT EXISTS public.artwork_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.artwork_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    creator_id UUID REFERENCES public.creator_profiles(id) ON DELETE RESTRICT NOT NULL,
    category_id UUID REFERENCES public.artwork_categories(id) ON DELETE SET NULL,
    file_url TEXT NOT NULL,
    royalty_flat_fee NUMERIC(10, 2) DEFAULT 0.00,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.artwork_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    artwork_id UUID REFERENCES public.artwork_versions(id) ON DELETE CASCADE NOT NULL,
    tag TEXT NOT NULL
);

-- ==================================================
-- 22. CUSTOM CASE PRODUCTION PIPELINE TABLES
-- ==================================================
CREATE TABLE IF NOT EXISTS public.production_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_item_id UUID NOT NULL, -- references OrderItem
    design_url TEXT NOT NULL,
    material TEXT NOT NULL,
    device_model TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING_APPROVAL', -- 'PENDING_APPROVAL', 'APPROVED', 'PRINTING', 'QC', 'DISPATCHED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.print_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    production_id UUID REFERENCES public.production_queue(id) ON DELETE CASCADE NOT NULL,
    printer_id TEXT NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.quality_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    production_id UUID REFERENCES public.production_queue(id) ON DELETE CASCADE NOT NULL,
    passed BOOLEAN NOT NULL,
    defect_reason TEXT,
    checked_by UUID REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.production_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    production_id UUID REFERENCES public.production_queue(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==================================================
-- INDEXES & PERFORMANCE OPTIMIZATION
-- ==================================================
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_user_id ON public.abandoned_carts(user_id);
CREATE INDEX IF NOT EXISTS idx_abandoned_carts_last_active ON public.abandoned_carts(last_active_at);
CREATE INDEX IF NOT EXISTS idx_cart_events_cart_id ON public.abandoned_cart_events(abandoned_cart_id);
CREATE INDEX IF NOT EXISTS idx_returns_user_id ON public.returns(user_id);
CREATE INDEX IF NOT EXISTS idx_returns_status ON public.returns(status);
CREATE INDEX IF NOT EXISTS idx_exchanges_status ON public.exchanges(status);
CREATE INDEX IF NOT EXISTS idx_store_credits_user ON public.store_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_credit_id ON public.store_credit_transactions(store_credit_id);
CREATE INDEX IF NOT EXISTS idx_gift_cards_code ON public.gift_cards(code);
CREATE INDEX IF NOT EXISTS idx_waitlist_prod ON public.waitlists(product_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_entries_notified ON public.waitlist_entries(waitlist_id, notified);
CREATE INDEX IF NOT EXISTS idx_preorders_product ON public.preorders(product_id);
CREATE INDEX IF NOT EXISTS idx_vendor_products_vendor ON public.vendor_products(vendor_id, product_id);
CREATE INDEX IF NOT EXISTS idx_media_folder ON public.media_library(folder_id);
CREATE INDEX IF NOT EXISTS idx_media_tags ON public.media_tags(tag);
CREATE INDEX IF NOT EXISTS idx_redirect_source ON public.redirect_rules(source_url);
CREATE INDEX IF NOT EXISTS idx_notifications_user_status ON public.notifications(user_id, status);
CREATE INDEX IF NOT EXISTS idx_article_category ON public.knowledge_base_articles(category_id);
CREATE INDEX IF NOT EXISTS idx_automation_triggers_event ON public.automation_triggers(event_type);
CREATE INDEX IF NOT EXISTS idx_job_queue_status ON public.job_queue(status, run_at);
CREATE INDEX IF NOT EXISTS idx_feature_flags_key ON public.feature_flags(key);
CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON public.error_logs(severity);
CREATE INDEX IF NOT EXISTS idx_api_logs_path ON public.api_logs(path, created_at);
CREATE INDEX IF NOT EXISTS idx_fraud_scores_score ON public.fraud_scores(score);
CREATE INDEX IF NOT EXISTS idx_bins_product ON public.warehouse_bins(product_id);
CREATE INDEX IF NOT EXISTS idx_search_queries_text ON public.search_queries(query);
CREATE INDEX IF NOT EXISTS idx_artwork_creator ON public.artwork_versions(creator_id);
CREATE INDEX IF NOT EXISTS idx_prod_queue_status ON public.production_queue(status);

-- ==================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==================================================
ALTER TABLE public.abandoned_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exchanges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.preorders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warehouse_bins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_queue ENABLE ROW LEVEL SECURITY;

-- Dynamic Policies Examples (Customer views own, Admins view all)
CREATE POLICY "Users can manage own abandoned carts" ON public.abandoned_carts FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can view own returns" ON public.returns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own exchanges" ON public.exchanges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own store credits" ON public.store_credits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public reads knowledge base" ON public.knowledge_base_articles FOR SELECT USING (true);
CREATE POLICY "Public reads active preorders" ON public.preorders FOR SELECT USING (active = true);

-- Admins overrides for RLS
CREATE POLICY "Admins bypass RLS on abandoned_carts" ON public.abandoned_carts FOR ALL USING (public.is_admin());
CREATE POLICY "Admins bypass RLS on returns" ON public.returns FOR ALL USING (public.is_admin());
CREATE POLICY "Admins bypass RLS on exchanges" ON public.exchanges FOR ALL USING (public.is_admin());
CREATE POLICY "Admins bypass RLS on store_credits" ON public.store_credits FOR ALL USING (public.is_admin());
CREATE POLICY "Admins bypass RLS on gift_cards" ON public.gift_cards FOR ALL USING (public.is_admin());
CREATE POLICY "Admins bypass RLS on waitlist_entries" ON public.waitlist_entries FOR ALL USING (public.is_admin());
CREATE POLICY "Admins bypass RLS on preorders" ON public.preorders FOR ALL USING (public.is_admin());
CREATE POLICY "Admins bypass RLS on vendors" ON public.vendors FOR ALL USING (public.is_admin());
CREATE POLICY "Admins bypass RLS on media_library" ON public.media_library FOR ALL USING (public.is_admin());
CREATE POLICY "Admins bypass RLS on seo_templates" ON public.seo_templates FOR ALL USING (public.is_admin());
CREATE POLICY "Admins bypass RLS on notifications" ON public.notifications FOR ALL USING (public.is_admin());
CREATE POLICY "Admins bypass RLS on automations" ON public.automation_rules FOR ALL USING (public.is_admin());
CREATE POLICY "Admins bypass RLS on job_queue" ON public.job_queue FOR ALL USING (public.is_admin());
CREATE POLICY "Admins bypass RLS on feature_flags" ON public.feature_flags FOR ALL USING (public.is_admin());
CREATE POLICY "Admins bypass RLS on error_logs" ON public.error_logs FOR ALL USING (public.is_admin());
CREATE POLICY "Admins bypass RLS on fraud_scores" ON public.fraud_scores FOR ALL USING (public.is_admin());
CREATE POLICY "Admins bypass RLS on warehouse_bins" ON public.warehouse_bins FOR ALL USING (public.is_admin());
CREATE POLICY "Admins bypass RLS on search_queries" ON public.search_queries FOR ALL USING (public.is_admin());
CREATE POLICY "Admins bypass RLS on device_generations" ON public.device_generations FOR ALL USING (public.is_admin());
CREATE POLICY "Admins bypass RLS on creator_profiles" ON public.creator_profiles FOR ALL USING (public.is_admin());
CREATE POLICY "Admins bypass RLS on production_queue" ON public.production_queue FOR ALL USING (public.is_admin());

-- ==================================================
-- INITIALIZE STORAGE BUCKETS (SQL GUIDELINE)
-- ==================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('returns', 'returns', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('vendors', 'vendors', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('media-library', 'media-library', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('support', 'support', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('shipping', 'shipping', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('devices', 'devices', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('artworks', 'artworks', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('production-renders', 'production-renders', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Anyone can view files in returns bucket" ON storage.objects FOR SELECT USING (bucket_id = 'returns');
CREATE POLICY "Anyone can view files in media-library bucket" ON storage.objects FOR SELECT USING (bucket_id = 'media-library');
CREATE POLICY "Anyone can view files in support bucket" ON storage.objects FOR SELECT USING (bucket_id = 'support');
CREATE POLICY "Anyone can view files in artworks bucket" ON storage.objects FOR SELECT USING (bucket_id = 'artworks');

CREATE POLICY "Admins can manage shipping labels" ON storage.objects FOR ALL USING (bucket_id = 'shipping' AND public.is_admin());
CREATE POLICY "Admins can manage devices blueprints" ON storage.objects FOR ALL USING (bucket_id = 'devices' AND public.is_admin());
CREATE POLICY "Admins can manage production renders" ON storage.objects FOR ALL USING (bucket_id = 'production-renders' AND public.is_admin());
