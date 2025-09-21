import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';
import { useWebinarMutations } from '@/hooks/useWebinarManagement';
import { useAnalytics } from '@/hooks/useAnalytics';

interface WebinarRegistrationFormProps {
  webinarId: string;
  webinarTitle: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const WebinarRegistrationForm: React.FC<WebinarRegistrationFormProps> = ({
  webinarId,
  webinarTitle,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: ''
  });
  const [loading, setLoading] = useState(false);

  const { registerForWebinar } = useWebinarMutations();
  const { trackFormSubmission } = useAnalytics();

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save to database
      const { error } = await supabase
        .from('webinar_registrations')
        .insert({
          webinar_id: webinarId,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          position: formData.position
        });

      if (error) throw error;

      // Send confirmation email to user and notification to admin
      await supabase.functions.invoke('send-webinar-confirmation', {
        body: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          webinarTitle,
          webinarDate: new Date().toLocaleDateString(),
          webinarTime: new Date().toLocaleTimeString(),
          timezone: 'Africa/Nairobi'
        }
      });

      // Send notification to admin
      await supabase.functions.invoke('send-webinar-registration', {
        body: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          position: formData.position,
          webinarTitle,
          webinarId
        }
      });

      trackFormSubmission('webinar_registration', { webinar_id: webinarId, email: formData.email });
      toast.success('Registration successful! Check your email for confirmation details.');
      onSuccess();
    } catch (error: any) {
      toast.error('Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-blue-800/50 border-blue-700">
      <CardHeader>
        <CardTitle className="text-white text-center">
          <UserPlus className="w-6 h-6 mx-auto mb-2" />
          Register for Webinar
        </CardTitle>
        <p className="text-blue-200 text-sm text-center">{webinarTitle}</p>
        <p className="text-blue-300 text-xs text-center">
          You will receive a confirmation email with webinar details
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName" className="text-blue-200">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="bg-blue-700 border-blue-600 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName" className="text-blue-200">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="bg-blue-700 border-blue-600 text-white"
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email" className="text-blue-200">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="bg-blue-700 border-blue-600 text-white"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-blue-200">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="bg-blue-700 border-blue-600 text-white"
            />
          </div>

          <div>
            <Label htmlFor="company" className="text-blue-200">Company</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className="bg-blue-700 border-blue-600 text-white"
            />
          </div>

          <div>
            <Label htmlFor="position" className="text-blue-200">Position</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              className="bg-blue-700 border-blue-600 text-white"
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 border-blue-600 text-blue-200 hover:bg-blue-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default WebinarRegistrationForm;