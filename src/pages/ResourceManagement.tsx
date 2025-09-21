import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Download, FileText, Video, Image, Archive } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useResourceCategories } from '@/hooks/useResourceManagement';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  file_url: string | null;
  is_free: boolean;
  download_count: number;
  created_at: string;
  // Optional properties for compatibility
  category_id?: string;
  difficulty_level?: string;
  preview_url?: string;
  featured?: boolean;
}

const ResourceManagement = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    category_id: '',
    difficulty_level: '',
    file_url: '',
    preview_url: '',
    is_free: true,
    featured: false,
    tags: '',
    author: '',
    version: '1.0',
    file_size: 0
  });
  const [file, setFile] = useState<File | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const { data: categories = [] } = useResourceCategories();

  const resourceTypes = [
    { value: 'pdf', label: 'PDF Document', icon: FileText },
    { value: 'video', label: 'Video', icon: Video },
    { value: 'image', label: 'Image', icon: Image },
    { value: 'archive', label: 'Archive/Zip', icon: Archive },
    { value: 'other', label: 'Other', icon: FileText }
  ];

  const difficultyLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast.error('Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Upload file if provided
      let uploadedUrl = formData.file_url;
      let previewUrl = formData.preview_url;
      
      if (file) {
        const { data: { user } } = await supabase.auth.getUser();
        const ext = file.name.split('.').pop();
        const filePath = `${user?.id || 'public'}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('resources').upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data: publicData } = supabase.storage.from('resources').getPublicUrl(filePath);
        uploadedUrl = publicData.publicUrl;
      }

      if (previewFile) {
        const { data: { user } } = await supabase.auth.getUser();
        const ext = previewFile.name.split('.').pop();
        const filePath = `${user?.id || 'public'}/previews/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('resources').upload(filePath, previewFile);
        if (uploadError) throw uploadError;
        const { data: publicData } = supabase.storage.from('resources').getPublicUrl(filePath);
        previewUrl = publicData.publicUrl;
      }

      const payload = { 
        ...formData, 
        file_url: uploadedUrl,
        preview_url: previewUrl,
        category_id: formData.category_id || null,
        difficulty_level: formData.difficulty_level || null,
        author_id: (await supabase.auth.getUser()).data.user?.id || null,
        file_size_mb: file ? (file.size / (1024 * 1024)) : null
      };

      if (editingResource) {
        const { error } = await supabase
          .from('resources')
          .update(payload)
          .eq('id', editingResource.id);
        
        if (error) throw error;
        toast.success('Resource updated successfully!');
      } else {
        const { error } = await supabase
          .from('resources')
          .insert(payload);
        
        if (error) throw error;
        toast.success('Resource created successfully!');
      }

      setIsDialogOpen(false);
      setEditingResource(null);
      setFormData({ 
        title: '', 
        description: '', 
        type: '', 
        category_id: '',
        difficulty_level: '',
        file_url: '', 
        preview_url: '',
        is_free: true,
        featured: false
      });
      setFile(null);
      setPreviewFile(null);
      fetchResources();
    } catch (error) {
      console.error('Error saving resource:', error);
      toast.error('Failed to save resource');
    }
  };

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title,
      description: resource.description,
      type: resource.type,
      category_id: resource.category_id || '',
      difficulty_level: resource.difficulty_level || '',
      file_url: resource.file_url || '',
      preview_url: resource.preview_url || '',
      is_free: resource.is_free,
      featured: resource.featured || false
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;

    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Resource deleted successfully!');
      fetchResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast.error('Failed to delete resource');
    }
  };

  const getTypeIcon = (type: string) => {
    const resourceType = resourceTypes.find(rt => rt.value === type);
    return resourceType ? resourceType.icon : FileText;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navigation />
      
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Resource Management</h1>
              <p className="text-gray-400">Upload and manage downloadable resources</p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    setEditingResource(null);
                    setFormData({ 
                      title: '', 
                      description: '', 
                      type: '', 
                      category_id: '',
                      difficulty_level: '',
                      file_url: '', 
                      preview_url: '',
                      is_free: true,
                      featured: false
                    });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Resource
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-gray-800 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {editingResource ? 'Edit Resource' : 'Add New Resource'}
                  </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                  <div>
                    <Label htmlFor="title" className="text-gray-200">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description" className="text-gray-200">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category" className="text-gray-200">Category</Label>
                      <Select 
                        value={formData.category_id || 'none'} 
                        onValueChange={(value) => setFormData({ ...formData, category_id: value === 'none' ? '' : value })}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="none">No Category</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id} className="text-white">
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="difficulty" className="text-gray-200">Difficulty Level</Label>
                      <Select 
                        value={formData.difficulty_level || 'none'} 
                        onValueChange={(value) => setFormData({ ...formData, difficulty_level: value === 'none' ? '' : value })}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600 z-50">
                          <SelectItem value="none">Not Specified</SelectItem>
                          {difficultyLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value} className="text-white">
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="type" className="text-gray-200">Resource Type</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select resource type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        {resourceTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value} className="text-white">
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="file" className="text-gray-200">Upload File</Label>
                    <Input
                      id="file"
                      type="file"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    {file && (
                      <p className="text-gray-400 text-xs mt-1">Selected: {file.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="preview" className="text-gray-200">Preview File (Optional)</Label>
                    <Input
                      id="preview"
                      type="file"
                      accept="image/*,video/*"
                      onChange={(e) => setPreviewFile(e.target.files?.[0] || null)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    {previewFile && (
                      <p className="text-gray-400 text-xs mt-1">Preview: {previewFile.name}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="author" className="text-gray-200">Author</Label>
                      <Input
                        id="author"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="Resource author"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="version" className="text-gray-200">Version</Label>
                      <Input
                        id="version"
                        value={formData.version}
                        onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                        className="bg-gray-700 border-gray-600 text-white"
                        placeholder="1.0"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="tags" className="text-gray-200">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="web development, javascript, tutorial"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.is_free}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_free: checked })}
                    />
                    <Label className="text-gray-200">Free resource</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.featured}
                        onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                      />
                      <Label className="text-gray-200">Featured resource</Label>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      {editingResource ? 'Update Resource' : 'Add Resource'}
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

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">All Resources</CardTitle>
              <CardDescription className="text-gray-400">
                Manage your downloadable resources and track downloads
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-gray-400">Loading resources...</div>
              ) : resources.length === 0 ? (
                <div className="text-center py-8 text-gray-400">No resources found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Title</TableHead>
                      <TableHead className="text-gray-300">Type</TableHead>
                      <TableHead className="text-gray-300">Category</TableHead>
                      <TableHead className="text-gray-300">Access</TableHead>
                      <TableHead className="text-gray-300">Downloads</TableHead>
                      <TableHead className="text-gray-300">Created</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resources.map((resource) => {
                      const TypeIcon = getTypeIcon(resource.type);
                      return (
                        <TableRow key={resource.id} className="border-gray-700">
                          <TableCell className="text-white font-medium">
                            <div className="flex items-center gap-2">
                              <TypeIcon className="w-4 h-4 text-blue-400" />
                              {resource.title}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-400 capitalize">
                            {resource.type}
                          </TableCell>
                          <TableCell className="text-gray-400">
                            {resource.category_id ? 'Categorized' : 'Uncategorized'}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={resource.is_free ? "default" : "secondary"}
                              className={resource.is_free ? "bg-green-600" : "bg-yellow-600"}
                            >
                              {resource.is_free ? 'Free' : 'Premium'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-400">
                            <div className="flex items-center gap-1">
                              <Download className="w-4 h-4" />
                              {resource.download_count || 0}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-400">
                            {new Date(resource.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(resource)}
                                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(resource.id)}
                                className="border-red-600 text-red-400 hover:bg-red-900/20"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ResourceManagement;