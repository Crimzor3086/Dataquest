import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, Mail, Home, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface PaymentSuccessHandlerProps {
  paymentId: string;
  transactionId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  courseId?: string;
  serviceId?: string;
}

const PaymentSuccessHandler: React.FC<PaymentSuccessHandlerProps> = ({
  paymentId,
  transactionId,
  amount,
  currency,
  paymentMethod,
  courseId,
  serviceId
}) => {
  const navigate = useNavigate();
  const [enrollmentCreated, setEnrollmentCreated] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handlePaymentSuccess();
  }, []);

  const handlePaymentSuccess = async () => {
    try {
      // 1. Create course enrollment if this was a course payment
      if (courseId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error: enrollmentError } = await supabase
            .from('enrollments')
            .upsert({
              student_id: user.id,
              course_id: courseId,
              enrolled_at: new Date().toISOString(),
              status: 'active',
              progress: 0
            }, {
              onConflict: 'student_id,course_id'
            });

          if (!enrollmentError) {
            setEnrollmentCreated(true);
          }
        }
      }

      // 2. Send confirmation email
      const { error: emailError } = await supabase.functions.invoke('send-email', {
        body: {
          to: 'customer@example.com', // This should come from payment data
          subject: 'Payment Confirmation - DataQuest Solutions',
          type: 'payment_confirmation',
          data: {
            transactionId,
            amount,
            currency,
            paymentMethod,
            courseId,
            serviceId,
            timestamp: new Date().toISOString()
          }
        }
      });

      if (!emailError) {
        setConfirmationSent(true);
      }

      // 3. Log successful payment completion
      await supabase.from('payment_logs').insert({
        source: paymentMethod,
        level: 'info',
        message: 'Payment completed successfully',
        data: {
          payment_id: paymentId,
          transaction_id: transactionId,
          amount,
          currency,
          enrollment_created: enrollmentCreated,
          confirmation_sent: confirmationSent,
          timestamp: new Date().toISOString()
        }
      });

      // 4. Track analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'purchase', {
          transaction_id: transactionId,
          value: amount,
          currency: currency,
          payment_method: paymentMethod
        });
      }

    } catch (error) {
      console.error('Error handling payment success:', error);
      toast.error('Payment successful, but there was an issue with post-payment processing');
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = () => {
    const receiptData = {
      company: 'DataQuest Solutions',
      transactionId,
      amount,
      currency,
      paymentMethod,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString()
    };

    const receiptText = `
PAYMENT RECEIPT
===============

Company: ${receiptData.company}
Transaction ID: ${receiptData.transactionId}
Amount: ${receiptData.currency} ${receiptData.amount}
Payment Method: ${receiptData.paymentMethod}
Date: ${receiptData.date}
Time: ${receiptData.time}

Status: COMPLETED ✓

Thank you for your payment!

For support, contact:
Email: dataquestsolutions2@gmail.com
Phone: +254 707 612 395
    `;

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${transactionId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Receipt downloaded successfully!');
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: currency || 'KES'
    }).format(amount);
  };

  return (
    <Card className="bg-green-600/10 border-green-600/30">
      <CardHeader>
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <CardTitle className="text-white text-2xl">Payment Successful!</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Payment Summary */}
          <div className="bg-gray-700/30 p-6 rounded-lg">
            <h4 className="text-white font-semibold mb-4">Payment Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Transaction ID:</span>
                <p className="text-white font-mono">{transactionId}</p>
              </div>
              <div>
                <span className="text-gray-400">Amount Paid:</span>
                <p className="text-white font-semibold">{formatCurrency(amount, currency)}</p>
              </div>
              <div>
                <span className="text-gray-400">Payment Method:</span>
                <p className="text-white capitalize">{paymentMethod}</p>
              </div>
              <div>
                <span className="text-gray-400">Date:</span>
                <p className="text-white">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Status Updates */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-600/20 rounded-lg">
              <span className="text-green-300">Payment Processed</span>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            
            {courseId && (
              <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <span className="text-gray-300">Course Enrollment</span>
                {loading ? (
                  <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                ) : enrollmentCreated ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <span className="text-yellow-400 text-sm">Processing...</span>
                )}
              </div>
            )}
            
            <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300">Confirmation Email</span>
              {loading ? (
                <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              ) : confirmationSent ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <span className="text-yellow-400 text-sm">Sending...</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-4">
            <Button
              onClick={downloadReceipt}
              variant="outline"
              className="flex-1 border-green-600 text-green-300 hover:bg-green-600/20"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
            
            {courseId ? (
              <Button
                onClick={() => navigate('/courses')}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Access Course
              </Button>
            ) : (
              <Button
                onClick={() => navigate('/')}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            )}
          </div>

          {/* Support Information */}
          <div className="bg-blue-600/20 border border-blue-600/30 p-4 rounded-lg">
            <h4 className="text-blue-300 font-semibold mb-2">Need Help?</h4>
            <p className="text-blue-200 text-sm mb-2">
              If you have any questions about your payment or need assistance:
            </p>
            <div className="text-blue-200 text-sm">
              <p>Email: dataquestsolutions2@gmail.com</p>
              <p>Phone: +254 707 612 395</p>
              <p>WhatsApp: +254 707 612 395</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSuccessHandler;