# 🚀 Backend Deployment Guide

This guide will help you deploy your Supabase backend including Edge Functions, database schema, and storage configuration.

## 📋 Prerequisites

1. **Supabase Account**: You already have a Supabase project (`jceggjtlmvaocivekhba`)
2. **Supabase CLI**: Installed locally in the project
3. **Environment Variables**: Access to your Supabase project settings

## 🔧 Setup Steps

### 1. Link to Existing Supabase Project

```bash
# Link to your existing Supabase project
npx supabase link --project-ref jceggjtlmvaocivekhba

# You'll need to provide your database password when prompted
```

### 2. Set Up Environment Variables

Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
SUPABASE_URL=https://jceggjtlmvaocivekhba.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjZWdnanRsbXZhb2NpdmVraGJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1NzkzNjksImV4cCI6MjA2NTE1NTM2OX0.itkE71TeF1m3tqRRd0Zgsth0tkfRqS1e2RqbJL-OTZA

# Email Configuration (for Edge Functions)
GMAIL_USER=dataquestsolutions2@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password

# M-Pesa Configuration (for production)
MPESA_CONSUMER_KEY_LIVE=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET_LIVE=your_mpesa_consumer_secret
MPESA_SHORTCODE_LIVE=your_mpesa_shortcode
MPESA_PASSKEY_LIVE=your_mpesa_passkey
MPESA_ENV=live

# PayPal Configuration (for production)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_ENVIRONMENT=sandbox  # or 'live' for production
```

### 3. Deploy Database Schema

```bash
# Push the database migrations to your Supabase project
npx supabase db push

# This will apply all migrations in the supabase/migrations/ directory
```

### 4. Deploy Edge Functions

```bash
# Deploy all Edge Functions
npx supabase functions deploy

# Or deploy individual functions:
npx supabase functions deploy send-email
npx supabase functions deploy send-contact-email
npx supabase functions deploy send-webinar-registration
npx supabase functions deploy mpesa-status
```

### 5. Set Up Storage Buckets

```bash
# Create the avatars bucket for profile management
npx supabase storage create avatars --public

# Create other buckets as needed
npx supabase storage create documents --public
npx supabase storage create course-materials --public
```

### 6. Configure Storage Policies

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Allow public read access to avatars
CREATE POLICY "Public read access for avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Allow authenticated users to upload their own avatars
CREATE POLICY "Users can upload their own avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own avatars
CREATE POLICY "Users can update their own avatars" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete their own avatars" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## 🔐 Environment Variables in Supabase

### Set Edge Function Secrets

In your Supabase Dashboard:

1. Go to **Settings** → **Edge Functions**
2. Add the following secrets:

```
GMAIL_USER=dataquestsolutions2@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password
MPESA_CONSUMER_KEY_LIVE=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET_LIVE=your_mpesa_consumer_secret
MPESA_SHORTCODE_LIVE=your_mpesa_shortcode
MPESA_PASSKEY_LIVE=your_mpesa_passkey
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
```

## 🧪 Testing the Deployment

### 1. Test Edge Functions

```bash
# Test the contact email function
curl -X POST 'https://jceggjtlmvaocivekhba.supabase.co/functions/v1/send-contact-email' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Subject",
    "message": "Test message"
  }'
```

### 2. Test Database Connection

```bash
# Test database connection
npx supabase db ping
```

### 3. Test Storage

```bash
# List storage buckets
npx supabase storage list
```

## 📊 Monitoring and Logs

### View Edge Function Logs

```bash
# View logs for all functions
npx supabase functions logs

# View logs for specific function
npx supabase functions logs send-email
```

### Monitor in Supabase Dashboard

1. **Edge Functions**: Go to **Edge Functions** tab to see function status
2. **Database**: Go to **Database** tab to monitor queries
3. **Storage**: Go to **Storage** tab to monitor file uploads
4. **Logs**: Go to **Logs** tab to view system logs

## 🚨 Troubleshooting

### Common Issues

1. **Function Deployment Fails**
   ```bash
   # Check function syntax
   npx supabase functions serve --no-verify-jwt
   
   # Test locally first
   npx supabase functions serve
   ```

2. **Database Migration Fails**
   ```bash
   # Check migration status
   npx supabase migration list
   
   # Reset if needed (WARNING: This will delete data)
   npx supabase db reset
   ```

3. **Storage Access Denied**
   - Check storage policies in Supabase Dashboard
   - Verify bucket permissions
   - Check RLS policies

4. **Environment Variables Not Working**
   - Verify secrets are set in Supabase Dashboard
   - Check variable names match exactly
   - Restart Edge Functions after adding secrets

### Debug Commands

```bash
# Check project status
npx supabase status

# View project configuration
npx supabase projects list

# Check database connection
npx supabase db ping

# View function logs
npx supabase functions logs --follow
```

## 🔄 CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Supabase

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Deploy Edge Functions
        run: npx supabase functions deploy
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          
      - name: Deploy Database
        run: npx supabase db push
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

## 📈 Performance Optimization

### Edge Function Optimization

1. **Cold Start Reduction**
   - Keep functions lightweight
   - Use connection pooling
   - Cache frequently used data

2. **Database Optimization**
   - Add indexes for frequently queried columns
   - Use prepared statements
   - Monitor query performance

3. **Storage Optimization**
   - Compress images before upload
   - Use CDN for static assets
   - Implement lazy loading

## 🔒 Security Checklist

- [ ] All environment variables are properly secured
- [ ] RLS policies are correctly configured
- [ ] Edge Functions have proper authentication
- [ ] Storage buckets have appropriate permissions
- [ ] API keys are not exposed in client code
- [ ] CORS headers are properly configured

## 📞 Support

If you encounter issues:

1. Check Supabase documentation: https://supabase.com/docs
2. Review Edge Function logs
3. Check database logs in Supabase Dashboard
4. Verify environment variables and secrets

---

**Note**: This deployment guide assumes you have the necessary permissions and access to your Supabase project. Make sure to test all functions thoroughly before going to production.
