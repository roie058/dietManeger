-- ==============================================================================
-- NutriFlow - Supabase Cloud Sync Schema & Row Level Security (RLS)
-- Run this script in your Supabase project's "SQL Editor"
-- ==============================================================================

-- 1. Create table for user synchronization
CREATE TABLE IF NOT EXISTS public.nutriflow_user_data (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    client_updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 2. Enable Row Level Security (RLS) so each user can ONLY access their own data
ALTER TABLE public.nutriflow_user_data ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Users can view their own data
DROP POLICY IF EXISTS "Users can read own data" ON public.nutriflow_user_data;
CREATE POLICY "Users can read own data" 
ON public.nutriflow_user_data 
FOR SELECT 
USING (auth.uid() = user_id);

-- 4. Policy: Users can insert their own data
DROP POLICY IF EXISTS "Users can insert own data" ON public.nutriflow_user_data;
CREATE POLICY "Users can insert own data" 
ON public.nutriflow_user_data 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 5. Policy: Users can update their own data
DROP POLICY IF EXISTS "Users can update own data" ON public.nutriflow_user_data;
CREATE POLICY "Users can update own data" 
ON public.nutriflow_user_data 
FOR UPDATE 
USING (auth.uid() = user_id);

-- 6. Policy: Users can delete their own data
DROP POLICY IF EXISTS "Users can delete own data" ON public.nutriflow_user_data;
CREATE POLICY "Users can delete own data" 
ON public.nutriflow_user_data 
FOR DELETE 
USING (auth.uid() = user_id);

-- 7. Trigger to automatically update updated_at timestamp on row modification
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_nutriflow_user_data_updated ON public.nutriflow_user_data;
CREATE TRIGGER on_nutriflow_user_data_updated
    BEFORE UPDATE ON public.nutriflow_user_data
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 8. Enable Realtime broadcast on this table so updates propagate live across phone & computer
ALTER TABLE public.nutriflow_user_data REPLICA IDENTITY FULL;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'nutriflow_user_data'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.nutriflow_user_data;
  END IF;
END $$;

-- Done! Your NutriFlow database is fully secured and ready for live conflict-free cross-device sync.

