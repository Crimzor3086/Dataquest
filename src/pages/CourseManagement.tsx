
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import CourseFormModal from '@/components/course/CourseFormModal';
import CourseEditModal from '@/components/course/CourseEditModal';
import CourseStatsGrid from '@/components/course/CourseStatsGrid';
import CourseTabs from '@/components/course/CourseTabs';
import { useNavigate } from 'react-router-dom';

const CourseManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<any>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Courses
  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: async () => {
      const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  // Students (for mapping enrollments)
  const { data: students = [] } = useQuery({
    queryKey: ['admin-students'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('id,first_name,last_name,email');
      if (error) throw error;
      return data || [];
    }
  });

  // Enrollments
  const { data: enrollments = [], isLoading: enrollmentsLoading } = useQuery({
    queryKey: ['admin-enrollments'],
    queryFn: async () => {
      const { data, error } = await supabase.from('enrollments').select('*').order('enrolled_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });

  // Instructors
  const { data: instructors = [] } = useQuery({
    queryKey: ['admin-instructors'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('id,first_name,last_name,email');
      if (error) throw error;
      return data || [];
    }
  });

  // Add Course
  const createCourse = useMutation({
    mutationFn: async (course: any) => {
      const { error } = await supabase.from('courses').insert({
        title: course.title,
        description: course.description,
        content: course.content,
        price: course.price ? parseFloat(course.price) : null,
        duration_weeks: course.duration_weeks ? parseInt(course.duration_weeks) : null,
        mode_of_learning: course.mode_of_learning,
        start_date: course.start_date ? course.start_date : null,
        status: 'draft',
        instructor_id: course.instructor_id || null,
        category: course.category || 'General',
        difficulty_level: course.difficulty_level || 'Beginner',
        prerequisites: course.prerequisites || '',
        learning_objectives: course.learning_objectives || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setIsCreateModalOpen(false);
    }
  });

  // Edit Course
  const editCourseMutation = useMutation({
    mutationFn: async (course: any) => {
      const { error } = await supabase.from('courses')
        .update({
          title: course.title,
          description: course.description,
          content: course.content,
          price: course.price ? parseFloat(course.price) : null,
          duration_weeks: course.duration_weeks ? parseInt(course.duration_weeks) : null,
          mode_of_learning: course.mode_of_learning,
          start_date: course.start_date ? course.start_date : null,
          status: course.status,
          instructor_id: course.instructor_id || null,
          category: course.category || 'General',
          difficulty_level: course.difficulty_level || 'Beginner',
          prerequisites: course.prerequisites || '',
          learning_objectives: course.learning_objectives || '',
          updated_at: new Date().toISOString()
        })
        .eq('id', course.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      setIsEditModalOpen(false);
      setEditCourse(null);
    }
  });

  // Delete Course
  const deleteCourse = useMutation({
    mutationFn: async (courseId: string) => {
      // First delete related enrollments
      await supabase.from('enrollments').delete().eq('course_id', courseId);
      // Then delete the course
      const { error } = await supabase.from('courses').delete().eq('id', courseId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      queryClient.invalidateQueries({ queryKey: ['admin-enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    }
  });

  // Toggle Course Status
  const toggleCourseStatus = useMutation({
    mutationFn: async ({ courseId, newStatus }: { courseId: string; newStatus: Database['public']['Enums']['course_status'] }) => {
      const { error } = await supabase.from('courses')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', courseId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    }
  });

  // Handlers
  const handleEdit = (course: any) => {
    setEditCourse(course);
    setIsEditModalOpen(true);
  };

  const handleView = (course: any) => {
    navigate(`/courses/${course.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      <Navigation />
      <WhatsAppButton />

      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Course Management</h1>
            <p className="text-blue-200">Create, manage, and monitor all training courses and enrollments</p>
          </div>

          <CourseStatsGrid courses={courses} students={students} />

          <CourseTabs
            courses={courses}
            students={students}
            enrollments={enrollments}
            instructors={instructors}
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            onNewCourse={() => setIsCreateModalOpen(true)}
            onEditCourse={handleEdit}
            onViewCourse={handleView}
            onDeleteCourse={deleteCourse.mutate}
            onToggleStatus={toggleCourseStatus.mutate}
          />
        </div>
      </div>
      <CourseFormModal open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={createCourse.mutate} loading={createCourse.isPending} />
      <CourseEditModal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSubmit={editCourseMutation.mutate} loading={editCourseMutation.isPending} course={editCourse} instructors={instructors} />
      <Footer />
    </div>
  );
};

export default CourseManagement;
