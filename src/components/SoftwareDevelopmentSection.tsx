import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, Database, Brain, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SoftwareDevelopmentSection = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: 1,
      title: 'Custom Data Management Systems',
      description: 'End-to-end development of data management systems tailored to your business needs',
      features: ['Database Design', 'API Development', 'Real-time Analytics', 'Data Visualization', 'User Management', 'Security Implementation'],
      technologies: ['Python', 'PostgreSQL', 'React', 'Node.js', 'Docker', 'AWS'],
      priceRange: 'KES 8,000 - 20,000',
      duration: '3-6 months',
      icon: Database
    },
    {
      id: 2,
      title: 'Business Intelligence Platforms',
      description: 'Comprehensive BI solutions for data-driven decision making',
      features: ['ETL Pipelines', 'Interactive Dashboards', 'Automated Reporting', 'Data Warehousing', 'Mobile Access'],
      technologies: ['Python', 'Tableau', 'Power BI', 'SQL Server', 'Apache Airflow'],
      priceRange: 'KES 5,000 - 15,000',
      duration: '2-4 months',
      icon: BarChart
    },
    {
      id: 3,
      title: 'Machine Learning Applications',
      description: 'AI-powered applications for predictive analytics and automation',
      features: ['Predictive Modeling', 'Natural Language Processing', 'Computer Vision', 'Recommendation Systems', 'Model Deployment'],
      technologies: ['Python', 'TensorFlow', 'Scikit-learn', 'FastAPI', 'Kubernetes'],
      priceRange: 'KES 6,000 - 18,000',
      duration: '3-5 months',
      icon: Brain
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Software Development for Data Systems
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Custom software solutions designed to handle your data processing, analysis, and visualization needs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card key={service.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300">
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
                      {service.features.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
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

                  <div className="mb-6">
                    <p className="text-gray-400 text-sm">
                      <span className="text-blue-400 font-semibold">Duration:</span> {service.duration}
                    </p>
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

        <div className="text-center mt-12">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={() => navigate('/software-development')}
          >
            View All Software Development Services
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SoftwareDevelopmentSection;
