
import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import PaymentForm from '@/components/PaymentForm';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const amount = Number(searchParams.get('amount')) || 5000;
  const currency = searchParams.get('currency') || 'KES';
  const courseId = searchParams.get('courseId') || undefined;
  const serviceId = searchParams.get('serviceId') || undefined;
  const description = searchParams.get('description') || 'Payment';

  const handlePaymentSuccess = () => {
    navigate('/payment-success');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      <Navigation />
      
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            variant="outline"
            onClick={handleCancel}
            className="mb-8 border-white/30 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Secure Payment</h1>
            <p className="text-blue-200 text-lg">
              Complete your payment using your preferred method
            </p>
            {description && (
              <p className="text-blue-300 mt-2">
                {description}
              </p>
            )}
          </div>

          {/* Payment Form */}
          <PaymentForm
            amount={amount}
            currency={currency}
            courseId={courseId}
            serviceId={serviceId}
            description={description}
            onSuccess={handlePaymentSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Payment;
