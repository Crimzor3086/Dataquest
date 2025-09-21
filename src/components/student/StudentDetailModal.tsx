import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  BookOpen, 
  Calendar, 
  Bell, 
  GraduationCap, 
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Edit,
  Save
} from 'lucide-react';
import { 
  useStudentProgress, 
  useStudentAssignments, 
  useStudentAttendance, 
  useStudentNotifications,
  useStudentMutations 
} from '@/hooks/useStudentManagement';

interface StudentDetailModalProps {
  student: any;
  isOpen: boolean;
  onClose: () => void;
}

export function StudentDetailModal({ student, isOpen, onClose }: StudentDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(student?.profile || {});
  
  const { data: progress = [] } = useStudentProgress(student?.id, student?.courseId);
  const { data: assignments = [] } = useStudentAssignments(student?.id, student?.courseId);
  const { data: attendance = [] } = useStudentAttendance(student?.id, student?.courseId);
  const { data: notifications = [] } = useStudentNotifications(student?.id);
  
  const { updateStudentProfile, updateStudentProgress, updateAttendance, gradeAssignment, createNotification } = useStudentMutations();

  if (!student) return null;

  const handleSaveProfile = () => {
    updateStudentProfile.mutate({
      studentId: student.id,
      updates: editedProfile
    });
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'present': case 'completed': case 'submitted':
        return 'bg-green-500';
      case 'inactive': case 'absent': case 'pending':
        return 'bg-red-500';
      case 'late': case 'graded':
        return 'bg-yellow-500';
      case 'excused':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const overallProgress = progress.length > 0 
    ? Math.round(progress.reduce((sum, p) => sum + p.completion_percentage, 0) / progress.length) 
    : student.progress;

  const attendanceRate = attendance.length > 0
    ? Math.round((attendance.filter(a => a.status === 'present').length / attendance.length) * 100)
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-blue-900 border-blue-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-blue-600 text-white">
                {student.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{student.name}</h2>
              <p className="text-blue-300">{student.email}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-blue-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
              <User className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-blue-600">
              <BookOpen className="w-4 h-4 mr-2" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="assignments" className="data-[state=active]:bg-blue-600">
              <GraduationCap className="w-4 h-4 mr-2" />
              Assignments
            </TabsTrigger>
            <TabsTrigger value="attendance" className="data-[state=active]:bg-blue-600">
              <Calendar className="w-4 h-4 mr-2" />
              Attendance
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-600">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Student Profile */}
              <Card className="bg-blue-800/50 border-blue-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white">Profile Information</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                    className="text-blue-400 hover:bg-blue-700"
                  >
                    {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <>
                      <div>
                        <Label>First Name</Label>
                        <Input
                          value={editedProfile.first_name || ''}
                          onChange={(e) => setEditedProfile({...editedProfile, first_name: e.target.value})}
                          className="bg-blue-700 border-blue-600 text-white"
                        />
                      </div>
                      <div>
                        <Label>Last Name</Label>
                        <Input
                          value={editedProfile.last_name || ''}
                          onChange={(e) => setEditedProfile({...editedProfile, last_name: e.target.value})}
                          className="bg-blue-700 border-blue-600 text-white"
                        />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input
                          value={editedProfile.phone || ''}
                          onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                          className="bg-blue-700 border-blue-600 text-white"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <Label className="text-blue-300">Email</Label>
                        <p className="text-white">{student.email}</p>
                      </div>
                      <div>
                        <Label className="text-blue-300">Phone</Label>
                        <p className="text-white">{student.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <Label className="text-blue-300">Enrolled Date</Label>
                        <p className="text-white">{student.enrolledDate}</p>
                      </div>
                      <div>
                        <Label className="text-blue-300">Last Activity</Label>
                        <p className="text-white">{student.lastActivity}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Course Information */}
              <Card className="bg-blue-800/50 border-blue-700">
                <CardHeader>
                  <CardTitle className="text-white">Current Course</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-blue-300">Course Title</Label>
                    <p className="text-white font-semibold">{student.course}</p>
                  </div>
                  <div>
                    <Label className="text-blue-300">Status</Label>
                    <Badge className={`${getStatusColor(student.status)} text-white border-0`}>
                      {student.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-blue-300">Overall Progress</Label>
                    <div className="flex items-center space-x-2">
                      <Progress value={overallProgress} className="flex-1" />
                      <span className="text-blue-400 text-sm">{overallProgress}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-blue-800/50 border-blue-700">
                <CardHeader>
                  <CardTitle className="text-white">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-blue-300">Attendance Rate</span>
                    <span className="text-white font-semibold">{attendanceRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-300">Assignments</span>
                    <span className="text-white font-semibold">{assignments.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-300">Notifications</span>
                    <span className="text-white font-semibold">
                      {notifications.filter(n => !n.is_read).length} unread
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <div className="grid gap-4">
              {progress.length > 0 ? (
                progress.map((item, index) => (
                  <Card key={index} className="bg-blue-800/50 border-blue-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-semibold">{item.module_name}</h3>
                        <Badge className="bg-blue-600 text-white">
                          {item.completion_percentage}%
                        </Badge>
                      </div>
                      <Progress value={item.completion_percentage} className="mb-2" />
                      <div className="flex justify-between text-sm text-blue-300">
                        <span>Time spent: {Math.round(item.time_spent_minutes / 60)}h {item.time_spent_minutes % 60}m</span>
                        <span>Last accessed: {new Date(item.last_accessed).toLocaleDateString()}</span>
                      </div>
                      {item.notes && (
                        <p className="text-blue-200 text-sm mt-2">{item.notes}</p>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-blue-800/50 border-blue-700">
                  <CardContent className="p-8 text-center">
                    <BookOpen className="w-12 h-12 mx-auto text-blue-400 mb-4" />
                    <p className="text-blue-300">No detailed progress data available</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-4">
            <div className="grid gap-4">
              {assignments.length > 0 ? (
                assignments.map((assignment, index) => (
                  <Card key={index} className="bg-blue-800/50 border-blue-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-semibold">{assignment.assignment_title}</h3>
                        <Badge className={`${getStatusColor(assignment.status)} text-white border-0`}>
                          {assignment.status}
                        </Badge>
                      </div>
                      {assignment.assignment_description && (
                        <p className="text-blue-300 text-sm mb-2">{assignment.assignment_description}</p>
                      )}
                      <div className="flex justify-between text-sm text-blue-300">
                        <span>Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'No due date'}</span>
                        {assignment.grade && (
                          <span className="text-green-400 font-semibold">Grade: {assignment.grade}%</span>
                        )}
                      </div>
                      {assignment.feedback && (
                        <div className="mt-2 p-2 bg-blue-700/50 rounded">
                          <p className="text-blue-200 text-sm"><strong>Feedback:</strong> {assignment.feedback}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-blue-800/50 border-blue-700">
                  <CardContent className="p-8 text-center">
                    <GraduationCap className="w-12 h-12 mx-auto text-blue-400 mb-4" />
                    <p className="text-blue-300">No assignments found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            <div className="grid gap-4">
              {attendance.length > 0 ? (
                attendance.map((record, index) => (
                  <Card key={index} className="bg-blue-800/50 border-blue-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-semibold">{record.session_title}</h3>
                          <p className="text-blue-300 text-sm">
                            {new Date(record.session_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(record.status)} text-white border-0`}>
                            {record.status}
                          </Badge>
                          {record.status === 'present' && <CheckCircle className="w-4 h-4 text-green-400" />}
                          {record.status === 'absent' && <XCircle className="w-4 h-4 text-red-400" />}
                          {record.status === 'late' && <Clock className="w-4 h-4 text-yellow-400" />}
                          {record.status === 'excused' && <AlertTriangle className="w-4 h-4 text-blue-400" />}
                        </div>
                      </div>
                      {record.notes && (
                        <p className="text-blue-200 text-sm mt-2">{record.notes}</p>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-blue-800/50 border-blue-700">
                  <CardContent className="p-8 text-center">
                    <Calendar className="w-12 h-12 mx-auto text-blue-400 mb-4" />
                    <p className="text-blue-300">No attendance records found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <div className="grid gap-4">
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <Card key={index} className={`border-blue-700 ${notification.is_read ? 'bg-blue-800/30' : 'bg-blue-800/50'}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">{notification.title}</h3>
                          <p className="text-blue-300 text-sm mt-1">{notification.message}</p>
                          <p className="text-blue-400 text-xs mt-2">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(notification.type)} text-white border-0`}>
                            {notification.type}
                          </Badge>
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="bg-blue-800/50 border-blue-700">
                  <CardContent className="p-8 text-center">
                    <Bell className="w-12 h-12 mx-auto text-blue-400 mb-4" />
                    <p className="text-blue-300">No notifications found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}