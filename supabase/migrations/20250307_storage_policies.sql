-- Create the user_images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('user_images', 'user_images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy for uploading files (INSERT)
CREATE POLICY "Allow authenticated users to upload their own files" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  (bucket_id = 'user_images'::text) AND 
  (auth.uid() = (storage.foldername(name))[1]::uuid)
);

-- Policy for viewing/downloading files (SELECT)
CREATE POLICY "Allow users to view their own files" ON storage.objects
FOR SELECT TO authenticated
USING (
  (bucket_id = 'user_images'::text) AND 
  (auth.uid() = (storage.foldername(name))[1]::uuid)
);

-- Policy for updating files (UPDATE)
CREATE POLICY "Allow users to update their own files" ON storage.objects
FOR UPDATE TO authenticated
USING (
  (bucket_id = 'user_images'::text) AND 
  (auth.uid() = (storage.foldername(name))[1]::uuid)
);

-- Policy for deleting files (DELETE)
CREATE POLICY "Allow users to delete their own files" ON storage.objects
FOR DELETE TO authenticated
USING (
  (bucket_id = 'user_images'::text) AND 
  (auth.uid() = (storage.foldername(name))[1]::uuid)
);

-- Optional: Public access policy for viewing files
-- Uncomment if you want to allow public access to view the files
CREATE POLICY "Allow public access to view files" ON storage.objects
FOR SELECT TO anon
USING (
  bucket_id = 'user_images'::text
); 