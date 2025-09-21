import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Phone, HelpCircle, ExternalLink } from 'lucide-react';

interface MpesaError {
  code: string;
  message: string;
  type: 'insufficient_funds' | 'invalid_phone' | 'service_unavailable' | 'timeout' | 'network_error' | 'unknown';
  details?: any;
}

interface MpesaErrorHandlerProps {
  error: MpesaError;
  onRetry: () => void;
  onCancel: () => void;
  showAlternatives?: boolean;
}

const MpesaErrorHandler: React.FC<MpesaErrorHandlerProps> = ({
  error,
  onRetry,
  onCancel,
  showAlternatives = true
}) => {
  const getErrorContent = (errorType: string) => {
    switch (errorType) {
      case 'insufficient_funds':
        return {
          title: 'Insufficient M-Pesa Balance',
          message: 'Your M-Pesa account does not have enough funds to complete this payment.',
          icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
          color: 'border-yellow-600 bg-yellow-600/10',
          solutions: [
            'Top up your M-Pesa account',
            'Use a different M-Pesa number with sufficient balance',
            'Try a smaller payment amount if applicable',
            'Use an alternative payment method'
          ],
          showRetry: true
        };

      case 'invalid_phone':
        return {
          title: 'Invalid Phone Number',
          message: 'The phone number format is incorrect. Please use the format 254XXXXXXXXX.',
          icon: <Phone className="w-5 h-5 text-red-400" />,
          color: 'border-red-600 bg-red-600/10',
          solutions: [
            'Ensure phone number starts with 254',
            'Remove any spaces or special characters',
            'Use 12 digits total (254 + 9 digits)',
            'Example: 254712345678'
          ],
          showRetry: true
        };

      case 'service_unavailable':
        return {
          title: 'M-Pesa Service Temporarily Unavailable',
          message: 'The M-Pesa service is currently experiencing issues. Please try again later.',
          icon: <AlertTriangle className="w-5 h-5 text-orange-400" />,
          color: 'border-orange-600 bg-orange-600/10',
          solutions: [
            'Wait a few minutes and try again',
            'Check M-Pesa service status',
            'Use an alternative payment method',
            'Contact support if the issue persists'
          ],
          showRetry: true
        };

      case 'timeout':
        return {
          title: 'Payment Timeout',
          message: 'The payment request timed out. You may not have responded to the STK push notification in time.',
          icon: <AlertTriangle className="w-5 h-5 text-blue-400" />,
          color: 'border-blue-600 bg-blue-600/10',
          solutions: [
            'Check your phone for any pending M-Pesa notifications',
            'Ensure your phone has network coverage',
            'Try the payment again',
            'Contact support if you completed the payment but it shows as failed'
          ],
          showRetry: true
        };

      case 'network_error':
        return {
          title: 'Network Connection Error',
          message: 'There was a problem connecting to the payment service. Please check your internet connection.',
          icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
          color: 'border-red-600 bg-red-600/10',
          solutions: [
            'Check your internet connection',
            'Try refreshing the page',
            'Disable VPN if you\'re using one',
            'Contact support if the problem continues'
          ],
          showRetry: true
        };

      default:
        return {
          title: 'Payment Error',
          message: error.message || 'An unexpected error occurred during payment processing.',
          icon: <HelpCircle className="w-5 h-5 text-gray-400" />,
          color: 'border-gray-600 bg-gray-600/10',
          solutions: [
            'Try the payment again',
            'Check your M-Pesa account balance',
            'Verify your phone number is correct',
            'Contact support for assistance'
          ],
          showRetry: true
        };
    }
  };

  const errorContent = getErrorContent(error.type);

  return (
    <div className="space-y-6">
      {/* Main Error Alert */}
      <Alert className={`${errorContent.color} border-2`}>
        <div className="flex items-center space-x-3">
          {errorContent.icon}
          <div>
            <AlertTitle className="text-white text-lg">{errorContent.title}</AlertTitle>
            <AlertDescription className="text-gray-200 mt-2">
              {errorContent.message}
            </AlertDescription>
          </div>
        </div>
      </Alert>

      {/* Solutions Card */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">How to Resolve This Issue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {errorContent.solutions.map((solution, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                  {index + 1}
                </div>
                <p className="text-gray-300">{solution}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4">
        {errorContent.showRetry && (
          <Button 
            onClick={onRetry}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
        <Button 
          variant="outline"
          onClick={onCancel}
          className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          Cancel Payment
        </Button>
      </div>

      {/* Alternative Payment Methods */}
      {showAlternatives && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">Alternative Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-700/30 rounded-lg">
                <h4 className="text-white font-semibold mb-2">PayPal</h4>
                <p className="text-gray-300 text-sm mb-3">
                  Pay securely with PayPal using your credit card or PayPal balance
                </p>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Pay with PayPal
                </Button>
              </div>
              <div className="p-4 bg-gray-700/30 rounded-lg">
                <h4 className="text-white font-semibold mb-2">Bank Transfer</h4>
                <p className="text-gray-300 text-sm mb-3">
                  Pay via bank transfer using our Paybill number
                </p>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  Bank Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Support Contact */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <div className="text-center">
            <h4 className="text-white font-semibold mb-2">Need Help?</h4>
            <p className="text-gray-300 text-sm mb-4">
              If you continue to experience issues, our support team is here to help.
            </p>
            <div className="flex flex-col md:flex-row gap-3 justify-center">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => window.open('mailto:dataquestsolutions2@gmail.com', '_blank')}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Email Support
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => window.open('tel:+254707612395', '_blank')}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Support
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => window.open('https://wa.me/254707612395', '_blank')}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                WhatsApp Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Details (for debugging) */}
      {error.details && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-sm">Technical Details</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-gray-400 text-xs bg-gray-900 p-3 rounded overflow-x-auto">
              {JSON.stringify(error.details, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MpesaErrorHandler;