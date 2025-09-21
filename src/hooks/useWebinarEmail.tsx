
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WebinarRegistrationEmailData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  webinarTitle: string;
  webinarId: string;
}

export const useWebinarRegistrationEmail = () => {
  return useMutation({
    mutationFn: async (data: WebinarRegistrationEmailData) => {
      console.log('Sending webinar registration email via edge function:', data);
      
      const { data: result, error } = await supabase.functions.invoke('send-webinar-registration', {
        body: data
      });

      if (error) {
        console.error('Error sending webinar registration email:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      toast.success('Registration notification sent to dataquestsolutions2@gmail.com! You will receive confirmation details shortly.');
    },
    onError: (error: any) => {
      console.error('Webinar registration email error:', error);
      toast.error('Registration saved but failed to send notification. Please contact dataquestsolutions2@gmail.com');
    }
  });
};
