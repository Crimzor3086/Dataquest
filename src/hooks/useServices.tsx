
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ServiceInquiry {
  name: string;
  email: string;
  service: string;
  message: string;
}

export const useServiceInquiry = () => {
  return useMutation({
    mutationFn: async (inquiry: ServiceInquiry) => {
      console.log('Sending service inquiry via edge function:', inquiry);
      
      const { data: result, error } = await supabase.functions.invoke('send-service-inquiry', {
        body: inquiry
      });

      if (error) {
        console.error('Error sending service inquiry:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      toast.success('Your inquiry has been sent to dataquestsolutions2@gmail.com! We\'ll contact you soon.');
    },
    onError: (error: any) => {
      console.error('Service inquiry error:', error);
      toast.error('Failed to submit inquiry. Please try again or contact us directly at dataquestsolutions2@gmail.com');
    }
  });
};
