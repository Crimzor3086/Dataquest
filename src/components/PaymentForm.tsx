import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreditCard, Smartphone, Building2, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface PaymentFormProps {
  amount: number;
  currency: string;
  courseId?: string;
  serviceId?: string;
  description?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  currency,
  courseId,
  serviceId,
  description,
  onSuccess,
  onCancel
}) => {
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'paypal' | 'paybill'>('mpesa');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: user?.email || '',
    phone: ''
  });
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // For M-Pesa, only validate phone number
    if (paymentMethod === 'mpesa') {
      if (!mpesaPhone.trim()) {
        newErrors.mpesaPhone = 'M-Pesa phone number is required';
      } else {
        const phoneRegex = /^254[0-9]{9}$/;
        const cleanPhone = mpesaPhone.replace(/[\s\-\(\)]/g, '');
        if (!phoneRegex.test(cleanPhone)) {
          newErrors.mpesaPhone = 'Please enter a valid M-Pesa number (254XXXXXXXXX)';
        }
      }
    } else {
      // For other payment methods, validate customer info
      if (!customerInfo.name.trim()) {
        newErrors.name = 'Name is required';
      }
      if (!customerInfo.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Validate amount
    if (amount <= 0) {
      newErrors.amount = 'Invalid payment amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting');
      return;
    }

    setLoading(true);

    try {
      // Send notification email to admin
      const { error: emailError } = await supabase.functions.invoke('send-email', {
        body: {
          to: 'dataquestsolutions2@gmail.com',
          subject: `New Payment Initiated - ${description || 'Payment'}`,
          type: 'payment_notification',
          data: {
            customerName: customerInfo.name,
            customerEmail: customerInfo.email,
            customerPhone: customerInfo.phone,
            paymentMethod,
            amount,
            currency,
            mpesaPhone: paymentMethod === 'mpesa' ? mpesaPhone : undefined,
            courseId,
            serviceId,
            description,
            timestamp: new Date().toISOString()
          }
        }
      });

      if (emailError) {
        console.error('Email notification error:', emailError);
        // Don't fail the payment for email issues, just log
      }

      // Process payment based on method
      if (paymentMethod === 'mpesa') {
        await processMpesaPayment();
      } else if (paymentMethod === 'paypal') {
        await processPayPalPayment();
      } else if (paymentMethod === 'paybill') {
        await processPaybillPayment();
      }

    } catch (error: any) {
      console.error('Payment processing error:', error);
      toast.error(error.message || 'Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const processMpesaPayment = async () => {
    const { data, error } = await supabase.functions.invoke('process-payment', {
      body: {
        user_id: user?.id || 'anonymous',
        course_id: courseId,
        service_id: serviceId,
        amount,
        currency,
        payment_method: 'mpesa',
        customer_info: {
          name: `Customer ${mpesaPhone}`, // Use phone as identifier
          email: user?.email || `${mpesaPhone}@customer.com`, // Use user email or generate one
          phone: mpesaPhone
        },
        payment_details: {
          account_reference: `PAY-${Date.now()}`,
          transaction_desc: description || 'Payment'
        }
      }
    });

    if (error) throw error;

    if (data?.success) {
      toast.success('STK push sent! Please check your phone and enter your M-Pesa PIN.');
      // Poll for payment status
      pollPaymentStatus(data.tracking_id);
    } else {
      throw new Error(data?.message || 'M-Pesa payment initiation failed');
    }
  };

  const processPayPalPayment = async () => {
    const { data, error } = await supabase.functions.invoke('process-payment', {
      body: {
        user_id: user?.id || 'anonymous',
        course_id: courseId,
        service_id: serviceId,
        amount,
        currency: 'USD', // PayPal typically uses USD
        payment_method: 'paypal',
        customer_info: customerInfo
      }
    });

    if (error) throw error;

    if (data?.redirect_url) {
      window.location.href = data.redirect_url;
    } else {
      throw new Error('PayPal redirect URL not received');
    }
  };

  const processPaybillPayment = async () => {
    // For paybill, just show instructions and mark as pending
    toast.success('Payment instructions sent! Please complete payment using the provided details.');
    
    // Send email with paybill instructions
    await supabase.functions.invoke('send-email', {
      body: {
        to: customerInfo.email,
        subject: 'Payment Instructions - DataQuest Solutions',
        type: 'paybill_instructions',
        data: {
          customerName: customerInfo.name,
          amount,
          currency,
          paybill: '522522',
          account: '1340849054',
          reference: `PAY-${Date.now()}`
        }
      }
    });

    onSuccess();
  };

  const pollPaymentStatus = async (trackingId: string) => {
    const maxAttempts = 40; // 2 minutes with 3-second intervals
    let attempts = 0;

    const poll = async () => {
      try {
        const { data } = await supabase.functions.invoke('mpesa-status', {
          body: { tracking_id: trackingId }
        });

        if (data?.status === 'success') {
          toast.success('Payment completed successfully!');
          onSuccess();
          return;
        } else if (data?.status === 'failed') {
          toast.error('Payment failed. Please try again.');
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 3000);
        } else {
          toast.error('Payment status check timed out. Please contact support.');
        }
      } catch (error) {
        console.error('Status check error:', error);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 3000);
        }
      }
    };

    poll();
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency || 'KES'
    }).format(amount);
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-white text-2xl text-center">Complete Your Payment</CardTitle>
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">
            {formatCurrency(amount, currency)}
          </div>
          {description && (
            <p className="text-gray-300">{description}</p>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information - Only show for non-M-Pesa payments */}
          {paymentMethod !== 'mpesa' && (
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">Customer Information</h3>
              
              <div>
                <Label htmlFor="name" className="text-gray-300">Full Name *</Label>
                <Input
                  id="name"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Enter your full name"
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
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="your.email@example.com"
                  required
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                <Input
                  id="phone"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="+254 7XX XXX XXX"
                />
              </div>
            </div>
          )}

          {/* Payment Method Selection */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Payment Method</h3>
            
            <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
              <div className="space-y-3">
                 <div className="flex items-center space-x-3 p-4 border border-gray-600 rounded-lg hover:bg-gray-700/30 transition-colors">
                   <RadioGroupItem value="mpesa" id="mpesa" />
                   <Label htmlFor="mpesa" className="flex items-center space-x-3 cursor-pointer flex-1">
                     <Smartphone className="w-5 h-5 text-green-400" />
                     <div>
                       <div className="text-white font-medium">M-Pesa</div>
                       <div className="text-gray-400 text-sm">Quick payment with just your phone number</div>
                     </div>
                   </Label>
                   <Badge className="bg-green-600">Quick</Badge>
                 </div>

                <div className="flex items-center space-x-3 p-4 border border-gray-600 rounded-lg hover:bg-gray-700/30 transition-colors">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="flex items-center space-x-3 cursor-pointer flex-1">
                    <CreditCard className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="text-white font-medium">PayPal</div>
                      <div className="text-gray-400 text-sm">Pay with PayPal or credit card</div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-4 border border-gray-600 rounded-lg hover:bg-gray-700/30 transition-colors">
                  <RadioGroupItem value="paybill" id="paybill" />
                  <Label htmlFor="paybill" className="flex items-center space-x-3 cursor-pointer flex-1">
                    <Building2 className="w-5 h-5 text-purple-400" />
                    <div>
                      <div className="text-white font-medium">Bank Transfer (Paybill)</div>
                      <div className="text-gray-400 text-sm">Pay via bank transfer</div>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* M-Pesa Phone Number */}
          {paymentMethod === 'mpesa' && (
            <div>
              <Label htmlFor="mpesa-phone" className="text-gray-300">M-Pesa Phone Number *</Label>
              <Input
                id="mpesa-phone"
                value={mpesaPhone}
                onChange={(e) => setMpesaPhone(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="254712345678"
                required
              />
              {errors.mpesaPhone && (
                <p className="text-red-400 text-sm mt-1">{errors.mpesaPhone}</p>
              )}
              <p className="text-gray-400 text-xs mt-1">
                Format: 254XXXXXXXXX (without + or spaces)
              </p>
            </div>
          )}

          {/* Paybill Instructions */}
          {paymentMethod === 'paybill' && (
            <Alert className="bg-purple-600/20 border-purple-600">
              <Building2 className="w-4 h-4" />
              <AlertDescription className="text-purple-200">
                <div className="space-y-2">
                  <p className="font-semibold">Bank Transfer Details:</p>
                  <p>Paybill: <span className="font-mono">522522</span></p>
                  <p>Account Number: <span className="font-mono">1340849054</span></p>
                  <p>Amount: <span className="font-mono">{formatCurrency(amount, currency)}</span></p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Payment Summary */}
          <div className="bg-gray-700/30 p-4 rounded-lg">
            <h4 className="text-white font-semibold mb-3">Payment Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Amount:</span>
                <span className="text-white font-semibold">{formatCurrency(amount, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Payment Method:</span>
                <span className="text-white capitalize">{paymentMethod}</span>
              </div>
              {description && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Description:</span>
                  <span className="text-white">{description}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Pay {formatCurrency(amount, currency)}
                </>
              )}
            </Button>
          </div>

          {/* Security Notice */}
          <div className="text-center text-gray-400 text-xs">
            <p>🔒 Your payment information is secure and encrypted</p>
            <p>All transactions are processed securely through our payment partners</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;