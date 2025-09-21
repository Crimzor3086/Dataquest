/**
 * M-Pesa Error Code Mapping
 * Maps M-Pesa API error codes to user-friendly messages
 */

export interface MpesaError {
  code: string;
  message: string;
  type?: string;
  details?: any;
}

export interface MpesaErrorMapping {
  code: string;
  type: 'insufficient_funds' | 'invalid_phone' | 'service_unavailable' | 'timeout' | 'network_error' | 'unknown';
  userMessage: string;
  technicalMessage: string;
  solutions: string[];
  severity: 'critical' | 'high' | 'medium' | 'low';
}

export const mpesaErrorCodes: Record<string, MpesaErrorMapping> = {
  // Success codes
  '0': {
    code: '0',
    type: 'unknown',
    userMessage: 'Payment completed successfully',
    technicalMessage: 'Transaction successful',
    solutions: [],
    severity: 'low'
  },

  // Common error codes
  '1': {
    code: '1',
    type: 'insufficient_funds',
    userMessage: 'Insufficient funds in your M-Pesa account. Please top up and try again.',
    technicalMessage: 'Insufficient funds in the account',
    solutions: [
      'Top up your M-Pesa account',
      'Use a different M-Pesa number',
      'Try a smaller amount',
      'Contact your mobile network provider'
    ],
    severity: 'high'
  },

  '2001': {
    code: '2001',
    type: 'invalid_phone',
    userMessage: 'Invalid phone number. Please check and enter a valid M-Pesa number.',
    technicalMessage: 'Wrong credentials used to access the API',
    solutions: [
      'Verify phone number format (254XXXXXXXXX)',
      'Ensure the number is registered for M-Pesa',
      'Remove any spaces or special characters',
      'Try using a different M-Pesa number'
    ],
    severity: 'high'
  },

  '1001': {
    code: '1001',
    type: 'service_unavailable',
    userMessage: 'M-Pesa service is temporarily unavailable. Please try again later.',
    technicalMessage: 'Unable to lock subscriber, a transaction is already in process for the current subscriber',
    solutions: [
      'Wait a few minutes and try again',
      'Check if you have any pending M-Pesa transactions',
      'Contact M-Pesa customer service',
      'Use an alternative payment method'
    ],
    severity: 'medium'
  },

  '1032': {
    code: '1032',
    type: 'timeout',
    userMessage: 'Payment request cancelled or timed out. Please try again.',
    technicalMessage: 'Request cancelled by user or timeout',
    solutions: [
      'Ensure you respond to the STK push notification quickly',
      'Check your phone for any pending notifications',
      'Try the payment again',
      'Ensure your phone has good network coverage'
    ],
    severity: 'medium'
  },

  '1037': {
    code: '1037',
    type: 'timeout',
    userMessage: 'Payment request timed out. Please check your phone and try again.',
    technicalMessage: 'An STK Push Timeout has occurred',
    solutions: [
      'Check your phone for M-Pesa notifications',
      'Ensure your phone is on and has network coverage',
      'Try the payment again',
      'Contact support if you completed the payment'
    ],
    severity: 'medium'
  },

  '1025': {
    code: '1025',
    type: 'invalid_phone',
    userMessage: 'This phone number is not registered for M-Pesa services.',
    technicalMessage: 'This is not a registered M-Pesa user',
    solutions: [
      'Verify the phone number is correct',
      'Ensure the number is registered for M-Pesa',
      'Try using a different M-Pesa number',
      'Contact your mobile network provider'
    ],
    severity: 'high'
  },

  '1019': {
    code: '1019',
    type: 'service_unavailable',
    userMessage: 'M-Pesa service is currently busy. Please try again in a few minutes.',
    technicalMessage: 'Shortcode is not subscribed',
    solutions: [
      'Wait 2-3 minutes and try again',
      'Check M-Pesa service status',
      'Use an alternative payment method',
      'Contact support if the issue persists'
    ],
    severity: 'medium'
  },

  // Network and system errors
  'NETWORK_ERROR': {
    code: 'NETWORK_ERROR',
    type: 'network_error',
    userMessage: 'Network connection error. Please check your internet connection and try again.',
    technicalMessage: 'Failed to connect to M-Pesa API',
    solutions: [
      'Check your internet connection',
      'Try refreshing the page',
      'Disable VPN if you\'re using one',
      'Try again in a few minutes'
    ],
    severity: 'medium'
  },

  'TIMEOUT': {
    code: 'TIMEOUT',
    type: 'timeout',
    userMessage: 'The request timed out. Please try again.',
    technicalMessage: 'Request timeout exceeded',
    solutions: [
      'Try the payment again',
      'Ensure stable internet connection',
      'Check if payment was processed on your M-Pesa',
      'Contact support if payment was deducted'
    ],
    severity: 'medium'
  }
};

