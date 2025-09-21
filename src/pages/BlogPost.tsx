import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SEO from '@/components/SEO';
import BlogComments from '@/components/blog/BlogComments';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Clock, Eye, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { useBlogPost } from '@/hooks/useBlogManagement';
import { toast } from 'sonner';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: post, isLoading, error } = useBlogPost(slug || '');

  useEffect(() => {
    if (error) {
      toast.error('Blog post not found');
      navigate('/blog');
    }
  }, [error, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        <Navigation />
        <div className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-blue-200">Loading blog post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        <Navigation />
        <div className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
            <Button onClick={() => navigate('/blog')} className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const authorName = post.profiles 
    ? `${post.profiles.first_name} ${post.profiles.last_name}`.trim()
    : 'DataQuest Team';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareUrl = window.location.href;
  const shareTitle = post.title;

  const handleShare = (platform: string) => {
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    };

    window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied to clipboard!');
  };

  return (
    <>
      <SEO 
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt || post.title}
        keywords={['data science', 'analytics', 'machine learning', 'blog']}
        url={shareUrl}
        image={post.image_url || undefined}
        type="article"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        <Navigation />
        <WhatsAppButton />
        
        <div className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Button 
              variant="outline" 
              onClick={() => navigate('/blog')}
              className="mb-8 border-blue-600 text-blue-300 hover:bg-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>

            {/* Article Header */}
            <article>
              <header className="mb-8">
                {/* Category and Meta Info */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  {post.blog_categories && (
                    <Badge 
                      className="border-0"
                      style={{ backgroundColor: post.blog_categories.color }}
                    >
                      {post.blog_categories.name}
                    </Badge>
                  )}
                  <div className="flex items-center space-x-4 text-blue-200 text-sm">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{authorName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.reading_time} min read</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{post.view_count} views</span>
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  {post.title}
                </h1>

                {/* Excerpt */}
                {post.excerpt && (
                  <p className="text-xl text-blue-200 mb-8 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}

                {/* Featured Image */}
                {post.image_url && (
                  <div className="mb-8">
                    <img 
                      src={post.image_url} 
                      alt={post.title}
                      className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
                    />
                  </div>
                )}

                {/* Share Buttons */}
                <div className="flex items-center justify-between mb-8 p-4 bg-blue-800/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Share2 className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-200 text-sm">Share this article:</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare('facebook')}
                      className="border-blue-600 text-blue-300 hover:bg-blue-700"
                    >
                      <Facebook className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare('twitter')}
                      className="border-blue-600 text-blue-300 hover:bg-blue-700"
                    >
                      <Twitter className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare('linkedin')}
                      className="border-blue-600 text-blue-300 hover:bg-blue-700"
                    >
                      <Linkedin className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="border-blue-600 text-blue-300 hover:bg-blue-700"
                    >
                      Copy Link
                    </Button>
                  </div>
                </div>
              </header>

              {/* Article Content */}
              <Card className="bg-blue-800/50 border-blue-700 mb-12">
                <CardContent className="p-8">
                  <div 
                    className="prose prose-invert prose-blue max-w-none text-blue-100 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </CardContent>
              </Card>
            </article>

            {/* Comments Section */}
            <BlogComments postId={post.id} />
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default BlogPost;