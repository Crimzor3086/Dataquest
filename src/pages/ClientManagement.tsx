
import Navigation from '@/components/Navigation';
import LoadingFallback from '@/components/LoadingFallback';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Briefcase, ChartBar, UserCog, Plus, Edit, Trash2, Eye, Phone, Mail, Calendar } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useState } from 'react';

const ClientManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const queryClient = useQueryClient();

  // Fetch real clients data
  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch real projects data
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          clients(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Add new client
  const addClient = useMutation({
    mutationFn: async (clientData: any) => {
      const { error } = await supabase.from('clients').insert({
        ...clientData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setIsAddClientModalOpen(false);
      toast.success('Client added successfully!');
    }
  });

  // Update client
  const updateClient = useMutation({
    mutationFn: async ({ clientId, updates }: { clientId: string; updates: any }) => {
      const { error } = await supabase.from('clients')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', clientId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setIsEditClientModalOpen(false);
      toast.success('Client updated successfully!');
    }
  });

  // Delete client
  const deleteClient = useMutation({
    mutationFn: async (clientId: string) => {
      // First delete related projects
      await supabase.from('projects').delete().eq('client_id', clientId);
      // Then delete the client
      const { error } = await supabase.from('clients').delete().eq('id', clientId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast.success('Client deleted successfully!');
    }
  });

  // Add new project
  const addProject = useMutation({
    mutationFn: async (projectData: any) => {
      const { error } = await supabase.from('projects').insert({
        ...projectData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setIsAddProjectModalOpen(false);
      toast.success('Project added successfully!');
    }
  });

  // Update project
  const updateProject = useMutation({
    mutationFn: async ({ projectId, updates }: { projectId: string; updates: any }) => {
      const { error } = await supabase.from('projects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', projectId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project updated successfully!');
    }
  });

  // Delete project
  const deleteProject = useMutation({
    mutationFn: async (projectId: string) => {
      const { error } = await supabase.from('projects').delete().eq('id', projectId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast.success('Project deleted successfully!');
    }
  });

  // Calculate real statistics
  const stats = {
    totalClients: clients.length,
    activeClients: clients.filter(c => c.status === 'active').length,
    activeProjects: projects.filter(p => p.status === 'in_progress').length,
    totalRevenue: projects.reduce((sum, p) => sum + (p.budget || 0), 0)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-600';
      case 'Completed': return 'bg-blue-600';
      case 'Inactive': return 'bg-red-600';
      case 'Prospect': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-600';
      case 'Completed': return 'bg-green-600';
      case 'Planning': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navigation />
      
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl font-bold text-white mb-6">Client Management System</h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive platform for managing client relationships, tracking projects, 
              and analyzing client satisfaction and business performance.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center">
                <UserCog className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white mb-1">{stats.totalClients}</div>
                <div className="text-gray-400">Total Clients</div>
                <div className="text-green-400 text-sm">Live Data</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center">
                <Briefcase className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white mb-1">{stats.activeProjects}</div>
                <div className="text-gray-400">Active Projects</div>
                <div className="text-blue-400 text-sm">Live Data</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center">
                <ChartBar className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white mb-1">KES {stats.totalRevenue.toLocaleString()}</div>
                <div className="text-gray-400">Total Budget</div>
                <div className="text-green-400 text-sm">Live Data</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white mb-1">{stats.activeClients}</div>
                <div className="text-gray-400">Active Clients</div>
                <div className="text-green-400 text-sm">Live Data</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="clients" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
              <TabsTrigger value="clients" className="data-[state=active]:bg-blue-600">Client Directory</TabsTrigger>
              <TabsTrigger value="projects" className="data-[state=active]:bg-blue-600">Projects</TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600">Analytics</TabsTrigger>
            </TabsList>

            {/* Clients Tab */}
            <TabsContent value="clients" className="space-y-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-white">Client Directory</CardTitle>
                      <CardDescription className="text-gray-400">Manage all client relationships</CardDescription>
                    </div>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => setIsAddClientModalOpen(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Client
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <Input 
                      placeholder="Search clients by name, industry, or contact..."
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    {clients.map((client) => (
                      <Card key={client.id} className="bg-gray-700/50 border-gray-600">
                        <CardContent className="p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                            <div className="lg:col-span-3">
                              <h3 className="text-white font-semibold">{client.name}</h3>
                              <p className="text-gray-400 text-sm">{client.contact_person}</p>
                              <p className="text-blue-400 text-xs">{client.industry}</p>
                            </div>
                            
                            <div className="lg:col-span-2">
                              <Badge className={`${getStatusColor(client.status)} text-white`}>
                                {client.status}
                              </Badge>
                            </div>
                            
                            <div className="lg:col-span-2 text-center">
                              <div className="text-white font-semibold">0</div>
                              <div className="text-gray-400 text-xs">Total Projects</div>
                              <div className="text-blue-400 text-xs">0 active</div>
                            </div>
                            
                            <div className="lg:col-span-2 text-center">
                              <div className="text-white font-semibold">KES 0</div>
                              <div className="text-gray-400 text-xs">Total Value</div>
                            </div>
                            
                            <div className="lg:col-span-2 text-center">
                              <div className="text-gray-400 text-xs">Not rated yet</div>
                            </div>
                            
                            <div className="lg:col-span-1">
                              <div className="flex space-x-1">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="border-gray-600 text-gray-300 hover:bg-gray-600"
                                  onClick={() => {
                                    setSelectedClient(client);
                                    setIsEditClientModalOpen(true);
                                  }}
                                >
                                  <Eye className="w-3 h-3" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="border-gray-600 text-gray-300 hover:bg-gray-600"
                                  onClick={() => {
                                    setSelectedClient(client);
                                    setIsEditClientModalOpen(true);
                                  }}
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="border-red-600 text-red-300 hover:bg-red-600"
                                  onClick={() => {
                                    if (confirm('Are you sure you want to delete this client?')) {
                                      deleteClient.mutate(client.id);
                                    }
                                  }}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 text-sm text-gray-400 flex flex-wrap gap-x-4 gap-y-2">
                            <span>Email: {client.email}</span>
                            <span>Phone: {client.phone}</span>
                            <span>Last Contact: {new Date(client.updated_at).toLocaleDateString()}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="mt-6 flex justify-center">
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      Load More Clients
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-white">Project Management</CardTitle>
                      <CardDescription className="text-gray-400">Monitor and manage client projects</CardDescription>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700">Create New Project</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <Card key={project.id} className="bg-gray-700/50 border-gray-600">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-white font-semibold text-lg">{project.title}</h3>
                              <p className="text-blue-400">Client: {project.clients?.name}</p>
                            </div>
                            <Badge className={`${getProjectStatusColor(project.status)} text-white`}>
                              {project.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                            <div>
                              <div className="text-gray-400 text-xs">Budget</div>
                              <div className="text-white font-semibold">KES {project.budget?.toLocaleString()}</div>
                            </div>
                            <div>
                              <div className="text-gray-400 text-xs">Team Size</div>
                              <div className="text-white font-semibold">N/A</div>
                            </div>
                            <div>
                              <div className="text-gray-400 text-xs">Start Date</div>
                              <div className="text-white font-semibold">{new Date(project.start_date).toLocaleDateString()}</div>
                            </div>
                            <div>
                              <div className="text-gray-400 text-xs">Deadline</div>
                              <div className="text-white font-semibold">{project.end_date ? new Date(project.end_date).toLocaleDateString() : 'TBD'}</div>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-400">Completion</span>
                              <span className="text-white">{project.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-600 rounded-full h-2">
                              <div 
                                className={`${
                                  project.status === 'completed'
                                    ? 'bg-green-600'
                                    : 'bg-blue-600'
                                } h-2 rounded-full`}
                                style={{width: `${project.progress}%`}}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-600">
                              View Details
                            </Button>
                            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-600">
                              Update Status
                            </Button>
                            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-600">
                              Manage Team
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Revenue by Industry</CardTitle>
                    <CardDescription className="text-gray-400">Distribution of revenue across client industries</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { industry: 'Retail', revenue: 850000, percentage: 35 },
                        { industry: 'Healthcare', revenue: 580000, percentage: 24 },
                        { industry: 'Finance', revenue: 480000, percentage: 20 },
                        { industry: 'Manufacturing', revenue: 320000, percentage: 13 },
                        { industry: 'Services', revenue: 190000, percentage: 8 }
                      ].map((data, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-300">{data.industry}</span>
                            <span className="text-gray-300">${(data.revenue / 1000).toFixed(0)}K</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{width: `${data.percentage}%`}}
                            ></div>
                          </div>
                          <div className="text-right text-xs text-gray-400 mt-1">{data.percentage}%</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Client Satisfaction</CardTitle>
                    <CardDescription className="text-gray-400">Average satisfaction ratings by service category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { service: 'Data Analytics', satisfaction: 97 },
                        { service: 'Machine Learning', satisfaction: 94 },
                        { service: 'Business Intelligence', satisfaction: 98 },
                        { service: 'Data Visualization', satisfaction: 95 },
                        { service: 'Consulting Services', satisfaction: 96 }
                      ].map((data, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-300">{data.service}</span>
                            <span className="text-gray-300">{data.satisfaction}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{width: `${data.satisfaction}%`}}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Project Performance Metrics</CardTitle>
                  <CardDescription className="text-gray-400">Key performance indicators for client projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400 mb-2">94%</div>
                      <div className="text-gray-400">Project Success Rate</div>
                    </div>
                    <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                      <div className="text-2xl font-bold text-green-400 mb-2">91%</div>
                      <div className="text-gray-400">On-Time Delivery</div>
                    </div>
                    <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                      <div className="text-2xl font-bold text-purple-400 mb-2">87%</div>
                      <div className="text-gray-400">Budget Adherence</div>
                    </div>
                    <div className="text-center p-4 bg-gray-700/30 rounded-lg">
                      <div className="text-2xl font-bold text-orange-400 mb-2">85%</div>
                      <div className="text-gray-400">Client Retention</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Client Growth Trajectory</CardTitle>
                  <CardDescription className="text-gray-400">Quarterly client acquisition and retention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      { quarter: 'Q1 2024', newClients: 12, retainedClients: 73, churnedClients: 4 },
                      { quarter: 'Q2 2024', newClients: 15, retainedClients: 81, churnedClients: 3 },
                      { quarter: 'Q3 2024 (Projected)', newClients: 18, retainedClients: 85, churnedClients: 2 },
                      { quarter: 'Q4 2024 (Projected)', newClients: 20, retainedClients: 89, churnedClients: 3 }
                    ].map((data, index) => (
                      <div key={index}>
                        <h4 className="text-white font-semibold mb-2">{data.quarter}</h4>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="p-3 bg-blue-600/20 rounded-lg">
                            <div className="text-xl font-bold text-blue-400">{data.newClients}</div>
                            <div className="text-gray-400 text-xs">New Clients</div>
                          </div>
                          <div className="p-3 bg-green-600/20 rounded-lg">
                            <div className="text-xl font-bold text-green-400">{data.retainedClients}</div>
                            <div className="text-gray-400 text-xs">Retained</div>
                          </div>
                          <div className="p-3 bg-red-600/20 rounded-lg">
                            <div className="text-xl font-bold text-red-400">{data.churnedClients}</div>
                            <div className="text-gray-400 text-xs">Churned</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Add Client Modal */}
      <Dialog open={isAddClientModalOpen} onOpenChange={setIsAddClientModalOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const clientData = {
              name: formData.get('name') as string,
              contact_person: formData.get('contactPerson') as string,
              email: formData.get('email') as string,
              phone: formData.get('phone') as string,
              industry: formData.get('industry') as string,
              status: formData.get('status') as string,
              address: formData.get('address') as string,
              notes: formData.get('notes') as string
            };
            addClient.mutate(clientData);
          }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  name="contactPerson"
                  required
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select name="industry" required>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select name="status" required>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Prospect">Prospect</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddClientModalOpen(false)}
                className="border-gray-600 text-gray-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={addClient.isPending}
              >
                {addClient.isPending ? 'Adding...' : 'Add Client'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Client Modal */}
      <Dialog open={isEditClientModalOpen} onOpenChange={setIsEditClientModalOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const updates = {
                name: formData.get('name') as string,
                contact_person: formData.get('contactPerson') as string,
                email: formData.get('email') as string,
                phone: formData.get('phone') as string,
                industry: formData.get('industry') as string,
                status: formData.get('status') as string,
                address: formData.get('address') as string,
                notes: formData.get('notes') as string
              };
              updateClient.mutate({ clientId: selectedClient.id, updates });
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Company Name</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={selectedClient.name}
                    required
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    name="contactPerson"
                    defaultValue={selectedClient.contact_person}
                    required
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={selectedClient.email}
                    required
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    defaultValue={selectedClient.phone}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select name="industry" defaultValue={selectedClient.industry} required>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue={selectedClient.status} required>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Prospect">Prospect</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  defaultValue={selectedClient.address}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  defaultValue={selectedClient.notes}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditClientModalOpen(false)}
                  className="border-gray-600 text-gray-200"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={updateClient.isPending}
                >
                  {updateClient.isPending ? 'Updating...' : 'Update Client'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientManagement;
