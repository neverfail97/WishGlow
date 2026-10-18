-- ==============================================================================
-- Supabase Database Schema & Storage Configuration for WishGlow
-- ==============================================================================
-- Run this entire script in your Supabase SQL Editor (https://supabase.com)

-- 1. Create users table for login & 5-day memory persistence
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create wishes table
CREATE TABLE IF NOT EXISTS public.wishes (
    id TEXT PRIMARY KEY,
    recipient_name TEXT NOT NULL,
    sender_name TEXT,
    occasion TEXT NOT NULL DEFAULT 'birthday',
    theme TEXT NOT NULL DEFAULT 'cake3d',
    title TEXT,
    message TEXT,
    photos JSONB DEFAULT '[]'::jsonb,
    video_url TEXT,
    audio_url TEXT,
    music_track TEXT DEFAULT 'birthday',
    custom_options JSONB DEFAULT '{}'::jsonb,
    is_paid BOOLEAN DEFAULT FALSE,
    payment_plan TEXT DEFAULT '48h_standard',
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
);

-- 3. Create reactions table
CREATE TABLE IF NOT EXISTS public.reactions (
    id TEXT PRIMARY KEY,
    wish_id TEXT REFERENCES public.wishes(id) ON DELETE CASCADE,
    reaction_type TEXT NOT NULL DEFAULT 'heart',
    sender_name TEXT,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id TEXT PRIMARY KEY,
    wish_id TEXT REFERENCES public.wishes(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL,
    amount NUMERIC(10, 2) DEFAULT 0.00,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'completed',
    payment_method TEXT,
    promo_code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 6. Policies
DROP POLICY IF EXISTS "Public users access" ON public.users;
CREATE POLICY "Public users access" ON public.users FOR ALL USING (true);

DROP POLICY IF EXISTS "Public can view wishes" ON public.wishes;
CREATE POLICY "Public can view wishes" ON public.wishes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert wishes" ON public.wishes;
CREATE POLICY "Public can insert wishes" ON public.wishes FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update wishes" ON public.wishes;
CREATE POLICY "Public can update wishes" ON public.wishes FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public can view reactions" ON public.reactions;
CREATE POLICY "Public can view reactions" ON public.reactions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can insert reactions" ON public.reactions;
CREATE POLICY "Public can insert reactions" ON public.reactions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can insert payments" ON public.payments;
CREATE POLICY "Public can insert payments" ON public.payments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view payments" ON public.payments;
CREATE POLICY "Public can view payments" ON public.payments FOR SELECT USING (true);

-- 7. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_wishes_expires_at ON public.wishes(expires_at);
CREATE INDEX IF NOT EXISTS idx_reactions_wish_id ON public.reactions(wish_id);
CREATE INDEX IF NOT EXISTS idx_payments_wish_id ON public.payments(wish_id);

-- 8. Media Storage Bucket setup
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Media Read" ON storage.objects;
CREATE POLICY "Public Media Read" ON storage.objects FOR SELECT USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Public Media Insert" ON storage.objects;
CREATE POLICY "Public Media Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media');
