-- Create vault_references table
CREATE TABLE IF NOT EXISTS public.vault_references (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    url_original TEXT NOT NULL,
    video_path TEXT NOT NULL,
    thumbnail_url TEXT,
    analise_ia JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.vault_references ENABLE ROW LEVEL SECURITY;

-- Policies for vault_references
CREATE POLICY "Users can insert their own vault references" ON public.vault_references
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own vault references" ON public.vault_references
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own vault references" ON public.vault_references
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vault references" ON public.vault_references
    FOR DELETE USING (auth.uid() = user_id);

-- Create vault_videos bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('vault_videos', 'vault_videos', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for vault_videos storage
CREATE POLICY "Public Access for vault_videos" ON storage.objects
    FOR SELECT USING (bucket_id = 'vault_videos');

CREATE POLICY "Authenticated users can upload to vault_videos" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (bucket_id = 'vault_videos');

CREATE POLICY "Users can update their own vault_videos" ON storage.objects
    FOR UPDATE TO authenticated USING (bucket_id = 'vault_videos' AND auth.uid() = owner);

CREATE POLICY "Users can delete their own vault_videos" ON storage.objects
    FOR DELETE TO authenticated USING (bucket_id = 'vault_videos' AND auth.uid() = owner);
