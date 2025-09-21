
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900">
      <Navigation />
      
      <div className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-white text-3xl">Payment Cancelled</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-red-200 text-lg">
                Your payment was cancelled. No charges have been made to your account.
              </p>
              
              <div className="bg-red-800/30 p-4 rounded-lg">
                <p className="text-red-200 text-sm">
                  <strong>Need help?</strong>
                </p>
                <p className="text-red-200 text-sm mt-2">
                  Contact us at dataquestsolutions2@gmail.com or call +254 707 612 395
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-4 pt-4">
                <Button
                  onClick={() => navigate(-1)}
                  variant="outline"
                  className="flex-1 border-white/30 text-white hover:bg-white/10"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
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

export default PaymentCancel;
