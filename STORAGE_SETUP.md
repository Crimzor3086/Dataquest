# Storage Setup Guide for Profile Management

This guide will help you configure Supabase Storage for avatar uploads in your profile management system.

## Prerequisites

1. A Supabase project (already configured)
2. Supabase Dashboard access

## Storage Bucket Configuration

### 1. Create Avatar Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **Create Bucket**
4. Configure the bucket:
   - **Name**: `avatars`
   - **Public**: ✅ **Yes** (avatars need to be publicly accessible)
   - **File size limit**: `5MB` (recommended)
   - **Allowed MIME types**: `image/*` (optional, for additional security)

### 2. Configure Storage Policies

#### Public Read Policy
```sql
-- Allow public read access to avatars
CREATE POLICY "Public read access for avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');
```

#### User Upload Policy
```sql
-- Allow authenticated users to upload their own avatars
CREATE POLICY "Users can upload their own avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

#### User Update Policy
```sql
-- Allow users to update their own avatars
CREATE POLICY "Users can update their own avatars" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

#### User Delete Policy
```sql
-- Allow users to delete their own avatars
CREATE POLICY "Users can delete their own avatars" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### 3. Alternative: Simple Public Bucket

If you prefer a simpler setup, you can make the entire avatars bucket public:

```sql
-- Make avatars bucket completely public
CREATE POLICY "Public avatars access" ON storage.objects
FOR ALL USING (bucket_id = 'avatars');
```

**Note**: This allows anyone to upload avatars, which may not be ideal for production.

## File Naming Convention

The profile management system uses this naming convention for uploaded avatars:

```
{user_id}-{timestamp}.{extension}
```

Example: `123e4567-e89b-12d3-a456-426614174000-1640995200000.jpg`

This ensures:
- Unique filenames (no conflicts)
- Easy identification of file owner
- Automatic cleanup possibilities

## Storage Configuration in Code

The avatar upload functionality is already configured in the `useProfile` hook:

```typescript
// Upload to Supabase Storage
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(fileName, file, {
    cacheControl: '3600',
    upsert: true,
  });
```

## Security Considerations

### 1. File Type Validation
- Only image files are accepted (`image/*`)
- File size limit of 5MB
- Client-side validation before upload

### 2. User Isolation
- Users can only upload/update/delete their own avatars
- File names include user ID for ownership verification

### 3. Public Access
- Avatars are publicly accessible (needed for display)
- Consider implementing CDN for better performance

## Testing Avatar Upload

### 1. Test Upload Functionality
1. Go to `/profile` page
2. Click the camera icon on your avatar
3. Select an image file
4. Verify the upload succeeds

### 2. Test File Validation
1. Try uploading a non-image file (should fail)
2. Try uploading a file larger than 5MB (should fail)
3. Verify error messages are displayed

### 3. Test Avatar Removal
1. Upload an avatar
2. Click the X button to remove it
3. Verify the avatar is removed

## Troubleshooting

### Common Issues

1. **"Bucket not found" error**
   - Ensure the `avatars` bucket exists in Supabase Storage
   - Check bucket name spelling

2. **"Permission denied" error**
   - Verify storage policies are correctly configured
   - Ensure user is authenticated

3. **"File too large" error**
   - Check file size (should be < 5MB)
   - Verify bucket file size limit

4. **Avatar not displaying**
   - Check if bucket is public
   - Verify file URL is correct
   - Check browser console for errors

### Debug Steps

1. **Check Supabase Dashboard**
   - Go to Storage > avatars bucket
   - Verify files are uploaded
   - Check file permissions

2. **Check Browser Network Tab**
   - Look for failed upload requests
   - Check response status codes
   - Verify request headers

3. **Check Console Logs**
   - Look for JavaScript errors
   - Check Supabase client errors
   - Verify authentication status

## Performance Optimization

### 1. Image Compression
Consider implementing client-side image compression before upload:

```typescript
// Example image compression (you'd need to add a library like browser-image-compression)
import imageCompression from 'browser-image-compression';

const compressImage = async (file: File) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 500,
    useWebWorker: true,
  };
  
  return await imageCompression(file, options);
};
```

### 2. CDN Integration
For better performance, consider integrating with a CDN:

```typescript
// Example CDN URL transformation
const getCDNUrl = (url: string) => {
  return url.replace('supabase.co', 'your-cdn-domain.com');
};
```

### 3. Lazy Loading
Implement lazy loading for avatars:

```typescript
// Example lazy loading
<img 
  src={avatarUrl} 
  loading="lazy"
  alt="Profile"
/>
```

## Backup and Recovery

### 1. Regular Backups
- Set up automated backups of the avatars bucket
- Store backups in a separate location

### 2. Data Recovery
- Keep track of deleted avatars
- Implement soft delete for important avatars

## Monitoring

### 1. Storage Usage
- Monitor bucket size regularly
- Set up alerts for unusual usage patterns

### 2. Upload Metrics
- Track upload success/failure rates
- Monitor average file sizes
- Track user engagement with avatar features

---

**Note**: This storage setup is optimized for the profile management system. Adjust policies and limits based on your specific requirements.