export const mapMpesaError = (errorCode: string, errorMessage?: string): MpesaErrorMapping => {
  // Try to find exact match first
  if (mpesaErrorCodes[errorCode]) {
    return mpesaErrorCodes[errorCode];
  }

  // Try to infer error type from message
  if (errorMessage) {
    const message = errorMessage.toLowerCase();
    
    if (message.includes('insufficient') || message.includes('balance')) {
      return {
        ...mpesaErrorCodes['1'],
        technicalMessage: errorMessage
      };
    }
    
    if (message.includes('invalid') || message.includes('phone') || message.includes('number')) {
      return {
        ...mpesaErrorCodes['2001'],
        technicalMessage: errorMessage
      };
    }
    
    if (message.includes('timeout') || message.includes('cancelled')) {
      return {
        ...mpesaErrorCodes['1032'],
        technicalMessage: errorMessage
      };
    }
    
    if (message.includes('service') || message.includes('unavailable')) {
      return {
        ...mpesaErrorCodes['1001'],
        technicalMessage: errorMessage
      };
    }
  }

  // Default unknown error
  return {
    code: errorCode || 'UNKNOWN',
    type: 'unknown',
    userMessage: 'An unexpected error occurred. Please try again or contact support.',
    technicalMessage: errorMessage || 'Unknown error',
    solutions: [
      'Try the payment again',
      'Check your M-Pesa account status',
      'Contact support with error details',
      'Use an alternative payment method'
    ],
    severity: 'medium'
  };
};

export const createMpesaError = (
  code: string, 
  message?: string, 
  details?: any
): MpesaError => {
  const mapping = mapMpesaError(code, message);
  
  return {
    code,
    message: mapping.userMessage,
    type: mapping.type,
    details: {
      technicalMessage: mapping.technicalMessage,
      solutions: mapping.solutions,
      severity: mapping.severity,
      timestamp: new Date().toISOString(),
      ...details
    }
  };
};

// Helper function to determine if error is retryable
export const isRetryableError = (errorType: string): boolean => {
  const retryableTypes = ['service_unavailable', 'timeout', 'network_error'];
  return retryableTypes.includes(errorType);
};

// Helper function to get retry delay based on error type
export const getRetryDelay = (errorType: string, attemptNumber: number): number => {
  const baseDelays = {
    'service_unavailable': 30000, // 30 seconds
    'timeout': 10000,             // 10 seconds
    'network_error': 5000,        // 5 seconds
    'unknown': 15000              // 15 seconds
  };

  const baseDelay = baseDelays[errorType as keyof typeof baseDelays] || 15000;
  
  // Exponential backoff: delay * (2 ^ attemptNumber)
  return Math.min(baseDelay * Math.pow(2, attemptNumber), 300000); // Max 5 minutes
};

// Error analytics for QA reporting
export const trackErrorForQA = (error: MpesaError): void => {
  const errorEvent = {
    timestamp: new Date().toISOString(),
    errorCode: error.code,
    errorType: error.type,
    userMessage: error.message,
    technicalDetails: error.details,
    userAgent: navigator.userAgent,
    url: window.location.href
  };

  // Store in localStorage for QA analysis
  const existingErrors = JSON.parse(localStorage.getItem('mpesa_error_log') || '[]');
  existingErrors.push(errorEvent);
  
  // Keep only last 100 errors
  if (existingErrors.length > 100) {
    existingErrors.splice(0, existingErrors.length - 100);
  }
  
  localStorage.setItem('mpesa_error_log', JSON.stringify(existingErrors));
  
  console.log('🚨 M-Pesa Error Tracked for QA:', errorEvent);
};