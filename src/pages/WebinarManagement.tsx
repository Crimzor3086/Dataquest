import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Eye, Calendar, Clock, Users, Video, Link, Copy } from 'lucide-react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface Webinar {
  id: string;
  title: string;
  description: string;
  scheduled_date: string;
  duration_minutes: number;
  max_participants: number;
  meeting_link: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  instructor_id: string;
  created_at: string;
  updated_at: string;
}

const WebinarManagement = () => {
  const { user } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedWebinar, setSelectedWebinar] = useState<Webinar | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduled_date: '',
    duration_minutes: 60,
    max_participants: 100,
    meeting_link: '',
    instructor_id: '',
    status: 'scheduled' as const
  });
  const queryClient = useQueryClient();

  // Fetch webinars
  const { data: webinars = [], isLoading } = useQuery({
    queryKey: ['webinars'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('webinars')
        .select('*')
        .order('scheduled_date', { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch instructors
  const { data: instructors = [] } = useQuery({
    queryKey: ['instructors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .eq('role', 'instructor');
      if (error) throw error;
      return data || [];
    }
  });

  // Add webinar
  const addWebinar = useMutation({
    mutationFn: async (webinarData: any) => {
      const { error } = await supabase.from('webinars').insert({
        ...webinarData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webinars'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setIsAddModalOpen(false);
      resetForm();
      toast.success('Webinar created successfully!');
    }
  });

  // Update webinar
  const updateWebinar = useMutation({
    mutationFn: async ({ webinarId, updates }: { webinarId: string; updates: any }) => {
      const { error } = await supabase.from('webinars')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', webinarId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webinars'] });
      setIsEditModalOpen(false);
      resetForm();
      toast.success('Webinar updated successfully!');
    }
  });

  // Delete webinar
  const deleteWebinar = useMutation({
    mutationFn: async (webinarId: string) => {
      const { error } = await supabase.from('webinars').delete().eq('id', webinarId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webinars'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast.success('Webinar deleted successfully!');
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      scheduled_date: '',
      duration_minutes: 60,
      max_participants: 100,
      meeting_link: '',
      instructor_id: '',
      status: 'scheduled'
    });
    setSelectedWebinar(null);
  };

  const handleEdit = (webinar: Webinar) => {
    setSelectedWebinar(webinar);
    setFormData({
      title: webinar.title,
      description: webinar.description,
      scheduled_date: webinar.scheduled_date,
      duration_minutes: webinar.duration_minutes,
      max_participants: webinar.max_participants,
      meeting_link: webinar.meeting_link,
      instructor_id: webinar.instructor_id,
      status: webinar.status
    });
    setIsEditModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedWebinar) {
      updateWebinar.mutate({ webinarId: selectedWebinar.id, updates: formData });
    } else {
      addWebinar.mutate(formData);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-600';
      case 'live': return 'bg-green-600';
      case 'completed': return 'bg-gray-600';
      case 'cancelled': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const copyMeetingLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success('Meeting link copied to clipboard!');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navigation />
      
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl font-bold text-white mb-6">Webinar Management</h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Schedule, manage, and track webinars and live sessions for your educational platform.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white mb-1">
                  {webinars.filter(w => w.status === 'scheduled').length}
                </div>
                <div className="text-gray-400">Scheduled</div>
                <div className="text-green-400 text-sm">Live Data</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center">
                <Video className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white mb-1">
                  {webinars.filter(w => w.status === 'live').length}
                </div>
                <div className="text-gray-400">Live Now</div>
                <div className="text-blue-400 text-sm">Live Data</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white mb-1">
                  {webinars.reduce((sum, w) => sum + w.max_participants, 0)}
                </div>
                <div className="text-gray-400">Total Capacity</div>
                <div className="text-green-400 text-sm">Live Data</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white mb-1">
                  {webinars.reduce((sum, w) => sum + w.duration_minutes, 0)}
                </div>
                <div className="text-gray-400">Total Minutes</div>
                <div className="text-green-400 text-sm">Live Data</div>
              </CardContent>
            </Card>
          </div>

          {/* Management Tabs */}
          <Tabs defaultValue="webinars" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
              <TabsTrigger value="webinars" className="data-[state=active]:bg-blue-600">
                All Webinars ({webinars.length})
              </TabsTrigger>
              <TabsTrigger value="scheduled" className="data-[state=active]:bg-blue-600">
                Scheduled ({webinars.filter(w => w.status === 'scheduled').length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-blue-600">
                Completed ({webinars.filter(w => w.status === 'completed').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="webinars" className="space-y-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-white">All Webinars</CardTitle>
                      <CardDescription className="text-gray-400">Manage all webinars and live sessions</CardDescription>
                    </div>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => setIsAddModalOpen(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Schedule Webinar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {webinars.map((webinar) => (
                      <Card key={webinar.id} className="bg-gray-700/50 border-gray-600">
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                            <div className="lg:col-span-4">
                              <h3 className="text-white font-semibold">{webinar.title}</h3>
                              <p className="text-gray-400 text-sm">{webinar.description}</p>
                              <p className="text-blue-400 text-xs">{formatDate(webinar.scheduled_date)}</p>
                            </div>
                            
                            <div className="lg:col-span-2">
                              <Badge className={`${getStatusColor(webinar.status)} text-white`}>
                                {webinar.status}
                              </Badge>
                            </div>
                            
                            <div className="lg:col-span-2 text-center">
                              <div className="text-white font-semibold">{webinar.duration_minutes} min</div>
                              <div className="text-gray-400 text-xs">Duration</div>
                            </div>
                            
                            <div className="lg:col-span-2 text-center">
                              <div className="text-white font-semibold">{webinar.max_participants}</div>
                              <div className="text-gray-400 text-xs">Max Participants</div>
                            </div>
                            
                            <div className="lg:col-span-2">
                              <div className="flex space-x-1">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="border-gray-600 text-gray-300 hover:bg-gray-600"
                                  onClick={() => handleEdit(webinar)}
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="border-gray-600 text-gray-300 hover:bg-gray-600"
                                  onClick={() => copyMeetingLink(webinar.meeting_link)}
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="border-red-600 text-red-300 hover:bg-red-600"
                                  onClick={() => {
                                    if (confirm('Are you sure you want to delete this webinar?')) {
                                      deleteWebinar.mutate(webinar.id);
                                    }
                                  }}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scheduled" className="space-y-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Scheduled Webinars</CardTitle>
                  <CardDescription className="text-gray-400">Upcoming webinars and live sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {webinars.filter(w => w.status === 'scheduled').map((webinar) => (
                      <Card key={webinar.id} className="bg-gray-700/50 border-gray-600">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-white font-semibold">{webinar.title}</h3>
                              <p className="text-gray-400 text-sm">{formatDate(webinar.scheduled_date)}</p>
                              <p className="text-blue-400 text-xs">{webinar.duration_minutes} minutes • {webinar.max_participants} participants</p>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-gray-600 text-gray-300 hover:bg-gray-600"
                                onClick={() => handleEdit(webinar)}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-green-600 text-green-300 hover:bg-green-600"
                                onClick={() => copyMeetingLink(webinar.meeting_link)}
                              >
                                <Copy className="w-4 h-4 mr-2" />
                                Copy Link
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="completed" className="space-y-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Completed Webinars</CardTitle>
                  <CardDescription className="text-gray-400">Past webinars and recordings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {webinars.filter(w => w.status === 'completed').map((webinar) => (
                      <Card key={webinar.id} className="bg-gray-700/50 border-gray-600">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-white font-semibold">{webinar.title}</h3>
                              <p className="text-gray-400 text-sm">Completed on {formatDate(webinar.scheduled_date)}</p>
                              <p className="text-blue-400 text-xs">{webinar.duration_minutes} minutes</p>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-gray-600 text-gray-300 hover:bg-gray-600"
                                onClick={() => handleEdit(webinar)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Add Webinar Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Schedule New Webinar</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white"
                rows={3}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="scheduled_date">Scheduled Date & Time</Label>
                <Input
                  id="scheduled_date"
                  type="datetime-local"
                  value={formData.scheduled_date}
                  onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="max_participants">Max Participants</Label>
                <Input
                  id="max_participants"
                  type="number"
                  value={formData.max_participants}
                  onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) })}
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="instructor">Instructor</Label>
                <Select value={formData.instructor_id} onValueChange={(value) => setFormData({ ...formData, instructor_id: value })}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Select instructor" />
                  </SelectTrigger>
                  <SelectContent>
                    {instructors.map((instructor) => (
                      <SelectItem key={instructor.id} value={instructor.id}>
                        {instructor.first_name} {instructor.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="meeting_link">Meeting Link</Label>
              <Input
                id="meeting_link"
                value={formData.meeting_link}
                onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="https://meet.google.com/..."
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                className="border-gray-600 text-gray-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={addWebinar.isPending}
              >
                {addWebinar.isPending ? 'Creating...' : 'Schedule Webinar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Webinar Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Edit Webinar</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white"
                rows={3}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="scheduled_date">Scheduled Date & Time</Label>
                <Input
                  id="scheduled_date"
                  type="datetime-local"
                  value={formData.scheduled_date}
                  onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="max_participants">Max Participants</Label>
                <Input
                  id="max_participants"
                  type="number"
                  value={formData.max_participants}
                  onChange={(e) => setFormData({ ...formData, max_participants: parseInt(e.target.value) })}
                  className="bg-gray-800 border-gray-600 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="meeting_link">Meeting Link</Label>
              <Input
                id="meeting_link"
                value={formData.meeting_link}
                onChange={(e) => setFormData({ ...formData, meeting_link: e.target.value })}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="https://meet.google.com/..."
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                className="border-gray-600 text-gray-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={updateWebinar.isPending}
              >
                {updateWebinar.isPending ? 'Updating...' : 'Update Webinar'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WebinarManagement;
