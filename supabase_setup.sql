-- CoversCartOnline — Supabase Initial Setup Migration SQL
-- Run this script in the Supabase SQL Editor to initialize the database foundation.

-- ==================================================
-- 1. ROLE & TYPE DEFINITIONS
-- ==================================================
CREATE TYPE user_role AS ENUM ('admin', 'customer');

-- ==================================================
-- 2. CREATE DATABASE TABLES
-- ==================================================

-- A. PROFILES TABLE (linked to auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT UNIQUE NOT NULL,
    role user_role DEFAULT 'customer'::user_role NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- B. CATEGORIES TABLE
CREATE TABLE public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- C. COLLECTIONS TABLE
CREATE TABLE public.collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    banner_image TEXT,
    description TEXT,
    featured BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- D. PRODUCTS TABLE
CREATE TABLE public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    sale_price NUMERIC(10, 2),
    stock INTEGER DEFAULT 0 NOT NULL,
    images TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
    featured BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- E. ORDERS TABLE
CREATE TABLE public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method TEXT DEFAULT 'COD' NOT NULL, -- 'COD', 'RAZORPAY'
    payment_status TEXT DEFAULT 'PENDING' NOT NULL, -- 'PENDING', 'PAID', 'FAILED'
    order_status TEXT DEFAULT 'PENDING' NOT NULL, -- 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'
    shipping_address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- F. CART ITEMS TABLE
CREATE TABLE public.cart_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER DEFAULT 1 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, product_id)
);

-- G. WISHLIST ITEMS TABLE
CREATE TABLE public.wishlist_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, product_id)
);

-- H. BANNERS TABLE
CREATE TABLE public.banners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    link_url TEXT,
    active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- I. HOMEPAGE CMS TABLE
CREATE TABLE public.homepage_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section_type TEXT NOT NULL, -- 'hero', 'categories', 'customizer', 'catalog', 'promos', 'reviews' etc.
    title TEXT,
    subtitle TEXT,
    image_url TEXT,
    button_text TEXT,
    button_link TEXT,
    enabled BOOLEAN DEFAULT true NOT NULL,
    section_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- J. GLOBAL SETTINGS TABLE
CREATE TABLE public.settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==================================================
-- 3. PROFILES AUTOMATIC INTEGRATION TRIGGER
-- ==================================================

-- Automatically insert a profiles row when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role, avatar_url)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
        new.email,
        CASE 
            WHEN new.email = 'admin@coverscart.online' THEN 'admin'::user_role
            ELSE 'customer'::user_role
        END,
        new.raw_user_meta_data->>'avatar_url'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Helper Function to check if requesting user is Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT role = 'admin'::user_role 
        FROM public.profiles 
        WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- A. PROFILES POLICIES
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins have full profile access" ON public.profiles FOR ALL USING (public.is_admin());

-- B. CATEGORIES POLICIES
CREATE POLICY "Categories are readable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Only admins can modify categories" ON public.categories FOR ALL USING (public.is_admin());

-- C. COLLECTIONS POLICIES
CREATE POLICY "Collections are readable by everyone" ON public.collections FOR SELECT USING (true);
CREATE POLICY "Only admins can modify collections" ON public.collections FOR ALL USING (public.is_admin());

-- D. PRODUCTS POLICIES
CREATE POLICY "Products are readable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Only admins can modify products" ON public.products FOR ALL USING (public.is_admin());

-- E. ORDERS POLICIES
CREATE POLICY "Customers can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Customers can place their own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins have full access to orders" ON public.orders FOR ALL USING (public.is_admin());

-- F. CART ITEMS POLICIES
CREATE POLICY "Customers can manage their own cart items" ON public.cart_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins have full access to cart" ON public.cart_items FOR ALL USING (public.is_admin());

-- G. WISHLIST ITEMS POLICIES
CREATE POLICY "Customers can manage their own wishlist" ON public.wishlist_items FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins have full access to wishlist" ON public.wishlist_items FOR ALL USING (public.is_admin());

-- H. BANNERS POLICIES
CREATE POLICY "Banners are readable by everyone" ON public.banners FOR SELECT USING (true);
CREATE POLICY "Only admins can modify banners" ON public.banners FOR ALL USING (public.is_admin());

-- I. HOMEPAGE SECTIONS POLICIES
CREATE POLICY "Homepage content is readable by everyone" ON public.homepage_sections FOR SELECT USING (true);
CREATE POLICY "Only admins can modify homepage sections" ON public.homepage_sections FOR ALL USING (public.is_admin());

-- J. SETTINGS POLICIES
CREATE POLICY "Settings are readable by everyone" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Only admins can modify settings" ON public.settings FOR ALL USING (public.is_admin());

-- ==================================================
-- 5. REALTIME REPLICATION CONFIGURATION
-- ==================================================
begin;
  -- remove the publication if it exists
  drop publication if exists supabase_realtime;
  -- create publication
  create publication supabase_realtime;
commit;

-- Enable realtime for dynamic storefront operations
alter publication supabase_realtime add table public.homepage_sections;
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.products;

-- ==================================================
-- 6. STORAGE BUCKETS CONFIGURATION (SQL GUIDELINE)
-- ==================================================
-- Execute these SQL insert commands to initialize the storage buckets programmatically.
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('banners', 'banners', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('collections', 'collections', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('homepage', 'homepage', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('users', 'users', true) ON CONFLICT DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Anyone can view files in products bucket" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Anyone can view files in banners bucket" ON storage.objects FOR SELECT USING (bucket_id = 'banners');
CREATE POLICY "Anyone can view files in collections bucket" ON storage.objects FOR SELECT USING (bucket_id = 'collections');
CREATE POLICY "Anyone can view files in homepage bucket" ON storage.objects FOR SELECT USING (bucket_id = 'homepage');
CREATE POLICY "Anyone can view files in users bucket" ON storage.objects FOR SELECT USING (bucket_id = 'users');

CREATE POLICY "Admins can upload files to products bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products' AND public.is_admin());
CREATE POLICY "Admins can upload files to banners bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'banners' AND public.is_admin());
CREATE POLICY "Admins can upload files to collections bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'collections' AND public.is_admin());
CREATE POLICY "Admins can upload files to homepage bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'homepage' AND public.is_admin());
CREATE POLICY "Users can upload their own avatars to users bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'users' AND auth.uid()::text = (storage.foldername(name))[1]);
