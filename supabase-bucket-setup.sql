-- ============================================================================
-- SUPABASE STORAGE BUCKET SETUP
-- Run these commands in your Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- CLEANUP: Remove existing policies and buckets
-- ============================================================================

-- Remove existing policies (ignore errors if they don't exist)
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public downloads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view" ON storage.objects;

-- Remove existing buckets (ignore errors if they don't exist)
DELETE FROM storage.buckets WHERE id = 'user-uploads';
DELETE FROM storage.buckets WHERE id = 'clothing-items';

-- ============================================================================
-- CREATE NEW BUCKET
-- ============================================================================

-- 1. Create the storage bucket (replace 'clothing-items' with your desired bucket name)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'clothing-items',         -- Bucket ID (must be unique)
  'clothing-items',         -- Bucket name 
  true,                     -- Make it public for faster access
  52428800,                 -- 50MB file size limit (in bytes)
  ARRAY[                    -- Allowed MIME types
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp'
  ]
);

-- ============================================================================
-- STORAGE POLICIES (Public Read/Write Access)
-- ============================================================================

-- 2. Policy: Allow anyone to upload files
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'clothing-items'
);

-- 3. Policy: Allow anyone to view/download files  
CREATE POLICY "Allow public downloads" ON storage.objects
FOR SELECT USING (
  bucket_id = 'clothing-items'
);

-- 4. Policy: Allow users to update their own files (optional)
CREATE POLICY "Allow authenticated users to update files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'clothing-items' AND 
  auth.role() = 'authenticated'
);

-- 5. Policy: Allow users to delete their own files (optional)
CREATE POLICY "Allow authenticated users to delete files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'clothing-items' AND 
  auth.role() = 'authenticated'
);

-- ============================================================================
-- ALTERNATIVE: More Restrictive Setup (Authenticated Users Only)
-- Uncomment these if you want to restrict access to authenticated users only
-- ============================================================================

/*
-- Create bucket for authenticated users only
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'private-uploads',
  'private-uploads', 
  false,                    -- Private bucket
  52428800,                 -- 50MB limit
  ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png', 
    'image/gif',
    'image/webp'
  ]
);

-- Authenticated users can upload
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'private-uploads' AND 
  auth.role() = 'authenticated'
);

-- Authenticated users can view files
CREATE POLICY "Authenticated users can view" ON storage.objects  
FOR SELECT USING (
  bucket_id = 'private-uploads' AND
  auth.role() = 'authenticated'
);
*/

-- ============================================================================
-- VERIFY BUCKET CREATION
-- Run this to confirm your bucket was created successfully
-- ============================================================================

-- Check if bucket exists
SELECT * FROM storage.buckets WHERE id = 'clothing-items';

-- Check bucket policies
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage'; 