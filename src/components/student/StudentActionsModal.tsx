import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, UserPlus, BookOpen, Calendar as CalendarLibIcon, Bell, Award } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useStudentMutations } from '@/hooks/useStudentManagement';
import { useCourses } from '@/hooks/useCourses';

interface StudentActionsModalProps {
  student: any;
  isOpen: boolean;
  onClose: () => void;
}

export function StudentActionsModal({ student, isOpen, onClose }: StudentActionsModalProps) {
  const [activeTab, setActiveTab] = useState('progress');
  
  // Progress form state
  const [progressForm, setProgressForm] = useState({
    moduleName: '',
    completionPercentage: 0,
    timeSpentMinutes: 0,
    notes: ''
  });

  // Attendance form state
  const [attendanceForm, setAttendanceForm] = useState({
    sessionDate: undefined as Date | undefined,
    sessionTitle: '',
    status: 'present' as 'present' | 'absent' | 'late' | 'excused',
    notes: ''
  });

  // Assignment form state
  const [assignmentForm, setAssignmentForm] = useState({
    assignmentId: '',
    grade: 0,
    feedback: ''
  });

  // Notification form state
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'warning' | 'success' | 'error',
    actionUrl: ''
  });

  const { data: courses = [] } = useCourses();
  const { 
    updateStudentProgress, 
    updateAttendance, 
    gradeAssignment, 
    createNotification 
  } = useStudentMutations();

  const handleProgressSubmit = () => {
    if (!student?.courseId || !progressForm.moduleName) return;
    
    updateStudentProgress.mutate({
      studentId: student.id,
      courseId: student.courseId,
      moduleName: progressForm.moduleName,
      completionPercentage: progressForm.completionPercentage,
      timeSpentMinutes: progressForm.timeSpentMinutes,
      notes: progressForm.notes
    });
    
    setProgressForm({
      moduleName: '',
      completionPercentage: 0,
      timeSpentMinutes: 0,
      notes: ''
    });
    onClose();
  };

  const handleAttendanceSubmit = () => {
    if (!student?.courseId || !attendanceForm.sessionDate || !attendanceForm.sessionTitle) return;
    
    updateAttendance.mutate({
      studentId: student.id,
      courseId: student.courseId,
      sessionDate: format(attendanceForm.sessionDate, 'yyyy-MM-dd'),
      sessionTitle: attendanceForm.sessionTitle,
      status: attendanceForm.status,
      notes: attendanceForm.notes
    });
    
    setAttendanceForm({
      sessionDate: undefined,
      sessionTitle: '',
      status: 'present',
      notes: ''
    });
    onClose();
  };

  const handleGradeSubmit = () => {
    if (!assignmentForm.assignmentId) return;
    
    gradeAssignment.mutate({
      assignmentId: assignmentForm.assignmentId,
      grade: assignmentForm.grade,
      feedback: assignmentForm.feedback
    });
    
    setAssignmentForm({
      assignmentId: '',
      grade: 0,
      feedback: ''
    });
    onClose();
  };

  const handleNotificationSubmit = () => {
    if (!notificationForm.title || !notificationForm.message) return;
    
    createNotification.mutate({
      studentId: student.id,
      title: notificationForm.title,
      message: notificationForm.message,
      type: notificationForm.type,
      actionUrl: notificationForm.actionUrl
    });
    
    setNotificationForm({
      title: '',
      message: '',
      type: 'info',
      actionUrl: ''
    });
    onClose();
  };

  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-blue-900 border-blue-700 text-white">
        <DialogHeader>
          <DialogTitle>Student Actions - {student.name}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-blue-800">
            <TabsTrigger value="progress" className="data-[state=active]:bg-blue-600">
              <BookOpen className="w-4 h-4 mr-2" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="attendance" className="data-[state=active]:bg-blue-600">
              <CalendarLibIcon className="w-4 h-4 mr-2" />
              Attendance
            </TabsTrigger>
            <TabsTrigger value="grade" className="data-[state=active]:bg-blue-600">
              <Award className="w-4 h-4 mr-2" />
              Grade
            </TabsTrigger>
            <TabsTrigger value="notify" className="data-[state=active]:bg-blue-600">
              <Bell className="w-4 h-4 mr-2" />
              Notify
            </TabsTrigger>
          </TabsList>

          <TabsContent value="progress" className="space-y-6">
            <Card className="bg-blue-800/50 border-blue-700">
              <CardHeader>
                <CardTitle className="text-white">Update Student Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="moduleName">Module/Topic Name</Label>
                  <Input
                    id="moduleName"
                    value={progressForm.moduleName}
                    onChange={(e) => setProgressForm({...progressForm, moduleName: e.target.value})}
                    placeholder="e.g., Data Analysis Fundamentals"
                    className="bg-blue-700 border-blue-600 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="completion">Completion Percentage</Label>
                  <Input
                    id="completion"
                    type="number"
                    min="0"
                    max="100"
                    value={progressForm.completionPercentage}
                    onChange={(e) => setProgressForm({...progressForm, completionPercentage: parseInt(e.target.value) || 0})}
                    className="bg-blue-700 border-blue-600 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="timeSpent">Time Spent (minutes)</Label>
                  <Input
                    id="timeSpent"
                    type="number"
                    min="0"
                    value={progressForm.timeSpentMinutes}
                    onChange={(e) => setProgressForm({...progressForm, timeSpentMinutes: parseInt(e.target.value) || 0})}
                    className="bg-blue-700 border-blue-600 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={progressForm.notes}
                    onChange={(e) => setProgressForm({...progressForm, notes: e.target.value})}
                    placeholder="Additional notes about progress..."
                    className="bg-blue-700 border-blue-600 text-white"
                  />
                </div>
                
                <Button 
                  onClick={handleProgressSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!progressForm.moduleName}
                >
                  Update Progress
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-6">
            <Card className="bg-blue-800/50 border-blue-700">
              <CardHeader>
                <CardTitle className="text-white">Mark Attendance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Session Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-blue-700 border-blue-600 text-white hover:bg-blue-600",
                          !attendanceForm.sessionDate && "text-blue-300"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {attendanceForm.sessionDate ? format(attendanceForm.sessionDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-blue-800 border-blue-600">
                      <Calendar
                        mode="single"
                        selected={attendanceForm.sessionDate}
                        onSelect={(date) => setAttendanceForm({...attendanceForm, sessionDate: date})}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <Label htmlFor="sessionTitle">Session Title</Label>
                  <Input
                    id="sessionTitle"
                    value={attendanceForm.sessionTitle}
                    onChange={(e) => setAttendanceForm({...attendanceForm, sessionTitle: e.target.value})}
                    placeholder="e.g., Week 1: Introduction to R"
                    className="bg-blue-700 border-blue-600 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="status">Attendance Status</Label>
                  <Select 
                    value={attendanceForm.status} 
                    onValueChange={(value: any) => setAttendanceForm({...attendanceForm, status: value})}
                  >
                    <SelectTrigger className="bg-blue-700 border-blue-600 text-white">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="present">Present</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                      <SelectItem value="excused">Excused</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="attendanceNotes">Notes</Label>
                  <Textarea
                    id="attendanceNotes"
                    value={attendanceForm.notes}
                    onChange={(e) => setAttendanceForm({...attendanceForm, notes: e.target.value})}
                    placeholder="Additional notes..."
                    className="bg-blue-700 border-blue-600 text-white"
                  />
                </div>
                
                <Button 
                  onClick={handleAttendanceSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!attendanceForm.sessionDate || !attendanceForm.sessionTitle}
                >
                  Mark Attendance
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grade" className="space-y-6">
            <Card className="bg-blue-800/50 border-blue-700">
              <CardHeader>
                <CardTitle className="text-white">Grade Assignment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="assignmentSelect">Assignment</Label>
                  <Select 
                    value={assignmentForm.assignmentId} 
                    onValueChange={(value) => setAssignmentForm({...assignmentForm, assignmentId: value})}
                  >
                    <SelectTrigger className="bg-blue-700 border-blue-600 text-white">
                      <SelectValue placeholder="Select assignment to grade" />
                    </SelectTrigger>
                      <SelectContent>
                        <SelectItem disabled value="no-assignments">No assignments available</SelectItem>
                      </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="grade">Grade (%)</Label>
                  <Input
                    id="grade"
                    type="number"
                    min="0"
                    max="100"
                    value={assignmentForm.grade}
                    onChange={(e) => setAssignmentForm({...assignmentForm, grade: parseFloat(e.target.value) || 0})}
                    className="bg-blue-700 border-blue-600 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="feedback">Feedback</Label>
                  <Textarea
                    id="feedback"
                    value={assignmentForm.feedback}
                    onChange={(e) => setAssignmentForm({...assignmentForm, feedback: e.target.value})}
                    placeholder="Provide feedback on the assignment..."
                    className="bg-blue-700 border-blue-600 text-white h-32"
                  />
                </div>
                
                <Button 
                  onClick={handleGradeSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!assignmentForm.assignmentId}
                >
                  Submit Grade
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notify" className="space-y-6">
            <Card className="bg-blue-800/50 border-blue-700">
              <CardHeader>
                <CardTitle className="text-white">Send Notification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="notificationTitle">Title</Label>
                  <Input
                    id="notificationTitle"
                    value={notificationForm.title}
                    onChange={(e) => setNotificationForm({...notificationForm, title: e.target.value})}
                    placeholder="Notification title"
                    className="bg-blue-700 border-blue-600 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="notificationType">Type</Label>
                  <Select 
                    value={notificationForm.type} 
                    onValueChange={(value: any) => setNotificationForm({...notificationForm, type: value})}
                  >
                    <SelectTrigger className="bg-blue-700 border-blue-600 text-white">
                      <SelectValue placeholder="Select notification type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="notificationMessage">Message</Label>
                  <Textarea
                    id="notificationMessage"
                    value={notificationForm.message}
                    onChange={(e) => setNotificationForm({...notificationForm, message: e.target.value})}
                    placeholder="Notification message"
                    className="bg-blue-700 border-blue-600 text-white h-32"
                  />
                </div>
                
                <div>
                  <Label htmlFor="actionUrl">Action URL (optional)</Label>
                  <Input
                    id="actionUrl"
                    value={notificationForm.actionUrl}
                    onChange={(e) => setNotificationForm({...notificationForm, actionUrl: e.target.value})}
                    placeholder="https://example.com/action"
                    className="bg-blue-700 border-blue-600 text-white"
                  />
                </div>
                
                <Button 
                  onClick={handleNotificationSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!notificationForm.title || !notificationForm.message}
                >
                  Send Notification
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}