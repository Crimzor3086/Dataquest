import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Users, Mail, Database, Shield, Globe } from 'lucide-react';
import { useSystemSettings } from '@/hooks/useSystemSettings';
import { useState, useEffect } from 'react';

const SystemSettings = () => {
  const { settings, loading, saveSettings, createBackup } = useSystemSettings();
  const [formData, setFormData] = useState(settings);

  // Update form data when settings change
  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleGeneralSave = async () => {
    await saveSettings({
      company_name: formData.company_name,
      timezone: formData.timezone,
      currency: formData.currency,
      language: formData.language
    });
  };

  const handleUserSettingsSave = async () => {
    await saveSettings({
      allow_registration: formData.allow_registration,
      email_verification: formData.email_verification,
      two_factor_auth: formData.two_factor_auth
    });
  };

  const handleNotificationsSave = async () => {
    await saveSettings({
      smtp_host: formData.smtp_host,
      smtp_port: formData.smtp_port,
      from_email: formData.from_email
    });
  };

  const handleSecuritySave = async () => {
    await saveSettings({
      session_timeout: formData.session_timeout,
      password_complexity: formData.password_complexity
    });
  };

  const handleIntegrationsSave = async () => {
    await saveSettings({
      payment_gateway: formData.payment_gateway,
      analytics_service: formData.analytics_service
    });
  };

  const settingsCategories = [
    {
      id: 'general',
      title: 'General Settings',
      icon: Settings,
      description: 'Basic system configuration and preferences'
    },
    {
      id: 'users',
      title: 'User Management',
      icon: Users,
      description: 'User roles, permissions, and access controls'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Mail,
      description: 'Email and system notification settings'
    },
    {
      id: 'database',
      title: 'Database',
      icon: Database,
      description: 'Database backup and maintenance settings'
    },
    {
      id: 'security',
      title: 'Security',
      icon: Shield,
      description: 'Security policies and authentication settings'
    },
    {
      id: 'integrations',
      title: 'Integrations',
      icon: Globe,
      description: 'Third-party service integrations'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navigation />
      <WhatsAppButton />
      
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">System Settings</h1>
            <p className="text-gray-400">Configure system preferences, user permissions, and integrations</p>
          </div>

          <Tabs defaultValue="general" className="space-y-8">
            <TabsList className="grid w-full grid-cols-6 bg-gray-800/50">
              {settingsCategories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id} 
                  className="data-[state=active]:bg-blue-600"
                >
                  {category.title}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="general">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">General Settings</CardTitle>
                  <CardDescription className="text-gray-400">Basic system configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="company-name" className="text-white">Company Name</Label>
                      <Input
                        id="company-name"
                        value={formData.company_name}
                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone" className="text-white">Timezone</Label>
                      <Input
                        id="timezone"
                        value={formData.timezone}
                        onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency" className="text-white">Default Currency</Label>
                      <Input
                        id="currency"
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language" className="text-white">Default Language</Label>
                      <Input
                        id="language"
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handleGeneralSave}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">User Management</CardTitle>
                  <CardDescription className="text-gray-400">Manage user roles and permissions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Allow User Registration</Label>
                        <p className="text-sm text-gray-400">Allow new users to register accounts</p>
                      </div>
                      <Switch 
                        checked={formData.allow_registration}
                        onCheckedChange={(checked) => setFormData({ ...formData, allow_registration: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Email Verification Required</Label>
                        <p className="text-sm text-gray-400">Require email verification for new accounts</p>
                      </div>
                      <Switch 
                        checked={formData.email_verification}
                        onCheckedChange={(checked) => setFormData({ ...formData, email_verification: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-400">Enable 2FA for enhanced security</p>
                      </div>
                      <Switch 
                        checked={formData.two_factor_auth}
                        onCheckedChange={(checked) => setFormData({ ...formData, two_factor_auth: checked })}
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handleUserSettingsSave}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? 'Updating...' : 'Update Settings'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Notification Settings</CardTitle>
                  <CardDescription className="text-gray-400">Configure email and system notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-host" className="text-white">SMTP Host</Label>
                      <Input
                        id="smtp-host"
                        value={formData.smtp_host}
                        onChange={(e) => setFormData({ ...formData, smtp_host: e.target.value })}
                        placeholder="smtp.gmail.com"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-port" className="text-white">SMTP Port</Label>
                      <Input
                        id="smtp-port"
                        value={formData.smtp_port}
                        onChange={(e) => setFormData({ ...formData, smtp_port: e.target.value })}
                        placeholder="587"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="from-email" className="text-white">From Email</Label>
                      <Input
                        id="from-email"
                        value={formData.from_email}
                        onChange={(e) => setFormData({ ...formData, from_email: e.target.value })}
                        placeholder="noreply@dataquestsolutions.com"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handleNotificationsSave}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? 'Saving...' : 'Save Email Settings'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="database">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Database Management</CardTitle>
                  <CardDescription className="text-gray-400">Database backup and maintenance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button 
                      onClick={createBackup}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Database className="w-4 h-4 mr-2" />
                      {loading ? 'Creating...' : 'Create Backup'}
                    </Button>
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      View Backups
                    </Button>
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      Restore Database
                    </Button>
                  </div>
                  <div className="bg-gray-700/30 p-4 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Last Backup</h4>
                    <p className="text-gray-400 text-sm">June 12, 2024 at 3:00 AM</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Security Settings</CardTitle>
                  <CardDescription className="text-gray-400">Security policies and authentication</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Session Timeout</Label>
                        <p className="text-sm text-gray-400">Automatically logout inactive users</p>
                      </div>
                      <Input 
                        className="w-32 bg-gray-700 border-gray-600 text-white" 
                        value={formData.session_timeout}
                        onChange={(e) => setFormData({ ...formData, session_timeout: parseInt(e.target.value) || 30 })}
                        placeholder="Minutes"
                        type="number"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Password Complexity</Label>
                        <p className="text-sm text-gray-400">Require strong passwords</p>
                      </div>
                      <Switch 
                        checked={formData.password_complexity}
                        onCheckedChange={(checked) => setFormData({ ...formData, password_complexity: checked })}
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handleSecuritySave}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? 'Updating...' : 'Update Security Settings'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Third-Party Integrations</CardTitle>
                  <CardDescription className="text-gray-400">Configure external service integrations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="payment-gateway" className="text-white">Payment Gateway</Label>
                      <Input
                        id="payment-gateway"
                        value={formData.payment_gateway}
                        onChange={(e) => setFormData({ ...formData, payment_gateway: e.target.value })}
                        placeholder="M-Pesa, Stripe"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="analytics" className="text-white">Analytics Service</Label>
                      <Input
                        id="analytics"
                        value={formData.analytics_service}
                        onChange={(e) => setFormData({ ...formData, analytics_service: e.target.value })}
                        placeholder="Google Analytics"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handleIntegrationsSave}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? 'Saving...' : 'Save Integration Settings'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SystemSettings;
