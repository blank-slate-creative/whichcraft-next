-- Update the user_images bucket to be public
UPDATE storage.buckets
SET public = true
WHERE id = 'user_images';

-- Add public access policy for viewing files
CREATE POLICY "Allow public access to view files" ON storage.objects
FOR SELECT TO anon
USING (
  bucket_id = 'user_images'::text
); 