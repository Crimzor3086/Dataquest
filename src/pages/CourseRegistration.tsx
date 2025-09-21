import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import RegistrationForm from '@/components/RegistrationForm';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAnalytics } from '@/hooks/useAnalytics';

interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  course: string;
  message?: string;
}

const CourseRegistration = () => {
  const { trackFormSubmission } = useAnalytics();

  const handleRegistrationSubmit = async (data: RegistrationData) => {
    try {
      // Get current user if logged in
      const { data: { user } } = await supabase.auth.getUser();

      // Send registration confirmation email
      const { error: emailError } = await supabase.functions.invoke('send-email', {
        body: {
          to: 'dataquestsolutions2@gmail.com',
          subject: 'New Course Registration - DataQuest Solutions',
          type: 'registration',
          data: {
            firstName: data.name.split(' ')[0],
            lastName: data.name.split(' ').slice(1).join(' '),
            email: data.email,
            phone: data.phone,
            course: data.course,
            message: data.message
          }
        }
      });

      if (emailError) throw emailError;

      // Track registration
      trackFormSubmission('course_registration', {
        course: data.course,
        has_phone: !!data.phone
      });

      toast.success('Registration successful! We will contact you shortly.');
    } catch (error: any) {
      console.error('Registration failed:', error.message);
      toast.error('Registration failed. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      <Navigation />
      <WhatsAppButton />

      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Course Registration</h1>
            <p className="text-xl text-blue-200">
              Join thousands of students who have transformed their careers with DataQuest Solutions.
            </p>
          </div>

          <RegistrationForm onSubmit={handleRegistrationSubmit} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CourseRegistration;
