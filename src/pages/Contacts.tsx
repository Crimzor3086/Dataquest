import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';
import { useContactEmail } from '@/hooks/useContactEmail';

const Contacts = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    selectedReason: ''
  });

  const contactEmailMutation = useContactEmail();

  const contactInfo = {
    phones: ['+254 707 612 395', '+254 701 344 230'],
    emails: ['dataquestsolutions2@gmail.com', 'dataquestsolutions254@gmail.com'],
    address: 'Kakamega, Kenya\nP.O. Box 190-50100',
    paypal: 'dataquestsolutions2@gmail.com',
    paybill: '522522',
    accountNumber: '1340849054'
  };

  const contactReasons = [
    'General Inquiry',
    'Course Registration',
    'Data Analysis Services',
    'Machine Learning Consultation',
    'Graphic Design Services',
    'Web Development',
    'Epidemiology Consultation',
    'Marketing Strategy'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      return;
    }

    contactEmailMutation.mutate({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      reason: formData.selectedReason,
      message: formData.message
    }, {
      onSuccess: () => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: '',
          selectedReason: ''
        });
      }
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleReason = (reason: string) => {
    setFormData(prev => ({
      ...prev,
      selectedReason: prev.selectedReason === reason ? '' : reason
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      <Navigation />
      <WhatsAppButton />
      
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl font-bold text-white mb-6">Contact Us</h1>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Ready to transform your data into competitive advantage? Get in touch with our experts 
              to discuss your project requirements and explore how we can help your business grow.
            </p>
            <p className="text-lg text-blue-300 mt-4">
              All messages will be sent to: <strong>dataquestsolutions2@gmail.com</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="bg-blue-800/50 border-blue-700">
              <CardHeader>
                <CardTitle className="text-white text-2xl">Send us a Message</CardTitle>
                <CardDescription className="text-blue-200">
                  Fill out the form below and we'll get back to you within 24 hours. 
                  Your message will be sent directly to dataquestsolutions2@gmail.com.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-blue-200 text-sm font-medium mb-2">
                        First Name *
                      </label>
                      <Input 
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="bg-blue-700 border-blue-600 text-white placeholder-blue-300"
                        placeholder="John"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-blue-200 text-sm font-medium mb-2">
                        Last Name *
                      </label>
                      <Input 
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="bg-blue-700 border-blue-600 text-white placeholder-blue-300"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-blue-200 text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <Input 
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="bg-blue-700 border-blue-600 text-white placeholder-blue-300"
                      placeholder="john.doe@company.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-blue-200 text-sm font-medium mb-2">
                      Phone Number
                    </label>
                    <Input 
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="bg-blue-700 border-blue-600 text-white placeholder-blue-300"
                      placeholder="+254 7XX XXX XXX"
                    />
                  </div>

                  <div>
                    <label className="block text-blue-200 text-sm font-medium mb-2">
                      Reason for Contact
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {contactReasons.map((reason, index) => (
                        <Badge 
                          key={index}
                          variant="outline" 
                          className={`border-blue-600 cursor-pointer transition-colors ${
                            formData.selectedReason === reason 
                              ? 'bg-blue-600 text-white border-blue-500' 
                              : 'text-blue-200 hover:bg-blue-600 hover:border-blue-500 hover:text-white'
                          }`}
                          onClick={() => toggleReason(reason)}
                        >
                          {reason}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-blue-200 text-sm font-medium mb-2">
                      Message *
                    </label>
                    <Textarea 
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="bg-blue-700 border-blue-600 text-white placeholder-blue-300 min-h-[120px]"
                      placeholder="Tell us about your project requirements, timeline, and how we can help..."
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                    disabled={contactEmailMutation.isPending}
                  >
                    {contactEmailMutation.isPending ? 'Sending...' : 'Send Message to dataquestsolutions2@gmail.com'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="bg-blue-800/50 border-blue-700">
                <CardHeader>
                  <CardTitle className="text-white text-xl flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Phone Numbers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {contactInfo.phones.map((phone, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-blue-400 font-mono">{phone}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-blue-800/50 border-blue-700">
                <CardHeader>
                  <CardTitle className="text-white text-xl flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Primary Email (All messages sent here)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 font-semibold">dataquestsolutions2@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-300">dataquestsolutions254@gmail.com</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-800/50 border-blue-700">
                <CardHeader>
                  <CardTitle className="text-white text-xl flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-200 whitespace-pre-line">{contactInfo.address}</p>
                </CardContent>
              </Card>

              <Card className="bg-blue-800/50 border-blue-700">
                <CardHeader>
                  <CardTitle className="text-white text-xl flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Response Times
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-300">General Inquiries</span>
                    <span className="text-blue-400">Within 24 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-300">Course Registration</span>
                    <span className="text-blue-400">Within 4 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-300">Service Consultation</span>
                    <span className="text-blue-400">Within 2 hours</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Payment Methods</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-blue-800/50 border-blue-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">PayPal</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-400">{contactInfo.paypal}</p>
                </CardContent>
              </Card>

              <Card className="bg-blue-800/50 border-blue-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Mobile Money (MTN)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {contactInfo.phones.map((phone, index) => (
                    <p key={index} className="text-blue-400 font-mono">{phone}</p>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-blue-800/50 border-blue-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Bank (Kenyan Students)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="text-blue-300">Paybill: </span>
                    <span className="text-blue-400 font-mono">{contactInfo.paybill}</span>
                  </div>
                  <div>
                    <span className="text-blue-300">Account: </span>
                    <span className="text-blue-400 font-mono">{contactInfo.accountNumber}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Contacts;
