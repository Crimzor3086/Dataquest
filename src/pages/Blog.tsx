import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SEO from '@/components/SEO';
import BlogPostCard from '@/components/blog/BlogPostCard';
import BlogSearch from '@/components/blog/BlogSearch';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Calendar, User, Tag, TrendingUp, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useBlogPosts } from '@/hooks/useBlogManagement';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: posts = [], isLoading } = useBlogPosts();

  // Filter posts based on category and search
  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch && post.status === 'published';
  });

  // Get unique categories
  const categories = ['all', ...new Set(posts.map(post => post.category).filter(Boolean))];

  // Get featured posts (latest 3)
  const featuredPosts = posts
    .filter(post => post.status === 'published')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  // Get popular tags
  const allTags = posts.flatMap(post => post.tags || []);
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const popularTags = Object.entries(tagCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 10)
    .map(([tag]) => tag);

  return (
    <>
      <SEO 
        title="Blog - Data Science Insights & Tutorials | DataQuest Solutions"
        description="Explore our latest blog posts on data science, machine learning, analytics, and technology trends. Get expert insights and practical tutorials."
        keywords={['data science blog', 'machine learning tutorials', 'analytics insights', 'tech blog Kenya']}
        url="https://dataquestsolutions.com/blog"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        <Navigation />
        <WhatsAppButton />

        <div className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold text-white mb-6">Blog</h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Discover insights, tutorials, and the latest trends in data science, machine learning, and analytics.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="mb-12">
              <BlogSearch 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>

            {/* Blog Content Tabs */}
            <Tabs defaultValue="all" className="space-y-8">
              <TabsList className="grid w-full grid-cols-3 bg-blue-800/50">
                <TabsTrigger value="all" className="data-[state=active]:bg-blue-600">
                  All Posts ({filteredPosts.length})
                </TabsTrigger>
                <TabsTrigger value="featured" className="data-[state=active]:bg-blue-600">
                  Featured ({featuredPosts.length})
                </TabsTrigger>
                <TabsTrigger value="categories" className="data-[state=active]:bg-blue-600">
                  Categories
                </TabsTrigger>
              </TabsList>

              {/* All Posts */}
              <TabsContent value="all">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                    <p className="text-blue-200">Loading blog posts...</p>
                  </div>
                ) : filteredPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    <p className="text-blue-300 text-lg">No blog posts found</p>
                    <p className="text-blue-400 text-sm">
                      {searchQuery || selectedCategory !== 'all' 
                        ? 'Try adjusting your search or filter criteria'
                        : 'Check back soon for new content!'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPosts.map((post) => (
                      <BlogPostCard key={post.id} post={post} />
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Featured Posts */}
              <TabsContent value="featured">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredPosts.map((post) => (
                    <BlogPostCard key={post.id} post={post} featured />
                  ))}
                </div>
              </TabsContent>

              {/* Categories */}
              <TabsContent value="categories">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.filter(cat => cat !== 'all').map((category) => {
                    const categoryPosts = posts.filter(post => post.category === category && post.status === 'published');
                    return (
                      <Card key={category} className="bg-blue-800/50 border-blue-700 hover:bg-blue-800/70 transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-bold text-lg capitalize">{category}</h3>
                            <Badge variant="secondary" className="bg-blue-600">
                              {categoryPosts.length}
                            </Badge>
                          </div>
                          <p className="text-blue-200 text-sm mb-4">
                            {categoryPosts.length} post{categoryPosts.length !== 1 ? 's' : ''} in this category
                          </p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedCategory(category);
                              // Switch to all posts tab
                              const allTab = document.querySelector('[value="all"]') as HTMLButtonElement;
                              allTab?.click();
                            }}
                            className="w-full"
                          >
                            View Posts
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>

            {/* Popular Tags */}
            {popularTags.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Tag className="w-6 h-6 mr-2" />
                  Popular Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Badge 
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-blue-600 transition-colors"
                      onClick={() => setSearchQuery(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Blog Stats */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-blue-800/30 border-blue-700 text-center">
                <CardContent className="p-6">
                  <BookOpen className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{posts.filter(p => p.status === 'published').length}</div>
                  <div className="text-blue-300 text-sm">Published Posts</div>
                </CardContent>
              </Card>
              <Card className="bg-blue-800/30 border-blue-700 text-center">
                <CardContent className="p-6">
                  <Tag className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{categories.length - 1}</div>
                  <div className="text-blue-300 text-sm">Categories</div>
                </CardContent>
              </Card>
              <Card className="bg-blue-800/30 border-blue-700 text-center">
                <CardContent className="p-6">
                  <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{Object.keys(tagCounts).length}</div>
                  <div className="text-blue-300 text-sm">Total Tags</div>
                </CardContent>
              </Card>
              <Card className="bg-blue-800/30 border-blue-700 text-center">
                <CardContent className="p-6">
                  <Clock className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">Weekly</div>
                  <div className="text-blue-300 text-sm">New Content</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Blog;