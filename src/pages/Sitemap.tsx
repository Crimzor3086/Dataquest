
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { 
  Home, Info, Briefcase, BookOpen, Users, Mail, 
  Shield, Settings, ChartBar, UserCog, FolderOpen,
  FileText, Globe, Video, Search
} from 'lucide-react';

const Sitemap = () => {
  const siteStructure = [
    {
      category: 'Main Pages',
      icon: Home,
      pages: [
        { name: 'Home', path: '/', description: 'Landing page with company overview' },
        { name: 'About Us', path: '/about', description: 'Company history and mission' },
        { name: 'Services', path: '/services', description: 'Our data analytics services' },
        { name: 'Team', path: '/team', description: 'Meet our expert team' },
        { name: 'Contact', path: '/contacts', description: 'Get in touch with us' }
      ]
    },
    {
      category: 'Services',
      icon: Briefcase,
      pages: [
        { name: 'Data Analysis', path: '/service/data-analysis', description: 'Comprehensive data analysis services' },
        { name: 'Machine Learning', path: '/service/machine-learning', description: 'AI and ML solutions' },
        { name: 'Business Intelligence', path: '/service/business-intelligence', description: 'BI dashboard and reporting' },
        { name: 'Data Visualization', path: '/service/data-visualization', description: 'Interactive data visualizations' },
        { name: 'Predictive Analytics', path: '/service/predictive-analytics', description: 'Forecasting and predictions' },
        { name: 'Consulting', path: '/service/consulting', description: 'Strategic data consulting' }
      ]
    },
    {
      category: 'Education',
      icon: BookOpen,
      pages: [
        { name: 'Courses', path: '/courses', description: 'Browse available training courses' },
        { name: 'Course Registration', path: '/course-registration', description: 'Register for courses' },
        { name: 'Python for Data Science', path: '/course/python-data-science', description: 'Learn Python programming' },
        { name: 'Machine Learning', path: '/course/machine-learning', description: 'ML fundamentals course' },
        { name: 'Data Visualization', path: '/course/data-visualization', description: 'Visualization techniques' },
        { name: 'Business Analytics', path: '/course/business-analytics', description: 'Business analytics course' }
      ]
    },
    {
      category: 'Resources',
      icon: FileText,
      pages: [
        { name: 'Blog', path: '/blog', description: 'Latest insights and articles' },
        { name: 'Case Studies', path: '/case-studies', description: 'Success stories and projects' },
        { name: 'Resources', path: '/resources', description: 'Downloadable resources' },
        { name: 'Webinars', path: '/webinars', description: 'Live and recorded webinars' },
        { name: 'Projects', path: '/projects', description: 'Our portfolio of projects' }
      ]
    },
    {
      category: 'Admin Dashboard',
      icon: Settings,
      pages: [
        { name: 'Admin Dashboard', path: '/admin', description: 'Main admin panel' },
        { name: 'Student Management', path: '/student-management', description: 'Manage student enrollments' },
        { name: 'Client Management', path: '/client-management', description: 'Manage client relationships' },
        { name: 'Course Management', path: '/course-management', description: 'Manage courses and curriculum' },
        { name: 'Project Management', path: '/projects', description: 'Track and manage projects' },
        { name: 'Analytics', path: '/analytics', description: 'Business analytics dashboard' },
        { name: 'System Settings', path: '/system-settings', description: 'Configure system preferences' }
      ]
    },
    {
      category: 'User Account',
      icon: Users,
      pages: [
        { name: 'Authentication', path: '/auth', description: 'Login and registration' },
        { name: 'Sitemap', path: '/sitemap', description: 'Complete site navigation' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      <Navigation />
      <WhatsAppButton />
      
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-white mb-4">Site Map</h1>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Complete navigation guide to all sections and pages on DataQuest Solutions website
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {siteStructure.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card key={index} className="bg-blue-800/50 border-blue-700">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-xl">{section.category}</CardTitle>
                        <CardDescription className="text-blue-300">
                          {section.pages.length} pages available
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {section.pages.map((page, pageIndex) => (
                        <Link
                          key={pageIndex}
                          to={page.path}
                          className="block p-3 bg-blue-700/30 rounded-lg hover:bg-blue-700/50 transition-colors group"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-white font-semibold group-hover:text-blue-200">
                                {page.name}
                              </h4>
                              <p className="text-blue-300 text-sm">{page.description}</p>
                            </div>
                            <div className="text-blue-400 text-sm font-mono">
                              {page.path}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* SEO Information */}
          <Card className="mt-8 bg-blue-800/50 border-blue-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Search className="w-6 h-6 mr-3" />
                SEO & Search Information
              </CardTitle>
              <CardDescription className="text-blue-300">
                Search engine optimization details for better visibility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-semibold mb-2">Main Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Data Analytics', 'Machine Learning', 'Business Intelligence', 'Data Science Training', 'Kenya Data Solutions'].map((keyword, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Contact Information</h4>
                  <div className="text-blue-300 text-sm space-y-1">
                    <p>Email: info@dataquestsolutions.com</p>
                    <p>Phone: +254 700 000 000</p>
                    <p>Location: Nairobi, Kenya</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Navigation */}
          <div className="mt-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-6">Quick Navigation</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                Home
              </Link>
              <Link to="/services" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                Services
              </Link>
              <Link to="/courses" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                Courses
              </Link>
              <Link to="/admin" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                Admin
              </Link>
              <Link to="/contacts" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Sitemap;
