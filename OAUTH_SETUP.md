# OAuth Setup Guide for DataQuest Solutions

This guide will help you configure GitHub and Google OAuth providers in your Supabase project.

## Prerequisites

1. A Supabase project (already configured)
2. GitHub Developer Account
3. Google Cloud Console Account

## GitHub OAuth Setup

### 1. Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: `DataQuest Solutions`
   - **Homepage URL**: `https://your-domain.com` (replace with your actual domain)
   - **Authorization callback URL**: `https://jceggjtlmvaocivekhba.supabase.co/auth/v1/callback`
4. Click "Register application"
5. Copy the **Client ID** and **Client Secret**

### 2. Configure in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** > **Providers**
3. Find **GitHub** and enable it
4. Enter your GitHub OAuth App credentials:
   - **Client ID**: (from GitHub OAuth App)
   - **Client Secret**: (from GitHub OAuth App)
5. Save the configuration

## Google OAuth Setup

### 1. Create Google OAuth App

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google+ API**:
   - Go to **APIs & Services** > **Library**
   - Search for "Google+ API" and enable it
4. Create OAuth credentials:
   - Go to **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **OAuth 2.0 Client IDs**
   - Choose **Web application**
   - Add authorized redirect URIs:
     - `https://jceggjtlmvaocivekhba.supabase.co/auth/v1/callback`
   - Copy the **Client ID** and **Client Secret**

### 2. Configure in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** > **Providers**
3. Find **Google** and enable it
4. Enter your Google OAuth App credentials:
   - **Client ID**: (from Google Cloud Console)
   - **Client Secret**: (from Google Cloud Console)
5. Save the configuration

## Testing OAuth Integration

### 1. Test GitHub Login

1. Go to your login page
2. Click the **GitHub** button
3. You should be redirected to GitHub for authorization
4. After authorization, you should be redirected back to your app

### 2. Test Google Login

1. Go to your login page
2. Click the **Google** button
3. You should be redirected to Google for authorization
4. After authorization, you should be redirected back to your app

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**
   - Ensure the callback URL in your OAuth app matches exactly: `https://jceggjtlmvaocivekhba.supabase.co/auth/v1/callback`

2. **"Client ID not found"**
   - Double-check that you've entered the correct Client ID in Supabase
   - Ensure the OAuth app is properly created

3. **"Access denied"**
   - Check that the OAuth app is enabled in Supabase
   - Verify the Client Secret is correct

### Environment Variables

If you need to use environment variables for OAuth credentials, you can set them in your Supabase project:

```bash
# In your Supabase project settings
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Security Notes

1. **Never commit OAuth secrets to version control**
2. **Use environment variables for production**
3. **Regularly rotate your OAuth secrets**
4. **Monitor OAuth usage in your Supabase dashboard**

## Additional Configuration

### Custom Redirect URLs

If you need custom redirect URLs after OAuth login, you can modify the `redirectTo` option in the AuthContext:

```typescript
const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard` // Custom redirect
    }
  });
  return { error };
};
```

### User Profile Data

OAuth providers will automatically populate user profile data. You can access this data in your AuthContext:

```typescript
// In your auth state change handler
if (session?.user) {
  const userMetadata = session.user.user_metadata;
  console.log('User name:', userMetadata.full_name);
  console.log('User avatar:', userMetadata.avatar_url);
}
```

## Support

If you encounter any issues with OAuth setup, please check:

1. Supabase documentation: https://supabase.com/docs/guides/auth/social-login
2. GitHub OAuth documentation: https://docs.github.com/en/developers/apps/building-oauth-apps
3. Google OAuth documentation: https://developers.google.com/identity/protocols/oauth2

---

**Note**: Replace `https://jceggjtlmvaocivekhba.supabase.co` with your actual Supabase project URL if different.
