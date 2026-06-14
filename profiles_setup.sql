-- ==================================================
-- SCHEMA MIGRATION: PROFILES & ADMIN ROLE SYSTEM
-- Run this in the Supabase SQL Editor to apply changes.
-- ==================================================

-- 1. Ensure user_role type supports staff/admin/customer
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'customer', 'staff');
    ELSE
        -- If user_role already exists, add staff to it if missing
        ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'staff';
    END IF;
END $$;

-- 2. Verify profiles table structure and add phone column
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT UNIQUE NOT NULL,
    role user_role DEFAULT 'customer'::user_role NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- If the table existed but missed the phone column, add it manually
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema='public' AND table_name='profiles' AND column_name='phone'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN phone TEXT;
    END IF;
END $$;

-- 3. Update profiles automatic insertion trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role, avatar_url, phone)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
        new.email,
        CASE 
            WHEN new.email = 'admin@coverscart.online' THEN 'admin'::user_role
            ELSE 'customer'::user_role
        END,
        new.raw_user_meta_data->>'avatar_url',
        new.raw_user_meta_data->>'phone'
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        avatar_url = EXCLUDED.avatar_url,
        phone = COALESCE(profiles.phone, EXCLUDED.phone);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-create the trigger if not exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Enable Row Level Security (RLS) on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Helper admin function
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

-- Re-create profiles policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins have full profile access" ON public.profiles;

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins have full profile access" ON public.profiles FOR ALL USING (public.is_admin());
