import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useGA4Analytics } from '@/hooks/useGA4Analytics';
import { useAnalytics } from '@/hooks/useAnalytics';

const ContactForm = () => {
  const ga4 = useGA4Analytics();
  const { trackFormSubmission } = useAnalytics();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Track form submission attempt (GA4 + Supabase)
      ga4.trackFormSubmission('contact_form', {
        form_type: 'contact',
        has_phone: !!formData.phone,
        message_length: formData.message?.length || 0,
        subject_category: formData.subject
      });
      trackFormSubmission('contact_form', formData);

      // Send email notification via edge function
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message
        }
      });

      if (error) throw error;

      // Track successful submission
      ga4.trackConversion('contact_form_success', 1);
      ga4.trackEvent('lead_generated', {
        lead_source: 'contact_form',
        lead_type: 'inquiry'
      });

      setSubmitted(true);
      toast.success('Your message has been sent successfully!');
    } catch (error: any) {
      console.error('Error sending message:', error);
      
      // Track failed submission
      ga4.trackEvent('form_submission_error', {
        form_name: 'contact_form',
        error_type: 'submission_failed'
      });
      
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white text-2xl">Send Us a Message</CardTitle>
        <p className="text-blue-200 text-sm">
          We'll get back to you within 24 hours at <strong>dataquestsolutions2@gmail.com</strong>
        </p>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="text-center py-8">
            <p className="text-green-400 font-medium text-lg mb-4">✅ Your message has been sent successfully!</p>
            <p className="text-blue-200">We'll get back to you within 24 hours.</p>
            <Button 
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
              }}
              className="mt-4 bg-blue-600 hover:bg-blue-700"
            >
              Send Another Message
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder-white/60"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder-white/60"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder-white/60"
                  placeholder="+254 700 000 000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-white">Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder-white/60"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-white">Message *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder-white/60"
                rows={4}
                placeholder="Tell us about your inquiry..."
                required
              />
            </div>
            
            <Button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactForm;