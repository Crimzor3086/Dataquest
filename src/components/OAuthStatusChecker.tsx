import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, ExternalLink, Copy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OAuthStatusProps {
  onClose?: () => void;
}

const OAuthStatusChecker: React.FC<OAuthStatusProps> = ({ onClose }) => {
  const [googleStatus, setGoogleStatus] = useState<'checking' | 'configured' | 'not-configured'>('checking');
  const [githubStatus, setGithubStatus] = useState<'checking' | 'configured' | 'not-configured'>('checking');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkOAuthStatus();
  }, []);

  const checkOAuthStatus = async () => {
    try {
      // Test Google OAuth
      try {
        const { error: googleError } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/`,
            skipBrowserRedirect: true
          }
        });
        setGoogleStatus(googleError ? 'not-configured' : 'configured');
      } catch {
        setGoogleStatus('not-configured');
      }

      // Test GitHub OAuth
      try {
        const { error: githubError } = await supabase.auth.signInWithOAuth({
          provider: 'github',
          options: {
            redirectTo: `${window.location.origin}/`,
            skipBrowserRedirect: true
          }
        });
        setGithubStatus(githubError ? 'not-configured' : 'configured');
      } catch {
        setGithubStatus('not-configured');
      }
    } catch (error) {
      console.error('Error checking OAuth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'configured':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'not-configured':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'configured':
        return <Badge variant="default" className="bg-green-500">Configured</Badge>;
      case 'not-configured':
        return <Badge variant="destructive">Not Configured</Badge>;
      default:
        return <Badge variant="secondary">Checking...</Badge>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-blue-800/90 border-blue-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            OAuth Configuration Status
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-blue-700">
                <XCircle className="w-4 h-4" />
              </Button>
            )}
          </CardTitle>
          <CardDescription className="text-blue-200">
            Check the status of your OAuth providers and get setup instructions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Google OAuth Status */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-white font-medium">Google OAuth</span>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(googleStatus)}
                {getStatusBadge(googleStatus)}
              </div>
            </div>
            
            {googleStatus === 'not-configured' && (
              <Alert className="bg-red-900/20 border-red-500/30">
                <AlertDescription className="text-red-200">
                  <strong>Google OAuth is not configured.</strong>
                  <br />
                  Follow these steps to set it up:
                  <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                    <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">Google Cloud Console</a></li>
                    <li>Create OAuth 2.0 credentials</li>
                    <li>Add redirect URI: <code className="bg-gray-800 px-1 rounded text-xs">https://jceggjtlmvaocivekhba.supabase.co/auth/v1/callback</code></li>
                    <li>Configure in Supabase Dashboard → Authentication → Providers</li>
                  </ol>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* GitHub OAuth Status */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="text-white font-medium">GitHub OAuth</span>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(githubStatus)}
                {getStatusBadge(githubStatus)}
              </div>
            </div>
            
            {githubStatus === 'not-configured' && (
              <Alert className="bg-red-900/20 border-red-500/30">
                <AlertDescription className="text-red-200">
                  <strong>GitHub OAuth is not configured.</strong>
                  <br />
                  Follow these steps to set it up:
                  <ol className="list-decimal list-inside mt-2 space-y-1 text-sm">
                    <li>Go to <a href="https://github.com/settings/developers" target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:underline">GitHub Developer Settings</a></li>
                    <li>Create a new OAuth App</li>
                    <li>Set Authorization callback URL: <code className="bg-gray-800 px-1 rounded text-xs">https://jceggjtlmvaocivekhba.supabase.co/auth/v1/callback</code></li>
                    <li>Configure in Supabase Dashboard → Authentication → Providers</li>
                  </ol>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => window.open('https://supabase.com/dashboard/project/jceggjtlmvaocivekhba/auth/providers', '_blank')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Supabase Dashboard
            </Button>
            <Button
              onClick={() => copyToClipboard('https://jceggjtlmvaocivekhba.supabase.co/auth/v1/callback')}
              variant="outline"
              className="flex-1 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Callback URL
            </Button>
          </div>

          {/* Instructions */}
          <div className="bg-blue-900/30 border border-blue-600/30 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Quick Setup Instructions:</h4>
            <ol className="text-blue-200 text-sm space-y-1 list-decimal list-inside">
              <li>Open your Supabase Dashboard</li>
              <li>Go to Authentication → Providers</li>
              <li>Enable Google and/or GitHub</li>
              <li>Enter your OAuth app credentials</li>
              <li>Save the configuration</li>
              <li>Test the OAuth buttons on the login page</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthStatusChecker;
