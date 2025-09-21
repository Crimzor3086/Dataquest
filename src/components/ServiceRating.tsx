import React, { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface ServiceRatingProps {
  serviceId: string;
  serviceName: string;
  showAddRating?: boolean;
}

interface ServiceRating {
  id: string;
  service_id: string;
  user_name: string;
  rating: number;
  review: string;
  created_at: string;
}

export const useServiceRatings = (serviceId: string) => {
  const [ratings, setRatings] = useState<ServiceRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  const { data } = useQuery({
    queryKey: ['service-ratings', serviceId],
    queryFn: async () => {
      // For now, we'll use localStorage to simulate ratings since we don't have a service_ratings table
      const storedRatings = localStorage.getItem(`service_ratings_${serviceId}`);
      const ratings = storedRatings ? JSON.parse(storedRatings) : [];
      
      if (ratings.length > 0) {
        const avg = ratings.reduce((sum: number, rating: ServiceRating) => sum + rating.rating, 0) / ratings.length;
        setAverageRating(Math.round(avg * 10) / 10);
      }
      
      setRatings(ratings);
      setLoading(false);
      return ratings;
    }
  });

  const addRating = async (rating: number, review: string, userName: string) => {
    const newRating: ServiceRating = {
      id: Date.now().toString(),
      service_id: serviceId,
      user_name: userName,
      rating,
      review,
      created_at: new Date().toISOString()
    };

    const existingRatings = localStorage.getItem(`service_ratings_${serviceId}`);
    const ratings = existingRatings ? JSON.parse(existingRatings) : [];
    const updatedRatings = [newRating, ...ratings];
    
    localStorage.setItem(`service_ratings_${serviceId}`, JSON.stringify(updatedRatings));
    
    setRatings(updatedRatings);
    
    if (updatedRatings.length > 0) {
      const avg = updatedRatings.reduce((sum: number, r: ServiceRating) => sum + r.rating, 0) / updatedRatings.length;
      setAverageRating(Math.round(avg * 10) / 10);
    }
  };

  return { ratings, loading, averageRating, addRating };
};

const ServiceRating: React.FC<ServiceRatingProps> = ({ serviceId, serviceName, showAddRating = true }) => {
  const { ratings, loading, averageRating, addRating } = useServiceRatings(serviceId);
  const [selectedRating, setSelectedRating] = useState(0);
  const [review, setReview] = useState('');
  const [userName, setUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitRating = async () => {
    if (selectedRating === 0) {
      toast.error('Please select a rating before submitting.');
      return;
    }

    if (!userName.trim()) {
      toast.error('Please enter your name.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addRating(selectedRating, review, userName.trim());
      toast.success('Thank you for rating this service!');
      setSelectedRating(0);
      setReview('');
      setUserName('');
    } catch (error) {
      toast.error('Failed to submit rating. Please try again.');
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
      <Card className="bg-blue-800/50 border-blue-700">
        <CardContent className="p-6">
          <div className="text-center text-blue-200">Loading ratings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Average Rating Display */}
      <Card className="bg-blue-800/50 border-blue-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Star className="w-5 h-5 text-yellow-400" />
            {serviceName} Rating
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {renderStars(Math.round(averageRating))}
              <span className="text-lg font-semibold text-white">{averageRating}</span>
            </div>
            <span className="text-blue-300">({ratings.length} reviews)</span>
          </div>
        </CardContent>
      </Card>

      {/* Add Rating Form */}
      {showAddRating && (
        <Card className="bg-blue-800/50 border-blue-700">
          <CardHeader>
            <CardTitle className="text-white">Rate This Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-blue-200">Your Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3 py-2 bg-blue-700 border border-blue-600 rounded-md text-white placeholder-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-blue-200">Your Rating</label>
              <div className="flex gap-1">
                {renderStars(selectedRating, true)}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-blue-200">Review (Optional)</label>
              <Textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your thoughts about this service..."
                rows={3}
                className="bg-blue-700 border-blue-600 text-white placeholder-blue-300"
              />
            </div>
            <Button 
              onClick={handleSubmitRating}
              disabled={isSubmitting || selectedRating === 0 || !userName.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Rating'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Ratings List */}
      {ratings.length > 0 && (
        <Card className="bg-blue-800/50 border-blue-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <MessageSquare className="w-5 h-5" />
              Reviews ({ratings.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {ratings.map((rating) => (
                <div key={rating.id} className="border-b border-blue-600 pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {renderStars(rating.rating, false, 'w-4 h-4')}
                      <span className="text-sm font-medium text-white">{rating.user_name}</span>
                    </div>
                    <span className="text-sm text-blue-300">
                      {new Date(rating.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {rating.review && (
                    <p className="text-blue-200 text-sm">{rating.review}</p>
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

export default ServiceRating;