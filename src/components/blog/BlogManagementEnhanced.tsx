import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Eye, MessageSquare, Tag, Folder, Image } from 'lucide-react';
import { useBlogPosts, useBlogCategories, useBlogTags, useBlogMutations, BlogPost } from '@/hooks/useBlogManagement';
import { useAuth } from '@/contexts/AuthContext';

const BlogManagementEnhanced = () => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [activeTab, setActiveTab] = useState('posts');
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    meta_title: '',
    meta_description: '',
    image_url: '',
    category_id: '',
    published: false,
    featured: false
  });

  const { data: posts = [], isLoading } = useBlogPosts({ published: undefined });
  const { data: categories = [] } = useBlogCategories();
  const { data: tags = [] } = useBlogTags();
  const { createPost, updatePost, deletePost } = useBlogMutations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const postData = {
      ...formData,
      author_id: user.id,
      category_id: formData.category_id || null,
      slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      created_at: editingPost ? undefined : new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (editingPost) {
      updatePost.mutate({ id: editingPost.id, ...postData }, {
        onSuccess: () => {
          setIsDialogOpen(false);
          resetForm();
        }
      });
    } else {
      createPost.mutate(postData, {
        onSuccess: () => {
          setIsDialogOpen(false);
          resetForm();
        }
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      meta_title: '',
      meta_description: '',
      image_url: '',
      category_id: '',
      published: false,
      featured: false
    });
    setEditingPost(null);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || '',
      image_url: post.image_url || '',
      category_id: post.category_id || '',
      published: post.published,
      featured: post.featured
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      deletePost.mutate(id);
    }
  };

  const getStatusBadge = (post: BlogPost) => {
    if (post.featured) {
      return <Badge className="bg-yellow-600">Featured</Badge>;
    }
    if (post.published) {
      return <Badge className="bg-green-600">Published</Badge>;
    }
    return <Badge className="bg-gray-600">Draft</Badge>;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Enhanced Blog Management</h1>
          <p className="text-gray-400">Create and manage blog posts with advanced features</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={resetForm}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-700">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="seo">SEO</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="content" className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-gray-200">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="excerpt" className="text-gray-200">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      rows={3}
                      placeholder="Brief description of the post..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="content" className="text-gray-200">Content *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white min-h-[400px]"
                      placeholder="Write your blog post content here... You can use HTML for formatting."
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="image" className="text-gray-200">Featured Image URL</Label>
                    <Input
                      id="image"
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="seo" className="space-y-4">
                  <div>
                    <Label htmlFor="meta-title" className="text-gray-200">SEO Title</Label>
                    <Input
                      id="meta-title"
                      value={formData.meta_title}
                      onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="SEO optimized title (60 chars max)"
                      maxLength={60}
                    />
                    <p className="text-gray-400 text-xs mt-1">
                      {formData.meta_title.length}/60 characters
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="meta-description" className="text-gray-200">SEO Description</Label>
                    <Textarea
                      id="meta-description"
                      value={formData.meta_description}
                      onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      rows={3}
                      placeholder="SEO meta description (160 chars max)"
                      maxLength={160}
                    />
                    <p className="text-gray-400 text-xs mt-1">
                      {formData.meta_description.length}/160 characters
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="settings" className="space-y-4">
                  <div>
                    <Label htmlFor="category" className="text-gray-200">Category</Label>
                    <Select value={formData.category_id || 'none'} onValueChange={(value) => setFormData({ ...formData, category_id: value === 'none' ? '' : value })}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600 z-50">
                          <SelectItem value="none">No Category</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id} className="text-white">
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={formData.published}
                          onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                        />
                        <Label className="text-gray-200">Publish immediately</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={formData.featured}
                          onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                        />
                        <Label className="text-gray-200">Featured post</Label>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="image-url" className="text-gray-200">Featured Image URL</Label>
                      <Input
                        id="image-url"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="https://example.com/image.jpg"
                        type="url"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex gap-4 pt-4">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {editingPost ? 'Update Post' : 'Create Post'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
          <TabsTrigger value="posts" className="data-[state=active]:bg-blue-600">
            Posts ({posts.length})
          </TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-blue-600">
            Categories ({categories.length})
          </TabsTrigger>
          <TabsTrigger value="tags" className="data-[state=active]:bg-blue-600">
            Tags ({tags.length})
          </TabsTrigger>
          <TabsTrigger value="comments" className="data-[state=active]:bg-blue-600">
            Comments
          </TabsTrigger>
        </TabsList>

        {/* Posts Tab */}
        <TabsContent value="posts">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">All Blog Posts</CardTitle>
              <CardDescription className="text-gray-400">
                Manage your blog posts and their publication status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-gray-400">Loading posts...</div>
              ) : posts.length === 0 ? (
                <div className="text-center py-8 text-gray-400">No blog posts found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Title</TableHead>
                      <TableHead className="text-gray-300">Category</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Views</TableHead>
                      <TableHead className="text-gray-300">Created</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map((post) => (
                      <TableRow key={post.id} className="border-gray-700">
                        <TableCell className="text-white font-medium">
                          <div>
                            <div className="font-semibold">{post.title}</div>
                            {post.excerpt && (
                              <div className="text-gray-400 text-xs line-clamp-1">{post.excerpt}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {post.blog_categories ? (
                            <Badge 
                              variant="outline" 
                              style={{ borderColor: post.blog_categories.color, color: post.blog_categories.color }}
                            >
                              {post.blog_categories.name}
                            </Badge>
                          ) : (
                            <span className="text-gray-500">No category</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(post)}
                        </TableCell>
                        <TableCell className="text-gray-400">
                          {post.view_count}
                        </TableCell>
                        <TableCell className="text-gray-400">
                          {new Date(post.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                              className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(post)}
                              className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(post.id)}
                              className="border-red-600 text-red-400 hover:bg-red-900/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Folder className="w-5 h-5 mr-2" />
                Blog Categories
              </CardTitle>
              <CardDescription className="text-gray-400">
                Organize your blog posts into categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <Card key={category.id} className="bg-gray-700/30 border-gray-600">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <div>
                          <h4 className="text-white font-semibold">{category.name}</h4>
                          <p className="text-gray-400 text-xs">{category.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tags Tab */}
        <TabsContent value="tags">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                Blog Tags
              </CardTitle>
              <CardDescription className="text-gray-400">
                Manage tags for better content organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge 
                    key={tag.id} 
                    variant="outline" 
                    className="border-blue-600 text-blue-300"
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comments Tab */}
        <TabsContent value="comments">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Comment Moderation
              </CardTitle>
              <CardDescription className="text-gray-400">
                Review and moderate blog comments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-400">
                Comment moderation interface coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlogManagementEnhanced;