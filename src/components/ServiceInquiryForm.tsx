import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAnalytics } from '@/hooks/useAnalytics';
import { toast } from 'sonner';

const ServiceInquiryForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { trackFormSubmission } = useAnalytics();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send email notification via edge function
      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          to: 'dataquestsolutions2@gmail.com',
          subject: 'New Service Inquiry - DataQuest Solutions',
          type: 'contact',
          data: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            service: formData.service,
            message: formData.message
          }
        }
      });

      if (error) throw error;

      // Send confirmation email to customer
      await supabase.functions.invoke('send-email', {
        body: {
          to: formData.email,
          subject: 'Thank you for your inquiry - DataQuest Solutions',
          type: 'notification',
          data: {
            message: `Dear ${formData.name},\n\nThank you for your inquiry about our ${formData.service} service. We have received your message and will get back to you within 24 hours.\n\nBest regards,\nDataQuest Solutions Team`
          }
        }
      });

      // Track form submission
      trackFormSubmission('service_inquiry', {
        service: formData.service,
        has_phone: !!formData.phone
      });

      setSubmitted(true);
      toast.success('Your inquiry has been sent successfully!');
    } catch (error: any) {
      console.error('Error sending inquiry:', error);
      toast.error('Failed to send inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white text-2xl">Request a Consultation</CardTitle>
        <p className="text-gray-300 text-sm">
          Your inquiry will be sent directly to <strong>dataquestsolutions2@gmail.com</strong>
        </p>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="text-center py-8">
            <p className="text-green-400 font-medium text-lg mb-4">✅ Your inquiry has been submitted successfully!</p>
            <p className="text-gray-300">We'll get back to you within 24 hours.</p>
            <Button 
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: '', email: '', phone: '', service: '', message: '' });
              }}
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Send Another Inquiry
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="+254 700 000 000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="service" className="text-gray-300">Service of Interest *</Label>
              <Select value={formData.service} onValueChange={(value) => handleChange('service', value)} required>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Statistical Analysis">Statistical Analysis</SelectItem>
                  <SelectItem value="Time Series Analysis">Time Series Analysis</SelectItem>
                  <SelectItem value="Survival Analysis">Survival Analysis</SelectItem>
                  <SelectItem value="Spatial & GIS Analysis">Spatial & GIS Analysis</SelectItem>
                  <SelectItem value="Data Collection Services">Data Collection Services</SelectItem>
                  <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                  <SelectItem value="Deep Learning">Deep Learning</SelectItem>
                  <SelectItem value="Research Writing & Proposal Development">Research Writing & Proposal Development</SelectItem>
                  <SelectItem value="Outbreak Disease Investigation">Outbreak Disease Investigation</SelectItem>
                  <SelectItem value="Graphic Design">Graphic Design</SelectItem>
                  <SelectItem value="Epidemiology & Biostatistics Consultancy">Epidemiology & Biostatistics Consultancy</SelectItem>
                  <SelectItem value="Web Development">Web Development</SelectItem>
                  <SelectItem value="Software Development">Software Development</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-gray-300">Message *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                rows={4}
                placeholder="Tell us about your project requirements..."
                required
              />
            </div>
            
            <Button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Inquiry'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceInquiryForm;
