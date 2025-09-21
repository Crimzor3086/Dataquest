import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SEO from '@/components/SEO';
import EnhancedResourceCard from '@/components/resources/EnhancedResourceCard';
import ResourceFilters from '@/components/resources/ResourceFilters';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Star, TrendingUp, BookOpen, Video, Code, Database } from 'lucide-react';
import { useState } from 'react';
import { useResources } from '@/hooks/useResourceManagement';

const Resources = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: resources = [], isLoading } = useResources();

  // Filter resources based on category, type, and search
  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesType && matchesSearch && resource.status === 'published';
  });

  // Get unique categories and types
  const categories = ['all', ...new Set(resources.map(resource => resource.category).filter(Boolean))];
  const types = ['all', ...new Set(resources.map(resource => resource.type).filter(Boolean))];

  // Get featured resources (highest rated or most downloaded)
  const featuredResources = resources
    .filter(resource => resource.status === 'published')
    .sort((a, b) => (b.download_count || 0) - (a.download_count || 0))
    .slice(0, 6);

  // Get popular tags
  const allTags = resources.flatMap(resource => resource.tags || []);
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const popularTags = Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([tag]) => tag);

  // Resource type icons
  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'pdf': return <FileText className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'code': return <Code className="w-5 h-5" />;
      case 'dataset': return <Database className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  return (
    <>
      <SEO 
        title="Resources - Free Data Science Materials & Tools | DataQuest Solutions"
        description="Access our comprehensive collection of free data science resources including datasets, tutorials, templates, and tools for your projects."
        keywords={['data science resources', 'free datasets', 'machine learning tools', 'analytics templates Kenya']}
        url="https://dataquestsolutions.com/resources"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        <Navigation />
        <WhatsAppButton />

        <div className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold text-white mb-6">Resources</h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Access our comprehensive collection of free data science resources, tools, and materials to accelerate your learning and projects.
              </p>
            </div>

            {/* Filters */}
            <div className="mb-12">
              <ResourceFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                types={['pdf', 'video', 'template', 'guide', 'tool']}
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                difficulties={['beginner', 'intermediate', 'advanced']}
                selectedDifficulty={''}
                onDifficultyChange={() => {}}
              />
            </div>

            {/* Resource Content Tabs */}
            <Tabs defaultValue="all" className="space-y-8">
              <TabsList className="grid w-full grid-cols-4 bg-blue-800/50">
                <TabsTrigger value="all" className="data-[state=active]:bg-blue-600">
                  All Resources ({filteredResources.length})
                </TabsTrigger>
                <TabsTrigger value="featured" className="data-[state=active]:bg-blue-600">
                  Featured ({featuredResources.length})
                </TabsTrigger>
                <TabsTrigger value="categories" className="data-[state=active]:bg-blue-600">
                  Categories
                </TabsTrigger>
                <TabsTrigger value="types" className="data-[state=active]:bg-blue-600">
                  Types
                </TabsTrigger>
              </TabsList>

              {/* All Resources */}
              <TabsContent value="all">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                    <p className="text-blue-200">Loading resources...</p>
                  </div>
                ) : filteredResources.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    <p className="text-blue-300 text-lg">No resources found</p>
                    <p className="text-blue-400 text-sm">
                      {searchQuery || selectedCategory !== 'all' || selectedType !== 'all'
                        ? 'Try adjusting your search or filter criteria'
                        : 'Check back soon for new resources!'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredResources.map((resource) => (
                      <EnhancedResourceCard 
                        key={resource.id} 
                        resource={resource} 
                        onPreview={() => {}}
                        onDownload={() => {}}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Featured Resources */}
              <TabsContent value="featured">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredResources.map((resource) => (
                    <EnhancedResourceCard
                      key={resource.id}
                      resource={resource}
                      onPreview={() => {}}
                      onDownload={() => {}}
                    />
                  ))}
                </div>
              </TabsContent>

              {/* Categories */}
              <TabsContent value="categories">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.filter(cat => cat !== 'all').map((category) => {
                    const categoryResources = resources.filter(resource => resource.category === category && resource.status === 'published');
                    return (
                      <Card key={category} className="bg-blue-800/50 border-blue-700 hover:bg-blue-800/70 transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-bold text-lg capitalize">{category}</h3>
                            <Badge variant="secondary" className="bg-blue-600">
                              {categoryResources.length}
                            </Badge>
                          </div>
                          <p className="text-blue-200 text-sm mb-4">
                            {categoryResources.length} resource{categoryResources.length !== 1 ? 's' : ''} in this category
                          </p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedCategory(category);
                              // Switch to all resources tab
                              const allTab = document.querySelector('[value="all"]') as HTMLButtonElement;
                              allTab?.click();
                            }}
                            className="w-full"
                          >
                            View Resources
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Types */}
              <TabsContent value="types">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {types.filter(type => type !== 'all').map((type) => {
                    const typeResources = resources.filter(resource => resource.type === type && resource.status === 'published');
                    return (
                      <Card key={type} className="bg-blue-800/50 border-blue-700 hover:bg-blue-800/70 transition-all duration-300">
                        <CardContent className="p-6 text-center">
                          <div className="flex justify-center mb-3">
                            {getTypeIcon(type)}
                          </div>
                          <h3 className="text-white font-bold text-lg capitalize mb-2">{type}</h3>
                          <Badge variant="secondary" className="bg-blue-600 mb-4">
                            {typeResources.length}
                          </Badge>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedType(type);
                              // Switch to all resources tab
                              const allTab = document.querySelector('[value="all"]') as HTMLButtonElement;
                              allTab?.click();
                            }}
                            className="w-full"
                          >
                            View {type}s
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
                  <Star className="w-6 h-6 mr-2" />
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

            {/* Resource Stats */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-blue-800/30 border-blue-700 text-center">
                <CardContent className="p-6">
                  <FileText className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{resources.filter(r => r.status === 'published').length}</div>
                  <div className="text-blue-300 text-sm">Total Resources</div>
                </CardContent>
              </Card>
              <Card className="bg-blue-800/30 border-blue-700 text-center">
                <CardContent className="p-6">
                  <Download className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">
                    {resources.reduce((sum, r) => sum + (r.download_count || 0), 0)}
                  </div>
                  <div className="text-blue-300 text-sm">Total Downloads</div>
                </CardContent>
              </Card>
              <Card className="bg-blue-800/30 border-blue-700 text-center">
                <CardContent className="p-6">
                  <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{categories.length - 1}</div>
                  <div className="text-blue-300 text-sm">Categories</div>
                </CardContent>
              </Card>
              <Card className="bg-blue-800/30 border-blue-700 text-center">
                <CardContent className="p-6">
                  <Star className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">Free</div>
                  <div className="text-blue-300 text-sm">All Resources</div>
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

export default Resources;