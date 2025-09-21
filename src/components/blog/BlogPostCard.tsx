import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, Clock, Eye, Star } from 'lucide-react';
import { BlogPost } from '@/hooks/useBlogManagement';
import { useNavigate } from 'react-router-dom';

interface BlogPostCardProps {
  post: BlogPost;
  showExcerpt?: boolean;
  featured?: boolean;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, showExcerpt = true, featured = false }) => {
  const navigate = useNavigate();

  const handleReadMore = () => {
    navigate(`/blog/${post.slug}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const authorName = post.profiles 
    ? `${post.profiles.first_name} ${post.profiles.last_name}`.trim()
    : 'DataQuest Team';

  return (
    <Card className={`bg-blue-800/50 border-blue-700 hover:bg-blue-800/70 transition-all duration-300 ${featured ? 'ring-2 ring-blue-400' : ''}`}>
      {post.image_url && (
        <div className="relative">
          <img 
            src={post.image_url} 
            alt={post.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          {featured && (
            <Badge className="absolute top-4 left-4 bg-yellow-600 text-white">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Badge>
          )}
          {post.blog_categories && (
            <Badge 
              className="absolute top-4 right-4 border-0"
              style={{ backgroundColor: post.blog_categories.color }}
            >
              {post.blog_categories.name}
            </Badge>
          )}
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="text-white text-lg line-clamp-2 hover:text-blue-300 cursor-pointer" onClick={handleReadMore}>
          {post.title}
        </CardTitle>
        
        <div className="flex items-center justify-between text-xs text-blue-200">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>{authorName}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(post.created_at)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{post.reading_time} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{post.view_count}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {showExcerpt && post.excerpt && (
          <p className="text-blue-100 text-sm mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <Button 
            variant="outline"
            size="sm"
            onClick={handleReadMore}
            className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
          >
            Read More →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogPostCard;