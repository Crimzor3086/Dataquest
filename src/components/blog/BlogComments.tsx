import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageSquare, User, Calendar, Reply } from 'lucide-react';
import { useBlogComments, useBlogMutations } from '@/hooks/useBlogManagement';

interface BlogCommentsProps {
  postId: string;
}

const BlogComments: React.FC<BlogCommentsProps> = ({ postId }) => {
  const { data: comments = [], isLoading } = useBlogComments(postId);
  const { createComment } = useBlogMutations();
  
  const [commentForm, setCommentForm] = useState({
    author_name: '',
    author_email: '',
    content: ''
  });
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleSubmitComment = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    
    if (!commentForm.author_name || !commentForm.author_email || !commentForm.content) {
      return;
    }

    createComment.mutate({
      post_id: postId,
      author_name: commentForm.author_name,
      author_email: commentForm.author_email,
      content: commentForm.content,
      parent_id: parentId || null,
      status: 'pending'
    }, {
      onSuccess: () => {
        setCommentForm({ author_name: '', author_email: '', content: '' });
        setReplyingTo(null);
      }
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Group comments by parent/child relationship
  const topLevelComments = comments.filter(comment => !comment.parent_id);
  const getReplies = (commentId: string) => 
    comments.filter(comment => comment.parent_id === commentId);

  if (isLoading) {
    return (
      <Card className="bg-blue-800/50 border-blue-700">
        <CardContent className="p-6">
          <div className="text-blue-200">Loading comments...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comments List */}
      <Card className="bg-blue-800/50 border-blue-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Comments ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topLevelComments.length === 0 ? (
            <div className="text-center py-8 text-blue-300">
              No comments yet. Be the first to share your thoughts!
            </div>
          ) : (
            <div className="space-y-6">
              {topLevelComments.map((comment) => {
                const replies = getReplies(comment.id);
                return (
                  <div key={comment.id} className="space-y-4">
                    {/* Main Comment */}
                    <div className="bg-blue-700/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-blue-400" />
                          <span className="text-white font-semibold">{comment.author_name}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1 text-blue-300 text-sm">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(comment.created_at)}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Reply className="w-3 h-3 mr-1" />
                            Reply
                          </Button>
                        </div>
                      </div>
                      <p className="text-blue-100">{comment.content}</p>
                    </div>

                    {/* Replies */}
                    {replies.length > 0 && (
                      <div className="ml-8 space-y-3">
                        {replies.map((reply) => (
                          <div key={reply.id} className="bg-blue-600/20 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <User className="w-3 h-3 text-blue-400" />
                                <span className="text-white text-sm font-semibold">{reply.author_name}</span>
                              </div>
                              <span className="text-blue-300 text-xs">{formatDate(reply.created_at)}</span>
                            </div>
                            <p className="text-blue-100 text-sm">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Form */}
                    {replyingTo === comment.id && (
                      <div className="ml-8">
                        <Card className="bg-blue-700/30 border-blue-600">
                          <CardContent className="p-4">
                            <form onSubmit={(e) => handleSubmitComment(e, comment.id)} className="space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <Label className="text-blue-200 text-sm">Name</Label>
                                  <Input
                                    value={commentForm.author_name}
                                    onChange={(e) => setCommentForm(prev => ({ ...prev, author_name: e.target.value }))}
                                    className="bg-blue-800 border-blue-600 text-white text-sm"
                                    required
                                  />
                                </div>
                                <div>
                                  <Label className="text-blue-200 text-sm">Email</Label>
                                  <Input
                                    type="email"
                                    value={commentForm.author_email}
                                    onChange={(e) => setCommentForm(prev => ({ ...prev, author_email: e.target.value }))}
                                    className="bg-blue-800 border-blue-600 text-white text-sm"
                                    required
                                  />
                                </div>
                              </div>
                              <div>
                                <Textarea
                                  value={commentForm.content}
                                  onChange={(e) => setCommentForm(prev => ({ ...prev, content: e.target.value }))}
                                  placeholder="Write your reply..."
                                  className="bg-blue-800 border-blue-600 text-white text-sm"
                                  rows={3}
                                  required
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  type="submit" 
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700"
                                  disabled={createComment.isPending}
                                >
                                  {createComment.isPending ? 'Posting...' : 'Post Reply'}
                                </Button>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setReplyingTo(null)}
                                  className="border-blue-600 text-blue-300 hover:bg-blue-700"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </form>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Comment Form */}
      <Card className="bg-blue-800/50 border-blue-700">
        <CardHeader>
          <CardTitle className="text-white">Leave a Comment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => handleSubmitComment(e)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-blue-200">Name *</Label>
                <Input
                  id="name"
                  value={commentForm.author_name}
                  onChange={(e) => setCommentForm(prev => ({ ...prev, author_name: e.target.value }))}
                  className="bg-blue-700 border-blue-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-blue-200">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={commentForm.author_email}
                  onChange={(e) => setCommentForm(prev => ({ ...prev, author_email: e.target.value }))}
                  className="bg-blue-700 border-blue-600 text-white"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="comment" className="text-blue-200">Comment *</Label>
              <Textarea
                id="comment"
                value={commentForm.content}
                onChange={(e) => setCommentForm(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Share your thoughts..."
                className="bg-blue-700 border-blue-600 text-white"
                rows={4}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={createComment.isPending}
            >
              {createComment.isPending ? 'Submitting...' : 'Submit Comment'}
            </Button>
          </form>
          <p className="text-blue-300 text-xs mt-2">
            Comments are moderated and will appear after approval.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogComments;