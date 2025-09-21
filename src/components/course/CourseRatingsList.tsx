import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MessageSquare } from 'lucide-react';
import { useCourseRatings } from '@/hooks/useCourseRatings';

interface CourseRatingsListProps {
  courses: any[];
  onViewCourse: (course: any) => void;
}

const CourseRatingsList: React.FC<CourseRatingsListProps> = ({ courses, onViewCourse }) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating 
            ? 'text-yellow-400 fill-yellow-400' 
            : 'text-gray-400'
        }`}
      />
    ));
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <MessageSquare className="w-5 h-5" />
          Course Ratings Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        {courses.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No courses available for rating analysis.
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => {
              const CourseRatingData = () => {
                const { ratings, averageRating, loading } = useCourseRatings(course.id);
                
                if (loading) {
                  return <div className="text-gray-400 text-sm">Loading ratings...</div>;
                }
                
                return (
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-white">{course.title}</h3>
                        <Badge 
                          variant={course.status === 'published' ? 'default' : 'secondary'}
                          className={course.status === 'published' ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'}
                        >
                          {course.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          {renderStars(Math.round(averageRating))}
                          <span className="text-white font-medium">{averageRating.toFixed(1)}</span>
                        </div>
                        <span className="text-gray-400">({ratings.length} reviews)</span>
                      </div>
                      
                      {ratings.length > 0 && (
                        <div className="text-sm text-gray-400">
                          Latest review: {ratings[0]?.review ? 
                            '"' + ratings[0].review.substring(0, 60) + (ratings[0].review.length > 60 ? '...' : '') + '"'
                            : 'No review text'
                          }
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => onViewCourse(course)} 
                        size="sm" 
                        variant="outline"
                        className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
                      >
                        View Course
                      </Button>
                    </div>
                  </div>
                );
              };
              
              return (
                <div key={course.id} className="border border-gray-600 rounded-lg p-4 bg-gray-700/50">
                  <CourseRatingData />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseRatingsList;