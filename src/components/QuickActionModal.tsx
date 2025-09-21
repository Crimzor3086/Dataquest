import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: 'student' | 'client' | 'project' | 'course' | 'report' | null;
}

const QuickActionModal: React.FC<QuickActionModalProps> = ({ isOpen, onClose, actionType }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      switch (actionType) {
        case 'student':
          const { error: enrollmentError } = await supabase
            .from('enrollments')
            .insert({
              student_id: formData.studentId,
              course_id: formData.courseId,
              status: 'active'
            });
          if (enrollmentError) throw enrollmentError;
          toast.success('Student enrolled successfully!');
          break;

        case 'client':
          const { error: clientError } = await supabase
            .from('clients')
            .insert({
              name: formData.name,
              contact_person: formData.contactPerson,
              email: formData.email,
              phone: formData.phone,
              industry: formData.industry,
              status: 'prospect'
            });
          if (clientError) throw clientError;
          toast.success('Client added successfully!');
          break;

        case 'project':
          const { error: projectError } = await supabase
            .from('projects')
            .insert({
              title: formData.title,
              description: formData.description,
              client_id: formData.clientId,
              budget: parseFloat(formData.budget),
              status: 'planning'
            });
          if (projectError) throw projectError;
          toast.success('Project created successfully!');
          break;

        case 'course':
          const { error: courseError } = await supabase
            .from('courses')
            .insert({
              title: formData.title,
              description: formData.description,
              content: formData.content,
              price: formData.price ? parseFloat(formData.price) : null,
              duration_hours: null,
              duration_weeks: formData.durationWeeks ? parseInt(formData.durationWeeks) : null,
              status: 'draft',
              mode_of_learning: formData.modeOfLearning || null,
              start_date: formData.startDate || null,
            });
          if (courseError) throw courseError;
          toast.success('Course created successfully!');
          break;
        case 'report':
          // Generate a simple analytics report
          const { data: reportData } = await supabase
            .from('analytics_events')
            .insert({
              event_type: 'report_generated',
              event_data: { type: formData.reportType, generated_at: new Date().toISOString() }
            });
          toast.success('Report generated successfully!');
          break;
      }
      onClose();
      setFormData({});
    } catch (error: any) {
      toast.error('Operation failed. Please try again.');
      console.error('Action error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    switch (actionType) {
      case 'student':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="studentId" className="text-gray-300">Student ID</Label>
              <Input
                id="studentId"
                value={formData.studentId || ''}
                onChange={(e) => handleInputChange('studentId', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter student UUID"
                required
              />
            </div>
            <div>
              <Label htmlFor="courseId" className="text-gray-300">Course ID</Label>
              <Input
                id="courseId"
                value={formData.courseId || ''}
                onChange={(e) => handleInputChange('courseId', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter course UUID"
                required
              />
            </div>
          </div>
        );

      case 'client':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-300">Company Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="contactPerson" className="text-gray-300">Contact Person</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson || ''}
                onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-gray-300">Phone</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="industry" className="text-gray-300">Industry</Label>
              <Input
                id="industry"
                value={formData.industry || ''}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
        );

      case 'project':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-gray-300">Project Title</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-gray-300">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="clientId" className="text-gray-300">Client ID</Label>
              <Input
                id="clientId"
                value={formData.clientId || ''}
                onChange={(e) => handleInputChange('clientId', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter client UUID"
              />
            </div>
            <div>
              <Label htmlFor="budget" className="text-gray-300">Budget (KES)</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget || ''}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
        );

      case 'course':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-gray-300">Course Title</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-gray-300">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="content" className="text-gray-300">Course Content</Label>
              <Textarea
                id="content"
                value={formData.content || ''}
                onChange={(e) => handleInputChange('content', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price" className="text-gray-300">Price (KES)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="durationWeeks" className="text-gray-300">Duration (Weeks)</Label>
                <Input
                  id="durationWeeks"
                  type="number"
                  value={formData.durationWeeks || ''}
                  onChange={(e) => handleInputChange('durationWeeks', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="modeOfLearning" className="text-gray-300">Mode of Learning</Label>
              <Select onValueChange={(value) => handleInputChange('modeOfLearning', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="in_person">In-person</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="live">Live Session</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="startDate" className="text-gray-300">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate || ''}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
        );

      case 'report':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="reportType" className="text-gray-300">Report Type</Label>
              <Select onValueChange={(value) => handleInputChange('reportType', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="analytics">Analytics Report</SelectItem>
                  <SelectItem value="financial">Financial Report</SelectItem>
                  <SelectItem value="student-progress">Student Progress Report</SelectItem>
                  <SelectItem value="project-status">Project Status Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (actionType) {
      case 'student': return 'Add Student Enrollment';
      case 'client': return 'Add New Client';
      case 'project': return 'Create New Project';
      case 'course': return 'Create New Course';
      case 'report': return 'Generate Report';
      default: return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderForm()}
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Processing...' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuickActionModal;
