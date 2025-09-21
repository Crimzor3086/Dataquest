
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SystemSettings {
  company_name: string;
  timezone: string;
  currency: string;
  language: string;
  allow_registration: boolean;
  email_verification: boolean;
  two_factor_auth: boolean;
  smtp_host: string;
  smtp_port: string;
  from_email: string;
  session_timeout: number;
  password_complexity: boolean;
  payment_gateway: string;
  analytics_service: string;
}

export const useSystemSettings = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    company_name: 'DataQuest Solutions',
    timezone: 'Africa/Nairobi',
    currency: 'KES',
    language: 'English',
    allow_registration: true,
    email_verification: false,
    two_factor_auth: true,
    smtp_host: '',
    smtp_port: '587',
    from_email: '',
    session_timeout: 30,
    password_complexity: true,
    payment_gateway: '',
    analytics_service: ''
  });
  
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadSettings = async () => {
    try {
      setLoading(true);
      // Use type assertion to work around TypeScript issues
      const { data, error } = await (supabase as any)
        .from('system_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading settings:', error);
        return;
      }

      if (data) {
        setSettings({
          company_name: data.company_name || 'DataQuest Solutions',
          timezone: data.timezone || 'Africa/Nairobi',
          currency: data.currency || 'KES',
          language: data.language || 'English',
          allow_registration: data.allow_registration ?? true,
          email_verification: data.email_verification ?? false,
          two_factor_auth: data.two_factor_auth ?? true,
          smtp_host: data.smtp_host || '',
          smtp_port: data.smtp_port || '587',
          from_email: data.from_email || '',
          session_timeout: data.session_timeout || 30,
          password_complexity: data.password_complexity ?? true,
          payment_gateway: data.payment_gateway || '',
          analytics_service: data.analytics_service || ''
        });
      }
    } catch (error) {
      console.error('Error in loadSettings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: Partial<SystemSettings>) => {
    try {
      setLoading(true);
      
      const updatedSettings = { ...settings, ...newSettings };
      
      // Use type assertion to work around TypeScript issues
      const { error } = await (supabase as any)
        .from('system_settings')
        .upsert({
          id: 1,
          ...updatedSettings,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving settings:', error);
        toast({
          title: "Error",
          description: "Failed to save settings. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      setSettings(updatedSettings);
      toast({
        title: "Success",
        description: "Settings saved successfully!"
      });
      
      return true;
    } catch (error) {
      console.error('Error in saveSettings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase.functions.invoke('create-backup');
      
      if (error) {
        console.error('Error creating backup:', error);
        toast({
          title: "Error",
          description: "Failed to create backup. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Database backup created successfully!"
      });
    } catch (error) {
      console.error('Error in createBackup:', error);
      toast({
        title: "Error",
        description: "Failed to create backup. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    settings,
    loading,
    saveSettings,
    createBackup
  };
};
