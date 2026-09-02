-- ========================================================
-- RESONANCE CARE V2 - SUPABASE DATABASE SCHEMA
-- PostgreSQL Table Definitions for Production
-- ========================================================

-- 1. Users Table (회원 정보)
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    invite_code TEXT,
    grade TEXT DEFAULT 'VIP',
    assigned_partner TEXT DEFAULT '김복선 치유사',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Checkins Table (데일리 상태 체크)
CREATE TABLE IF NOT EXISTS public.checkins (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    condition INTEGER NOT NULL,
    sleep INTEGER NOT NULL,
    mind INTEGER NOT NULL,
    discomfort INTEGER NOT NULL,
    memo TEXT,
    submitted_at TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Care Plan Tasks Table (7일 개인 케어 플랜)
CREATE TABLE IF NOT EXISTS public.care_plan_tasks (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    task_id TEXT NOT NULL,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Community Posts Table (커뮤니티 안부 글)
CREATE TABLE IF NOT EXISTS public.community_posts (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    author TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Messages Table (1:1 치유사 메시지)
CREATE TABLE IF NOT EXISTS public.messages (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    sender TEXT NOT NULL, -- 'member' or 'partner'
    text TEXT NOT NULL,
    time TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Enable Row Level Security (RLS) & Public Access Policies for Web Client
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_plan_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public insert users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update users" ON public.users FOR UPDATE USING (true);

CREATE POLICY "Allow public read checkins" ON public.checkins FOR SELECT USING (true);
CREATE POLICY "Allow public insert checkins" ON public.checkins FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read tasks" ON public.care_plan_tasks FOR SELECT USING (true);
CREATE POLICY "Allow public all tasks" ON public.care_plan_tasks FOR ALL USING (true);

CREATE POLICY "Allow public read posts" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Allow public insert posts" ON public.community_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update posts" ON public.community_posts FOR UPDATE USING (true);

CREATE POLICY "Allow public read messages" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert messages" ON public.messages FOR INSERT WITH CHECK (true);
