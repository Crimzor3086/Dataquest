
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, User, Star, Users, Calendar, DollarSign } from 'lucide-react';
import { coursesData } from '@/data/coursesData';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import CourseRating from '@/components/CourseRating';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [enrolling, setEnrolling] = useState(false);

  const course = coursesData.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Course Not Found</h1>
            <Button onClick={() => navigate('/courses')} className="bg-blue-600 hover:bg-blue-700">
              Back to Courses
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please login to enroll in this course');
      navigate('/auth');
      return;
    }

    setEnrolling(true);
    try {
      const { error } = await supabase
        .from('enrollments')
        .insert({
          student_id: user.id,
          course_id: courseId,
          status: 'active'
        });

      if (error) throw error;

      await supabase.functions.invoke('send-email', {
        body: {
          to: 'dataquestsolutions2@gmail.com',
          subject: `New Course Enrollment - ${course.title}`,
          type: 'enrollment',
          data: {
            courseName: course.title,
            studentEmail: user.email,
            enrollmentDate: new Date().toLocaleDateString()
          }
        }
      });

      toast.success('Successfully enrolled! Confirmation sent to dataquestsolutions2@gmail.com');
    } catch (error: any) {
      console.error('Enrollment error:', error);
      toast.error('Failed to enroll. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  const handlePayment = () => {
    const params = new URLSearchParams({
      amount: course.price.toString(),
      currency: 'KES',
      courseId: courseId || '',
      description: `Course: ${course.title}`
    });
    navigate(`/payment?${params.toString()}`);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-600';
      case 'Intermediate': return 'bg-yellow-600';
      case 'Advanced': return 'bg-red-600';
      default: return 'bg-blue-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navigation />
      
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Badge className={`${getLevelColor(course.level)} text-white mb-4`}>
                {course.level}
              </Badge>
              <h1 className="text-4xl font-bold text-white mb-4">{course.title}</h1>
              <p className="text-xl text-gray-400 mb-6">{course.description}</p>
              
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2 text-gray-300">
                  <User className="w-5 h-5" />
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="w-5 h-5" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <BookOpen className="w-5 h-5" />
                  <span>{course.category}</span>
                </div>
              </div>

              {/* Course Content Tabs */}
              <Tabs defaultValue="curriculum" className="mt-8">
                <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 border-gray-700">
                  <TabsTrigger 
                    value="curriculum" 
                    className="data-[state=active]:bg-blue-600 text-gray-300 data-[state=active]:text-white hover:bg-gray-700/50 transition-colors"
                  >
                    Curriculum
                  </TabsTrigger>
                  <TabsTrigger 
                    value="ratings" 
                    className="data-[state=active]:bg-blue-600 text-gray-300 data-[state=active]:text-white hover:bg-gray-700/50 transition-colors"
                  >
                    Reviews & Ratings
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="curriculum" className="mt-6">
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Course Curriculum</CardTitle>
                    </CardHeader>
                    <CardContent className="text-gray-300">
                      <div className="space-y-6">
                        {course.syllabus.map((module, index) => (
                          <div 
                            key={index} 
                            className="border-l-4 border-blue-600 pl-6 py-3 bg-gray-900/30 rounded-r-lg"
                          >
                            <h4 className="font-semibold text-white text-lg mb-2">
                              {module}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-blue-400">
                              <BookOpen className="w-4 h-4" />
                              <span>Interactive lessons and practical exercises</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-8 p-6 bg-blue-900/20 border border-blue-700/30 rounded-lg">
                        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-400" />
                          What You'll Gain
                        </h4>
                        <ul className="space-y-2">
                          {course.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-300">
                              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="ratings" className="mt-6">
                  <CourseRating courseId={courseId || ''} showAddRating={true} />
                </TabsContent>
              </Tabs>
            </div>

            <div className="lg:col-span-1">
              <Card className="bg-gray-800/50 border-gray-700 sticky top-4">
                <CardHeader>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      KES {course.price.toLocaleString()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={handlePayment}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Pay Now
                  </Button>
                  
                  <Button 
                    onClick={handleEnroll}
                    disabled={enrolling}
                    variant="outline"
                    className="w-full border-white/30 text-white hover:bg-white/10 py-3 text-lg"
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll (Free)'}
                  </Button>
                  
                  <div className="pt-4 border-t border-gray-700">
                    <h4 className="font-semibold text-white mb-2">Payment Methods:</h4>
                    <div className="text-sm text-gray-400 space-y-1">
                      <p>• M-Pesa: +254 707 612 395</p>
                      <p>• PayPal: dataquestsolutions2@gmail.com</p>
                      <p>• Paybill: 522522 (Acc: 1340849054)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
