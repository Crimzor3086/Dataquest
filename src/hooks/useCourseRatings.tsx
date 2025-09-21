
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CourseRating {
  id: string;
  course_id: string;
  user_id: string;
  rating: number;
  review: string;
  created_at: string;
}

export const useCourseRatings = (courseId?: string) => {
  const [ratings, setRatings] = useState<CourseRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        let query = supabase.from('course_ratings').select('*');
        
        if (courseId) {
          query = query.eq('course_id', courseId);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });

        if (data && !error) {
          setRatings(data);
          
          if (data.length > 0) {
            const avg = data.reduce((sum, rating) => sum + rating.rating, 0) / data.length;
            setAverageRating(Math.round(avg * 10) / 10);
          }
        }
      } catch (error) {
        console.error('Error fetching course ratings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [courseId]);

  const addRating = async (courseId: string, rating: number, review: string = '') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User must be logged in to rate courses');
      }

      const { data, error } = await supabase
        .from('course_ratings')
        .upsert({
          course_id: courseId,
          user_id: user.id,
          rating,
          review,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'course_id,user_id'
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh ratings for the current course
      setRatings(prev => {
        const existing = prev.find(r => r.course_id === courseId && r.user_id === user.id);
        if (existing) {
          return prev.map(r => r.id === existing.id ? data : r);
        } else {
          return [data, ...prev];
        }
      });
      
      // Recalculate average rating
      const updatedRatings = ratings.filter(r => !(r.course_id === courseId && r.user_id === user.id));
      updatedRatings.push(data);
      if (updatedRatings.length > 0) {
        const avg = updatedRatings.reduce((sum, rating) => sum + rating.rating, 0) / updatedRatings.length;
        setAverageRating(Math.round(avg * 10) / 10);
      }

      return data;
    } catch (error) {
      console.error('Error adding rating:', error);
      throw error;
    }
  };

  return { ratings, loading, averageRating, addRating };
};
