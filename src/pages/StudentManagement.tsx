
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import LoadingFallback from '@/components/LoadingFallback';
import { StudentDetailModal } from '@/components/student/StudentDetailModal';
import { StudentActionsModal } from '@/components/student/StudentActionsModal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Plus, Filter, MoreVertical, Users, BookOpen, Award, Clock, UserPlus, Edit, Trash2, Eye, Settings, TrendingUp, Calendar, Bell } from 'lucide-react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStudents, useStudentStats } from '@/hooks/useStudentManagement';

const StudentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const queryClient = useQueryClient();

  // Use the comprehensive hooks
  const { data: students = [], isLoading, error } = useStudents();
  const { data: stats } = useStudentStats();

  // Fetch courses for enrollment
  const { data: courses = [] } = useQuery({
    queryKey: ['courses-for-enrollment'],
    queryFn: async () => {
      const { data, error } = await supabase.from('courses').select('*').eq('status', 'published');
      if (error) throw error;
      return data || [];
    }
  });

  // Enroll student in course
  const enrollStudent = useMutation({
    mutationFn: async ({ studentId, courseId }: { studentId: string; courseId: string }) => {
      const { error } = await supabase.from('enrollments').insert({
        student_id: studentId,
        course_id: courseId,
        status: 'active',
        enrolled_at: new Date().toISOString(),
        progress: 0
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setIsEnrollModalOpen(false);
      toast.success('Student enrolled successfully!');
    }
  });

  // Add new student
  const addStudent = useMutation({
    mutationFn: async (studentData: { first_name: string; last_name: string; email: string; phone?: string }) => {
      const { error } = await supabase.from('profiles').insert({
        first_name: studentData.first_name,
        last_name: studentData.last_name,
        email: studentData.email,
        phone: studentData.phone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast.success('Student added successfully!');
    }
  });

  // Update student information
  const updateStudent = useMutation({
    mutationFn: async ({ studentId, updates }: { studentId: string; updates: any }) => {
      const { error } = await supabase.from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', studentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Student information updated successfully!');
    }
  });

  // Delete student
  const deleteStudent = useMutation({
    mutationFn: async (studentId: string) => {
      // First delete enrollments
      await supabase.from('enrollments').delete().eq('student_id', studentId);
      // Then delete the student profile
      const { error } = await supabase.from('profiles').delete().eq('id', studentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast.success('Student deleted successfully!');
    }
  });

  // Update student progress
  const updateProgress = useMutation({
    mutationFn: async ({ enrollmentId, progress }: { enrollmentId: string; progress: number }) => {
      const { error } = await supabase.from('enrollments')
        .update({ progress, completed_at: progress === 100 ? new Date().toISOString() : null })
        .eq('id', enrollmentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast.success('Progress updated successfully!');
    }
  });

  // Enhanced statistics using the new stats hook
  const statsCards = stats ? [
    { title: 'Total Students', value: stats.totalStudents.toString(), icon: Users, color: 'text-blue-400' },
    { title: 'Active Enrollments', value: stats.activeEnrollments.toString(), icon: BookOpen, color: 'text-green-400' },
    { title: 'Completed Courses', value: stats.completedCourses.toString(), icon: Award, color: 'text-purple-400' },
    { title: 'Avg. Grade', value: `${stats.averageGrade}%`, icon: TrendingUp, color: 'text-orange-400' },
    { title: 'Attendance Rate', value: `${stats.attendanceRate}%`, icon: Calendar, color: 'text-cyan-400' },
    { title: 'Pending Assignments', value: stats.pendingAssignments.toString(), icon: Clock, color: 'text-red-400' }
  ] : [];

  if (error) {
    toast.error('Failed to load student data');
  }

  const statusColors = {
    'Active': 'bg-green-500',
    'Completed': 'bg-blue-500',
    'Inactive': 'bg-red-500'
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || student.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return <LoadingFallback message="Loading students..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      <Navigation />
      <WhatsAppButton />
      
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Student Management</h1>
            <p className="text-blue-200">Manage student enrollments, track progress, and monitor course completion</p>
          </div>

          {/* Enhanced Stats Cards with 6 metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
            {statsCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="bg-blue-800/50 border-blue-700 hover:bg-blue-800/70 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-300 text-sm">{stat.title}</p>
                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                      </div>
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Controls */}
          <Card className="bg-blue-800/50 border-blue-700 mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
                    <Input
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-blue-700 border-blue-600 text-white placeholder-blue-300"
                    />
                  </div>
                  <div className="flex gap-2">
                    {['All', 'Active', 'Completed', 'Inactive'].map((status) => (
                      <Button
                        key={status}
                        variant={filterStatus === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterStatus(status)}
                        className={filterStatus === status 
                          ? "bg-blue-600 hover:bg-blue-700" 
                          : "border-blue-600 text-blue-200 hover:bg-blue-700"
                        }
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                <Button 
                    className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setSelectedStudent(null);
                    setIsEnrollModalOpen(true);
                  }}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                    Add Student
                  </Button>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      setSelectedStudent({ id: 'enroll' }); // Set a dummy student to trigger enrollment modal
                      setIsEnrollModalOpen(true);
                    }}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Enroll in Course
                </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Students List */}
          <Card className="bg-blue-800/50 border-blue-700">
            <CardHeader>
              <CardTitle className="text-white">Students ({filteredStudents.length})</CardTitle>
              <CardDescription className="text-blue-200">
                Manage and monitor student progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 bg-blue-700/30 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback className="bg-blue-600 text-white">
                          {student.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-white font-semibold">{student.name}</h3>
                        <p className="text-blue-300 text-sm">{student.email}</p>
                        <p className="text-blue-400 text-sm">{student.course}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-blue-300 text-xs">Progress</p>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-blue-900 rounded-full h-2">
                            <div 
                              className="bg-blue-400 h-2 rounded-full" 
                              style={{ width: `${student.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-blue-400 text-sm">{student.progress}%</span>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-blue-300 text-xs">Status</p>
                        <Badge className={`${statusColors[student.status as keyof typeof statusColors]} text-white border-0`}>
                          {student.status}
                        </Badge>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-blue-300 text-xs">Last Activity</p>
                        <p className="text-blue-400 text-sm">{student.lastActivity}</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-400 hover:bg-blue-700"
                          onClick={() => {
                            setSelectedStudent(student);
                            setIsDetailModalOpen(true);
                          }}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-400 hover:bg-blue-700"
                          onClick={() => {
                            setSelectedStudent(student);
                            setIsEnrollModalOpen(true);
                          }}
                          title="Enroll in Course"
                        >
                          <UserPlus className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-400 hover:bg-blue-700"
                          onClick={() => {
                            setSelectedStudent(student);
                            setIsActionsModalOpen(true);
                          }}
                          title="Student Actions"
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Add Student Modal */}
      <Dialog open={isEnrollModalOpen && !selectedStudent} onOpenChange={setIsEnrollModalOpen}>
        <DialogContent className="bg-blue-900 border-blue-700 text-white">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const studentData = {
              first_name: formData.get('firstName') as string,
              last_name: formData.get('lastName') as string,
              email: formData.get('email') as string,
              phone: formData.get('phone') as string
            };
            addStudent.mutate(studentData);
            setIsEnrollModalOpen(false);
          }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  required
                  className="bg-blue-800 border-blue-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  required
                  className="bg-blue-800 border-blue-600 text-white"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="bg-blue-800 border-blue-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                className="bg-blue-800 border-blue-600 text-white"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEnrollModalOpen(false)}
                className="border-blue-600 text-blue-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
                disabled={addStudent.isPending}
              >
                {addStudent.isPending ? 'Adding...' : 'Add Student'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Course Enrollment Modal */}
      <Dialog open={isEnrollModalOpen && selectedStudent && selectedStudent.id === 'enroll'} onOpenChange={setIsEnrollModalOpen}>
        <DialogContent className="bg-blue-900 border-blue-700 text-white">
          <DialogHeader>
            <DialogTitle>Enroll Student in Course</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="student">Select Student</Label>
              <Select onValueChange={(value) => {
                const student = students.find(s => s.id === value);
                if (student) {
                  enrollStudent.mutate({ 
                    studentId: student.id, 
                    courseId: selectedStudent.courseId 
                  });
                }
              }}>
                <SelectTrigger className="bg-blue-800 border-blue-600 text-white">
                  <SelectValue placeholder="Choose a student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="course">Select Course</Label>
              <Select onValueChange={(value) => {
                setSelectedStudent({ ...selectedStudent, courseId: value });
              }}>
                <SelectTrigger className="bg-blue-800 border-blue-600 text-white">
                  <SelectValue placeholder="Choose a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsEnrollModalOpen(false)}
                className="border-blue-600 text-blue-200"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Individual Student Enrollment Modal */}
      <Dialog open={isEnrollModalOpen && selectedStudent && selectedStudent.id !== 'enroll'} onOpenChange={setIsEnrollModalOpen}>
        <DialogContent className="bg-blue-900 border-blue-700 text-white">
          <DialogHeader>
            <DialogTitle>
              {selectedStudent ? `Enroll ${selectedStudent.name}` : 'Enroll Student in Course'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {!selectedStudent && (
              <div>
                <Label htmlFor="student">Select Student</Label>
                <Select onValueChange={(value) => {
                  const student = students.find(s => s.id === value);
                  setSelectedStudent(student);
                }}>
                  <SelectTrigger className="bg-blue-800 border-blue-600 text-white">
                    <SelectValue placeholder="Choose a student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label htmlFor="course">Select Course</Label>
              <Select onValueChange={(value) => {
                if (selectedStudent) {
                  enrollStudent.mutate({ 
                    studentId: selectedStudent.id, 
                    courseId: value 
                  });
                }
              }}>
                <SelectTrigger className="bg-blue-800 border-blue-600 text-white">
                  <SelectValue placeholder="Choose a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>
        
      {/* Student Detail Modal */}
      <StudentDetailModal
        student={selectedStudent}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedStudent(null);
        }}
      />

      {/* Student Actions Modal */}
      <StudentActionsModal
        student={selectedStudent}
        isOpen={isActionsModalOpen}
        onClose={() => {
          setIsActionsModalOpen(false);
          setSelectedStudent(null);
        }}
      />

      <Footer />
    </div>
  );
};

export default StudentManagement;
