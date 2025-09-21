import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Student data management
export const useStudents = () => {
  return useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) throw profilesError;
      
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select(`
          *,
          courses(id, title, status, price)
        `);
      
      if (enrollmentsError) throw enrollmentsError;

      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('role', 'student');

      if (rolesError) throw rolesError;

      const studentIds = userRoles?.map(ur => ur.user_id) || [];
      
      return profiles
        .filter(profile => studentIds.includes(profile.id))
        .map(profile => {
          const userEnrollments = enrollments?.filter(e => e.student_id === profile.id) || [];
          const activeEnrollment = userEnrollments.find(e => e.status === 'active');
          
          return {
            id: profile.id,
            name: `${profile.first_name || 'Unknown'} ${profile.last_name || ''}`.trim(),
            email: profile.email || 'No email available',
            phone: profile.phone || '',
            course: activeEnrollment?.courses?.title || 'No active course',
            courseId: activeEnrollment?.course_id || null,
            status: activeEnrollment?.status || 'inactive',
            progress: activeEnrollment?.progress || 0,
            enrolledDate: activeEnrollment ? new Date(activeEnrollment.enrolled_at || '').toLocaleDateString() : '-',
            lastActivity: profile.updated_at ? new Date(profile.updated_at).toLocaleDateString() : '-',
            avatar: (profile.first_name?.charAt(0) || 'S').toUpperCase(),
            enrollments: userEnrollments,
            profile
          };
        });
    }
  });
};

// Student progress management
export const useStudentProgress = (studentId?: string, courseId?: string) => {
  return useQuery({
    queryKey: ['student-progress', studentId, courseId],
    queryFn: async () => {
      let query = supabase.from('student_progress').select('*');
      
      if (studentId) query = query.eq('student_id', studentId);
      if (courseId) query = query.eq('course_id', courseId);
      
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!(studentId || courseId)
  });
};

// Student assignments management
export const useStudentAssignments = (studentId?: string, courseId?: string) => {
  return useQuery({
    queryKey: ['student-assignments', studentId, courseId],
    queryFn: async () => {
      let query = supabase.from('student_assignments').select('*');
      
      if (studentId) query = query.eq('student_id', studentId);
      if (courseId) query = query.eq('course_id', courseId);
      
      const { data, error } = await query.order('due_date', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!(studentId || courseId)
  });
};

// Student attendance management
export const useStudentAttendance = (studentId?: string, courseId?: string) => {
  return useQuery({
    queryKey: ['student-attendance', studentId, courseId],
    queryFn: async () => {
      let query = supabase.from('student_attendance').select('*');
      
      if (studentId) query = query.eq('student_id', studentId);
      if (courseId) query = query.eq('course_id', courseId);
      
      const { data, error } = await query.order('session_date', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!(studentId || courseId)
  });
};

// Student notifications management
export const useStudentNotifications = (studentId?: string) => {
  return useQuery({
    queryKey: ['student-notifications', studentId],
    queryFn: async () => {
      let query = supabase.from('student_notifications').select('*');
      
      if (studentId) query = query.eq('student_id', studentId);
      
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!studentId
  });
};

// Mutations for student management
export const useStudentMutations = () => {
  const queryClient = useQueryClient();

  const updateStudentProfile = useMutation({
    mutationFn: async ({ studentId, updates }: { studentId: string; updates: any }) => {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', studentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student profile updated successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to update profile: ${error.message}`);
    }
  });

  const updateStudentProgress = useMutation({
    mutationFn: async ({ 
      studentId, 
      courseId, 
      moduleName, 
      completionPercentage,
      timeSpentMinutes,
      notes 
    }: {
      studentId: string;
      courseId: string;
      moduleName: string;
      completionPercentage: number;
      timeSpentMinutes?: number;
      notes?: string;
    }) => {
      const { error } = await supabase
        .from('student_progress')
        .upsert({
          student_id: studentId,
          course_id: courseId,
          module_name: moduleName,
          completion_percentage: completionPercentage,
          time_spent_minutes: timeSpentMinutes || 0,
          notes: notes || '',
          last_accessed: new Date().toISOString()
        }, {
          onConflict: 'student_id,course_id,module_name'
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-progress'] });
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Progress updated successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to update progress: ${error.message}`);
    }
  });

  const updateAttendance = useMutation({
    mutationFn: async ({
      studentId,
      courseId,
      sessionDate,
      sessionTitle,
      status,
      notes
    }: {
      studentId: string;
      courseId: string;
      sessionDate: string;
      sessionTitle: string;
      status: 'present' | 'absent' | 'late' | 'excused';
      notes?: string;
    }) => {
      const { error } = await supabase
        .from('student_attendance')
        .upsert({
          student_id: studentId,
          course_id: courseId,
          session_date: sessionDate,
          session_title: sessionTitle,
          status,
          notes: notes || ''
        }, {
          onConflict: 'student_id,course_id,session_date'
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-attendance'] });
      toast.success('Attendance updated successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to update attendance: ${error.message}`);
    }
  });

  const gradeAssignment = useMutation({
    mutationFn: async ({
      assignmentId,
      grade,
      feedback
    }: {
      assignmentId: string;
      grade: number;
      feedback: string;
    }) => {
      const { error } = await supabase
        .from('student_assignments')
        .update({
          grade,
          feedback,
          status: 'graded'
        })
        .eq('id', assignmentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-assignments'] });
      toast.success('Assignment graded successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to grade assignment: ${error.message}`);
    }
  });

  const createNotification = useMutation({
    mutationFn: async ({
      studentId,
      title,
      message,
      type,
      actionUrl
    }: {
      studentId: string;
      title: string;
      message: string;
      type: 'info' | 'warning' | 'success' | 'error';
      actionUrl?: string;
    }) => {
      const { error } = await supabase
        .from('student_notifications')
        .insert({
          student_id: studentId,
          title,
          message,
          type,
          action_url: actionUrl
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-notifications'] });
      toast.success('Notification sent successfully!');
    },
    onError: (error: any) => {
      toast.error(`Failed to send notification: ${error.message}`);
    }
  });

  return {
    updateStudentProfile,
    updateStudentProgress,
    updateAttendance,
    gradeAssignment,
    createNotification
  };
};

// Statistics hooks
export const useStudentStats = () => {
  return useQuery({
    queryKey: ['student-stats'],
    queryFn: async () => {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id')
        .in('id', 
          (await supabase.from('user_roles').select('user_id').eq('role', 'student'))
          .data?.map(ur => ur.user_id) || []
        );
      
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('status');
      
      const { data: assignments } = await supabase
        .from('student_assignments')
        .select('status, grade');

      const { data: attendance } = await supabase
        .from('student_attendance')
        .select('status');
      
      const total = profiles?.length || 0;
      const active = enrollments?.filter(e => e.status === 'active').length || 0;
      const completed = enrollments?.filter(e => e.status === 'completed').length || 0;
      const pendingAssignments = assignments?.filter(a => a.status === 'pending').length || 0;
      const averageGrade = assignments?.filter(a => a.grade).reduce((sum, a) => sum + (a.grade || 0), 0) / (assignments?.filter(a => a.grade).length || 1);
      const attendanceRate = attendance?.filter(a => a.status === 'present').length / (attendance?.length || 1) * 100;
      
      return {
        totalStudents: total,
        activeEnrollments: active,
        completedCourses: completed,
        pendingAssignments,
        averageGrade: Math.round(averageGrade * 10) / 10,
        attendanceRate: Math.round(attendanceRate * 10) / 10
      };
    }
  });
};