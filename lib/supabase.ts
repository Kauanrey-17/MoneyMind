// Supabase client placeholder
// Ready for integration when Supabase is connected
//
// To set up:
// 1. Connect Supabase integration in v0 sidebar
// 2. Uncomment the code below
// 3. Create tables using the SQL schema at the bottom of this file
//
// import { createClient } from '@supabase/supabase-js'
//
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//
// export const supabase = createClient(supabaseUrl, supabaseAnonKey)
//
// SQL Schema for Supabase:
//
// CREATE TABLE users (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   email TEXT UNIQUE NOT NULL,
//   name TEXT NOT NULL,
//   avatar_url TEXT,
//   plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
//
// CREATE TABLE transactions (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   user_id UUID REFERENCES users(id) ON DELETE CASCADE,
//   type TEXT NOT NULL CHECK (type IN ('entrada', 'saida')),
//   category TEXT NOT NULL CHECK (category IN ('fixo', 'variavel', 'emergencia', 'investimento', 'meta')),
//   amount NUMERIC NOT NULL,
//   date DATE NOT NULL,
//   description TEXT NOT NULL,
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
//
// CREATE TABLE goals (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   user_id UUID REFERENCES users(id) ON DELETE CASCADE,
//   title TEXT NOT NULL,
//   target_amount NUMERIC NOT NULL,
//   current_amount NUMERIC DEFAULT 0,
//   deadline DATE NOT NULL,
//   category TEXT,
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
//
// CREATE TABLE investments (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   user_id UUID REFERENCES users(id) ON DELETE CASCADE,
//   name TEXT NOT NULL,
//   type TEXT NOT NULL CHECK (type IN ('renda_fixa', 'renda_variavel', 'cripto', 'fundo')),
//   amount NUMERIC NOT NULL,
//   return_rate NUMERIC NOT NULL,
//   date DATE NOT NULL,
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
//
// -- Row Level Security
// ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
// ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
// ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
//
// CREATE POLICY "Users can only see their own transactions" ON transactions
//   FOR ALL USING (auth.uid() = user_id);
//
// CREATE POLICY "Users can only see their own goals" ON goals
//   FOR ALL USING (auth.uid() = user_id);
//
// CREATE POLICY "Users can only see their own investments" ON investments
//   FOR ALL USING (auth.uid() = user_id);

export {}
