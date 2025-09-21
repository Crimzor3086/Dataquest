import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Mail, Phone, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useGA4Analytics } from '@/hooks/useGA4Analytics';
import { useAnalytics } from '@/hooks/useAnalytics';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  urgency: 'low' | 'medium' | 'high';
  preferredContact: 'email' | 'phone' | 'whatsapp';
}

const EnhancedContactForm: React.FC = () => {
  const ga4 = useGA4Analytics();
  const { trackFormSubmission } = useAnalytics();
  
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    urgency: 'medium',
    preferredContact: 'email'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const contactReasons = [
    'General Inquiry',
    'Course Registration',
    'Data Analysis Services',
    'Machine Learning Consultation',
    'Graphic Design Services',
    'Web Development',
    'Software Development',
    'Epidemiology Consultation',
    'Marketing Strategy',
    'Technical Support',
    'Partnership Inquiry',
    'Media & Press'
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    if (formData.phone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      // Track form submission attempt
      ga4.trackFormSubmission('enhanced_contact_form', {
        form_type: 'contact',
        subject_category: formData.subject,
        urgency: formData.urgency,
        preferred_contact: formData.preferredContact,
        has_phone: !!formData.phone,
        message_length: formData.message.length
      });

      trackFormSubmission('enhanced_contact_form', {
        subject: formData.subject,
        urgency: formData.urgency,
        preferred_contact: formData.preferredContact
      });

      // Send email notification via edge function with enhanced data
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          firstName: formData.name.split(' ')[0],
          lastName: formData.name.split(' ').slice(1).join(' '),
          email: formData.email,
          phone: formData.phone,
          reason: formData.subject,
          message: formData.message,
          urgency: formData.urgency,
          preferredContact: formData.preferredContact,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          pageUrl: window.location.href
        }
      });

      if (error) {
        console.error('Contact form submission error:', error);
        throw error;
      }

      // Send confirmation email to user
      await supabase.functions.invoke('send-email', {
        body: {
          to: formData.email,
          subject: 'Thank you for contacting DataQuest Solutions',
          type: 'contact_confirmation',
          data: {
            name: formData.name,
            subject: formData.subject,
            urgency: formData.urgency,
            expectedResponse: formData.urgency === 'high' ? '2-4 hours' : 
                            formData.urgency === 'medium' ? '4-8 hours' : '24 hours'
          }
        }
      });

      // Track successful submission
      ga4.trackConversion('contact_form_success', 1);
      ga4.trackEvent('lead_generated', {
        lead_source: 'enhanced_contact_form',
        lead_type: 'inquiry',
        urgency: formData.urgency
      });

      setSubmitted(true);
      toast.success('Your message has been sent successfully to dataquestsolutions2@gmail.com!');
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      
      // Track failed submission
      ga4.trackEvent('form_submission_error', {
        form_name: 'enhanced_contact_form',
        error_type: 'submission_failed',
        error_message: error.message
      });
      
      toast.error('Failed to send message. Please try again or contact us directly at dataquestsolutions2@gmail.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      urgency: 'medium',
      preferredContact: 'email'
    });
    setErrors({});
  };

  if (submitted) {
    return (
      <Card className="bg-green-600/10 border-green-600/30 max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-white text-2xl font-bold mb-4">Message Sent Successfully!</h3>
          <p className="text-green-200 mb-4">
            Your message has been sent to <strong>dataquestsolutions2@gmail.com</strong>
          </p>
          <div className="bg-green-600/20 p-4 rounded-lg mb-6">
            <p className="text-green-200 text-sm">
              <strong>Expected Response Time:</strong> {
                formData.urgency === 'high' ? '2-4 hours' : 
                formData.urgency === 'medium' ? '4-8 hours' : '24 hours'
              }
            </p>
            <p className="text-green-200 text-sm mt-2">
              We'll contact you via {formData.preferredContact === 'email' ? 'email' : 
                                   formData.preferredContact === 'phone' ? 'phone call' : 'WhatsApp'}
            </p>
          </div>
          <Button 
            onClick={resetForm}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-white text-2xl">Enhanced Contact Form</CardTitle>
        <p className="text-gray-300 text-sm">
          All messages are sent directly to <strong>dataquestsolutions2@gmail.com</strong>
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-gray-300">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                placeholder="John Doe"
                required
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="email" className="text-gray-300">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                placeholder="john@example.com"
                required
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                placeholder="+254 7XX XXX XXX"
              />
              {errors.phone && (
                <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="urgency" className="text-gray-300">Urgency Level</Label>
              <Select value={formData.urgency} onValueChange={(value: any) => handleChange('urgency', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - General inquiry</SelectItem>
                  <SelectItem value="medium">Medium - Standard request</SelectItem>
                  <SelectItem value="high">High - Urgent matter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="subject" className="text-gray-300">Subject / Reason for Contact *</Label>
            <Select value={formData.subject} onValueChange={(value) => handleChange('subject', value)} required>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select a reason for contact" />
              </SelectTrigger>
              <SelectContent>
                {contactReasons.map((reason) => (
                  <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.subject && (
              <p className="text-red-400 text-sm mt-1">{errors.subject}</p>
            )}
          </div>

          <div>
            <Label htmlFor="preferredContact" className="text-gray-300">Preferred Contact Method</Label>
            <Select value={formData.preferredContact} onValueChange={(value: any) => handleChange('preferredContact', value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </div>
                </SelectItem>
                <SelectItem value="phone">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Phone Call</span>
                  </div>
                </SelectItem>
                <SelectItem value="whatsapp">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message" className="text-gray-300">Message *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 min-h-[120px]"
              placeholder="Please describe your inquiry in detail..."
              required
            />
            {errors.message && (
              <p className="text-red-400 text-sm mt-1">{errors.message}</p>
            )}
            <p className="text-gray-400 text-xs mt-1">
              {formData.message.length}/500 characters
            </p>
          </div>

          {/* Urgency Alert */}
          {formData.urgency === 'high' && (
            <Alert className="bg-red-600/20 border-red-600">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription className="text-red-200">
                High urgency requests are typically responded to within 2-4 hours during business hours.
              </AlertDescription>
            </Alert>
          )}

          {/* Contact Information Display */}
          <div className="bg-blue-600/20 border border-blue-600/30 p-4 rounded-lg">
            <h4 className="text-blue-300 font-semibold mb-2">Our Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-blue-200">📧 Email: dataquestsolutions2@gmail.com</p>
                <p className="text-blue-200">📞 Phone: +254 707 612 395</p>
              </div>
              <div>
                <p className="text-blue-200">📞 Alt Phone: +254 701 344 230</p>
                <p className="text-blue-200">📍 Location: Kakamega, Kenya</p>
              </div>
            </div>
          </div>

          <Button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Sending to dataquestsolutions2@gmail.com...
              </>
            ) : (
              <>
                <Mail className="w-5 h-5 mr-2" />
                Send Message
              </>
            )}
          </Button>

          <p className="text-center text-gray-400 text-xs">
            By submitting this form, you agree to our terms of service and privacy policy.
            Your message will be sent directly to dataquestsolutions2@gmail.com.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnhancedContactForm;