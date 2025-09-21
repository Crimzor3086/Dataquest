
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Home, FileText } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900">
      <Navigation />
      
      <div className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white text-3xl">Payment Successful!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-green-200 text-lg">
                Your payment has been processed successfully. You should receive a confirmation email shortly.
              </p>
              
              <div className="bg-green-800/30 p-4 rounded-lg">
                <p className="text-green-200 text-sm">
                  <strong>What happens next?</strong>
                </p>
                <ul className="text-green-200 text-sm mt-2 space-y-1 text-left">
                  <li>• You'll receive an email confirmation</li>
                  <li>• Course access will be granted within 2 hours</li>
                  <li>• Check your dashboard for updates</li>
                </ul>
              </div>

              <div className="flex flex-col md:flex-row gap-4 pt-4">
                <Button
                  onClick={() => navigate('/')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
                <Button
                  onClick={() => navigate('/courses')}
                  variant="outline"
                  className="flex-1 border-white/30 text-white hover:bg-white/10"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Courses
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
