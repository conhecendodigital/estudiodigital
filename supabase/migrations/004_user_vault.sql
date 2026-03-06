-- 004_user_vault.sql
CREATE TABLE public.user_vault_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    platform TEXT NOT NULL,
    title TEXT,
    thumbnail_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_vault_links ENABLE ROW LEVEL SECURITY;

-- Policies for user_vault_links
CREATE POLICY "Users can insert their own vault links"
    ON public.user_vault_links FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own vault links"
    ON public.user_vault_links FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own vault links"
    ON public.user_vault_links FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vault links"
    ON public.user_vault_links FOR DELETE
    USING (auth.uid() = user_id);
