
import React, { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCourseRatings } from '@/hooks/useCourseRatings';
import { useToast } from '@/hooks/use-toast';

interface CourseRatingProps {
  courseId: string;
  showAddRating?: boolean;
}

const CourseRating: React.FC<CourseRatingProps> = ({ courseId, showAddRating = true }) => {
  const { ratings, loading, averageRating, addRating } = useCourseRatings(courseId);
  const { toast } = useToast();
  const [selectedRating, setSelectedRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitRating = async () => {
    if (selectedRating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addRating(courseId, selectedRating, review);
      toast({
        title: "Rating Submitted",
        description: "Thank you for rating this course!",
      });
      setSelectedRating(0);
      setReview('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, size = 'w-5 h-5') => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${size} ${
          i < rating 
            ? 'text-yellow-400 fill-yellow-400' 
            : 'text-gray-300'
        } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
        onClick={interactive ? () => setSelectedRating(i + 1) : undefined}
      />
    ));
  };

  if (loading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <div className="text-center text-gray-300">Loading ratings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Average Rating Display */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Star className="w-5 h-5 text-yellow-400" />
            Course Rating
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {renderStars(Math.round(averageRating))}
              <span className="text-lg font-semibold text-white">{averageRating.toFixed(1)}</span>
            </div>
            <span className="text-gray-400">({ratings.length} reviews)</span>
          </div>
        </CardContent>
      </Card>

      {/* Add Rating Form */}
      {showAddRating && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Rate This Course</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Your Rating</label>
              <div className="flex gap-1">
                {renderStars(selectedRating, true)}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Review (Optional)</label>
              <Textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your thoughts about this course..."
                rows={3}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <Button 
              onClick={handleSubmitRating}
              disabled={isSubmitting || selectedRating === 0}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Rating'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Ratings List */}
      {ratings.length > 0 && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <MessageSquare className="w-5 h-5" />
              Reviews ({ratings.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {ratings.map((rating) => (
                <div key={rating.id} className="border-b border-gray-600 pb-4 last:border-b-0">
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(rating.rating, false, 'w-4 h-4')}
                    <span className="text-sm text-gray-400">
                      {new Date(rating.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {rating.review && (
                    <p className="text-gray-300 text-sm">{rating.review}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CourseRating;
