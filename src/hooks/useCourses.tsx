
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';

type Course = Database['public']['Tables']['courses']['Row'];
type CourseInsert = Database['public']['Tables']['courses']['Insert'];

export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          enrollments!inner(
            id,
            student_id
          )
        `)
        .eq('status', 'published');
      
      if (error) throw error;
      
      // Transform data to include student count
      return data.map(course => ({
        ...course,
        student_count: course.enrollments?.length || 0
      }));
    }
  });
};

export const useEnrollInCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (courseId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Must be logged in to enroll');

      const { error } = await supabase
        .from('enrollments')
        .insert({
          student_id: user.id,
          course_id: courseId,
          status: 'active'
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Successfully enrolled in course!');
    },
    onError: (error: any) => {
      if (error.message.includes('duplicate')) {
        toast.error('You are already enrolled in this course');
      } else {
        toast.error('Failed to enroll in course');
      }
    }
  });
};
