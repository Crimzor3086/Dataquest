
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, Database, Brain, BarChart, CheckCircle, Clock, Phone, Mail, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SoftwareDevelopment = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: 1,
      title: 'Custom Data Management Systems',
      description: 'End-to-end development of data management systems tailored to your business needs',
      features: ['Database Design & Architecture', 'API Development & Integration', 'Real-time Analytics Dashboard', 'Data Visualization Tools', 'User Management System', 'Security Implementation', 'Backup & Recovery Systems', 'Performance Optimization'],
      technologies: ['Python', 'PostgreSQL', 'React', 'Node.js', 'Docker', 'AWS', 'MongoDB', 'Redis'],
      priceRange: 'KES 8,000 - 20,000',
      duration: '3-6 months',
      icon: Database,
      deliverables: ['Complete source code', 'Database schema', 'API documentation', 'User manual', 'Deployment guide', '3 months support']
    },
    {
      id: 2,
      title: 'Business Intelligence Platforms',
      description: 'Comprehensive BI solutions for data-driven decision making',
      features: ['ETL Pipeline Development', 'Interactive Dashboards', 'Automated Reporting System', 'Data Warehousing', 'Mobile Access Interface', 'Custom Analytics', 'KPI Tracking', 'Predictive Analytics'],
      technologies: ['Python', 'Tableau', 'Power BI', 'SQL Server', 'Apache Airflow', 'Kafka', 'Elasticsearch'],
      priceRange: 'KES 5,000 - 15,000',
      duration: '2-4 months',
      icon: BarChart,
      deliverables: ['BI platform', 'Dashboard templates', 'Report templates', 'Training materials', 'Documentation', '2 months support']
    },
    {
      id: 3,
      title: 'Machine Learning Applications',
      description: 'AI-powered applications for predictive analytics and automation',
      features: ['Predictive Modeling', 'Natural Language Processing', 'Computer Vision Systems', 'Recommendation Engines', 'Model Deployment & Scaling', 'AutoML Solutions', 'Data Pipeline Automation', 'Model Monitoring'],
      technologies: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'FastAPI', 'Kubernetes', 'MLflow', 'Apache Spark'],
      priceRange: 'KES 6,000 - 18,000',
      duration: '3-5 months',
      icon: Brain,
      deliverables: ['Trained ML models', 'API endpoints', 'Model documentation', 'Performance reports', 'Deployment scripts', '4 months support']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navigation />
      <WhatsAppButton />
      
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl font-bold text-white mb-6">Software Development for Data Systems</h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Custom software solutions designed to handle your data processing, analysis, and visualization needs. 
              From simple data dashboards to complex AI-powered systems.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 animate-scale-in">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{service.title}</CardTitle>
                        <p className="text-blue-400 font-semibold">{service.priceRange}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">{service.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="text-white font-semibold mb-2">Key Features:</h4>
                      <div className="space-y-1">
                        {service.features.slice(0, 6).map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span className="text-gray-300 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-white font-semibold mb-2">Technologies:</h4>
                      <div className="flex flex-wrap gap-1">
                        {service.technologies.slice(0, 4).map((tech, idx) => (
                          <Badge key={idx} variant="outline" className="border-blue-600 text-blue-200 text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {service.technologies.length > 4 && (
                          <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                            +{service.technologies.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{service.duration}</span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => navigate('/contacts')}
                    >
                      <Code className="w-4 h-4 mr-2" />
                      Request Consultation
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Development Process */}
          <div className="bg-gray-800/30 rounded-2xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Our Development Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {[
                { step: '01', title: 'Requirements Analysis', description: 'Understanding your data needs and business objectives' },
                { step: '02', title: 'System Design', description: 'Architecting scalable and efficient data solutions' },
                { step: '03', title: 'Development', description: 'Building robust software with modern technologies' },
                { step: '04', title: 'Testing & QA', description: 'Rigorous testing to ensure reliability and performance' },
                { step: '05', title: 'Deployment & Support', description: 'Seamless deployment with ongoing maintenance' }
              ].map((process, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">{process.step}</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{process.title}</h3>
                  <p className="text-gray-300 text-sm">{process.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Build Your Data System?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Let's discuss your project requirements and create a custom solution that transforms your data into actionable insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate('/contacts')}
              >
                <Phone className="w-5 h-5 mr-2" />
                Schedule Consultation
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                onClick={() => window.open('mailto:dataquestsolutions2@gmail.com', '_blank')}
              >
                <Mail className="w-5 h-5 mr-2" />
                Email Us
              </Button>
            </div>
          </div>

          {/* Community Section */}
          <div className="bg-gray-800/50 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Join Our Software Development Community</h3>
            <p className="text-gray-300 mb-6">
              Connect with fellow developers, discuss data systems, share insights on machine learning, and collaborate on innovative software solutions.
            </p>
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => window.open('https://chat.whatsapp.com/JpfYfoyUPAt1hoVWRqg25v', '_blank')}
            >
              <Users className="w-5 h-5 mr-2" />
              Join Software Development Community
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SoftwareDevelopment;
