-- Create storage bucket for shared files
INSERT INTO storage.buckets (id, name, public) VALUES ('shared-files', 'shared-files', true);

-- Create a table to track uploaded files
CREATE TABLE public.files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- Users can view their own files
CREATE POLICY "Users can view their own files" ON public.files
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own files
CREATE POLICY "Users can insert their own files" ON public.files
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own files
CREATE POLICY "Users can delete their own files" ON public.files
  FOR DELETE USING (auth.uid() = user_id);

-- Storage policies - anyone can view (public sharing)
CREATE POLICY "Public read access for shared files" ON storage.objects
  FOR SELECT USING (bucket_id = 'shared-files');

-- Authenticated users can upload to their own folder
CREATE POLICY "Users can upload files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'shared-files' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can delete their own files
CREATE POLICY "Users can delete their files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'shared-files' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );