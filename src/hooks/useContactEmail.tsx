
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ContactEmailData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  reason?: string;
  message: string;
}

export const useContactEmail = () => {
  return useMutation({
    mutationFn: async (data: ContactEmailData) => {
      console.log('Sending contact email via edge function:', data);
      
      const { data: result, error } = await supabase.functions.invoke('send-contact-email', {
        body: data
      });

      if (error) {
        console.error('Error sending contact email:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      toast.success('Your message has been sent to dataquestsolutions2@gmail.com! We\'ll get back to you within 24 hours.');
    },
    onError: (error: any) => {
      console.error('Contact email error:', error);
      toast.error('Failed to send message. Please try again or contact us directly at dataquestsolutions2@gmail.com');
    }
  });
};
