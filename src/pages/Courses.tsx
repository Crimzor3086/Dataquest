
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, ChartBar, Clock, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { coursesData, getCategories } from '@/data/coursesData';
import { useState } from 'react';

const Courses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const categories = ['All', ...getCategories()];
  
  const filteredCourses = selectedCategory === 'All' 
    ? coursesData 
    : coursesData.filter(course => course.category === selectedCategory);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-600';
      case 'Intermediate': return 'bg-yellow-600';
      case 'Advanced': return 'bg-red-600';
      default: return 'bg-blue-600';
    }
  };

  const handleViewDetails = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navigation />
      
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl font-bold text-white mb-6">Training Courses</h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Elevate your data skills with our comprehensive training programs led by industry experts and data scientists.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{coursesData.length}</div>
              <div className="text-gray-400">Available Courses</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-400">Students Trained</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChartBar className="w-8 h-8 text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">95%</div>
              <div className="text-gray-400">Completion Rate</div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={selectedCategory === category 
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : "border-gray-600 text-gray-300 hover:bg-gray-700"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 animate-scale-in h-full flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={`${getLevelColor(course.level)} text-white`}>
                      {course.level}
                    </Badge>
                    <span className="text-2xl font-bold text-blue-400">
                      KES {course.price.toLocaleString()}
                    </span>
                  </div>
                  <CardTitle className="text-white text-xl mb-2">{course.title}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <User className="w-4 h-4" />
                      <span>{course.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <BookOpen className="w-4 h-4" />
                      <span>{course.category}</span>
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleViewDetails(course.id)}
                    >
                      View Course Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Learning Path Section */}
          <div className="mt-20 bg-gray-800/30 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Recommended Learning Paths</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-white text-xl font-semibold mb-4">Data Analyst Path</h3>
                <div className="space-y-2 text-gray-400">
                  <div>1. Advanced Excel</div>
                  <div>2. Statistical Analysis with SPSS</div>
                  <div>3. Data Analysis with R</div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-white text-xl font-semibold mb-4">Data Scientist Path</h3>
                <div className="space-y-2 text-gray-400">
                  <div>1. Data Analysis with R</div>
                  <div>2. Machine Learning with R</div>
                  <div>3. Predictive Modeling with Python</div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-white text-xl font-semibold mb-4">Research Specialist Path</h3>
                <div className="space-y-2 text-gray-400">
                  <div>1. Data Collection Tools</div>
                  <div>2. Statistical Modeling with Stata</div>
                  <div>3. Qualitative Analysis</div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="mt-16 bg-gray-800/30 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Payment Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="bg-gray-700/30 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white text-lg text-center">PayPal</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-blue-400">dataquestsolutions2@gmail.com</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-700/30 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white text-lg text-center">Mobile Money (MTN)</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-1">
                  <p className="text-blue-400">+254 707 612 395</p>
                  <p className="text-blue-400">+254 701 344 230</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-700/30 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-white text-lg text-center">Bank (Kenyan Students)</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-1">
                  <p className="text-gray-300">Paybill: <span className="text-blue-400">522522</span></p>
                  <p className="text-gray-300">Account: <span className="text-blue-400">1340849054</span></p>
                </CardContent>
              </Card>
            </div>
            <p className="text-center text-gray-400 mt-6">
              Payment is required before course registration is completed. Contact us to confirm payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
