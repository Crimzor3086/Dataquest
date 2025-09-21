import { toast } from 'sonner';

export const showSuccessMessage = (type: 'contact' | 'registration' | 'inquiry' | 'webinar') => {
  const messages = {
    contact: '✅ Your message has been sent successfully! We\'ll get back to you within 24 hours.',
    registration: '✅ Registration completed successfully! Check your email for confirmation details.',
    inquiry: '✅ Your inquiry has been submitted successfully! We\'ll respond within 24 hours.',
    webinar: '✅ Webinar registration successful! You\'ll receive confirmation details shortly.'
  };

  toast.success(messages[type], {
    duration: 5000,
    style: {
      background: '#10b981',
      color: 'white',
      border: 'none'
    }
  });
};

export const showErrorMessage = (type: 'form' | 'network' | 'validation') => {
  const messages = {
    form: '❌ Failed to submit form. Please try again.',
    network: '❌ Network error. Please check your connection and try again.',
    validation: '❌ Please fill in all required fields correctly.'
  };

  toast.error(messages[type], {
    duration: 5000,
    style: {
      background: '#ef4444',
      color: 'white',
      border: 'none'
    }
  });
};