
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Users, Briefcase, BookOpen, Building } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AdminQuickActions = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  // Form states
  const [studentForm, setStudentForm] = useState({
    first_name: '', last_name: '', email: '', phone: ''
  });
  const [clientForm, setClientForm] = useState({
    name: '', contact_person: '', email: '', phone: '', industry: ''
  });
  const [projectForm, setProjectForm] = useState({
    title: '', description: '', budget: '', status: 'planning' as const
  });
  const [courseForm, setCourseForm] = useState({
    title: '', description: '', duration_hours: '', price: '', status: 'draft' as const
  });

  const handleAddStudent = async () => {
    setLoading('student');
    try {
      // Generate a UUID for the new profile
      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email: studentForm.email,
        password: 'temporary123',
        email_confirm: true
      });

      if (userError) throw userError;

      // Create profile with the user ID
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userData.user.id,
          first_name: studentForm.first_name,
          last_name: studentForm.last_name,
          email: studentForm.email,
          phone: studentForm.phone
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Student Added",
        description: `${studentForm.first_name} ${studentForm.last_name} has been added successfully.`,
      });

      setStudentForm({ first_name: '', last_name: '', email: '', phone: '' });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add student",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  const handleAddClient = async () => {
    setLoading('client');
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: clientForm.name,
          contact_person: clientForm.contact_person,
          email: clientForm.email,
          phone: clientForm.phone,
          industry: clientForm.industry,
          status: 'prospect'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Client Added",
        description: `${clientForm.name} has been added successfully.`,
      });

      setClientForm({ name: '', contact_person: '', email: '', phone: '', industry: '' });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add client",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  const handleCreateProject = async () => {
    setLoading('project');
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          title: projectForm.title,
          description: projectForm.description,
          budget: projectForm.budget ? parseFloat(projectForm.budget) : null,
          status: projectForm.status,
          progress: 0
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Project Created",
        description: `${projectForm.title} has been created successfully.`,
      });

      setProjectForm({ title: '', description: '', budget: '', status: 'planning' });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  const handleCreateCourse = async () => {
    setLoading('course');
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert({
          title: courseForm.title,
          description: courseForm.description,
          duration_hours: courseForm.duration_hours ? parseInt(courseForm.duration_hours) : null,
          price: courseForm.price ? parseFloat(courseForm.price) : null,
          status: courseForm.status
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Course Created",
        description: `${courseForm.title} has been created successfully.`,
      });

      setCourseForm({ title: '', description: '', duration_hours: '', price: '', status: 'draft' });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create course",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Add Student */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-20 flex flex-col gap-2 border-gray-600 text-gray-300 hover:bg-gray-700">
                <Users className="w-6 h-6" />
                <span className="text-sm">Add Student</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Student</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="First Name"
                  value={studentForm.first_name}
                  onChange={(e) => setStudentForm(prev => ({ ...prev, first_name: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Input
                  placeholder="Last Name"
                  value={studentForm.last_name}
                  onChange={(e) => setStudentForm(prev => ({ ...prev, last_name: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={studentForm.email}
                  onChange={(e) => setStudentForm(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Input
                  placeholder="Phone"
                  value={studentForm.phone}
                  onChange={(e) => setStudentForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Button 
                  onClick={handleAddStudent}
                  disabled={loading === 'student'}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading === 'student' ? 'Adding...' : 'Add Student'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Add Client */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-20 flex flex-col gap-2 border-gray-600 text-gray-300 hover:bg-gray-700">
                <Building className="w-6 h-6" />
                <span className="text-sm">Add Client</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Client</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Company Name"
                  value={clientForm.name}
                  onChange={(e) => setClientForm(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Input
                  placeholder="Contact Person"
                  value={clientForm.contact_person}
                  onChange={(e) => setClientForm(prev => ({ ...prev, contact_person: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={clientForm.email}
                  onChange={(e) => setClientForm(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Input
                  placeholder="Phone"
                  value={clientForm.phone}
                  onChange={(e) => setClientForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Input
                  placeholder="Industry"
                  value={clientForm.industry}
                  onChange={(e) => setClientForm(prev => ({ ...prev, industry: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Button 
                  onClick={handleAddClient}
                  disabled={loading === 'client'}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading === 'client' ? 'Adding...' : 'Add Client'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Create Project */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-20 flex flex-col gap-2 border-gray-600 text-gray-300 hover:bg-gray-700">
                <Briefcase className="w-6 h-6" />
                <span className="text-sm">Create Project</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Project Title"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Textarea
                  placeholder="Description"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Input
                  placeholder="Budget (KES)"
                  type="number"
                  value={projectForm.budget}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, budget: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Select value={projectForm.status} onValueChange={(value: typeof projectForm.status) => setProjectForm(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleCreateProject}
                  disabled={loading === 'project'}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading === 'project' ? 'Creating...' : 'Create Project'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Create Course */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-20 flex flex-col gap-2 border-gray-600 text-gray-300 hover:bg-gray-700">
                <BookOpen className="w-6 h-6" />
                <span className="text-sm">New Course</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Course</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Course Title"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Textarea
                  placeholder="Description"
                  value={courseForm.description}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Input
                  placeholder="Duration (hours)"
                  type="number"
                  value={courseForm.duration_hours}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, duration_hours: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Input
                  placeholder="Price (KES)"
                  type="number"
                  value={courseForm.price}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, price: e.target.value }))}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Select value={courseForm.status} onValueChange={(value: typeof courseForm.status) => setCourseForm(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleCreateCourse}
                  disabled={loading === 'course'}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading === 'course' ? 'Creating...' : 'Create Course'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminQuickActions;
