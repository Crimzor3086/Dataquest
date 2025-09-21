import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, Smartphone, Globe, CheckCircle, Clock, Phone, Mail, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WebDevelopment = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: 1,
      title: 'Responsive Website Design',
      description: 'Modern, user-friendly websites that adapt seamlessly to any device',
      features: ['Mobile-First Design', 'Cross-Browser Compatibility', 'SEO Optimization', 'Content Management System', 'E-commerce Integration', 'User Authentication', 'Interactive Elements', 'Performance Tuning'],
      technologies: ['React', 'Next.js', 'Tailwind CSS', 'Node.js', 'WordPress', 'Shopify', 'GraphQL'],
      priceRange: 'KES 10,000 - 30,000',
      duration: '2-5 weeks',
      icon: Smartphone,
      deliverables: ['Website source code', 'Design files', 'Content guide', 'User manual', 'Deployment support', '1 month support']
    },
    {
      id: 2,
      title: 'Web Application Development',
      description: 'Custom web applications tailored to your specific business needs',
      features: ['Database Integration', 'API Development', 'Real-time Data Processing', 'User Roles & Permissions', 'Scalable Architecture', 'Security Implementation', 'Third-Party Integrations', 'Automated Testing'],
      technologies: ['React', 'Angular', 'Vue.js', 'Node.js', 'Express.js', 'PostgreSQL', 'MongoDB', 'Firebase'],
      priceRange: 'KES 15,000 - 45,000',
      duration: '3-8 weeks',
      icon: Code,
      deliverables: ['Web application source code', 'API documentation', 'Database schema', 'Deployment scripts', 'User training', '2 months support']
    },
    {
      id: 3,
      title: 'E-commerce Solutions',
      description: 'Complete e-commerce platforms to sell your products online',
      features: ['Product Catalog Management', 'Shopping Cart', 'Secure Payment Gateway', 'Order Tracking', 'Customer Accounts', 'Inventory Management', 'Marketing Tools', 'Analytics Dashboard'],
      technologies: ['Shopify', 'WooCommerce', 'Magento', 'Stripe', 'PayPal', 'Square', 'Mailchimp', 'Google Analytics'],
      priceRange: 'KES 12,000 - 35,000',
      duration: '2-6 weeks',
      icon: Globe,
      deliverables: ['E-commerce platform', 'Product import guide', 'Payment gateway setup', 'Marketing plan', 'Training materials', '3 months support']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
      <Navigation />
      <WhatsAppButton />
      
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl font-bold text-white mb-6">Professional Web Development Services</h1>
            <p className="text-xl text-purple-200 max-w-4xl mx-auto">
              Custom web solutions built with modern technologies. From responsive websites to complex web applications, 
              we deliver digital experiences that drive results.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.id} className="bg-purple-800/50 border-purple-700 hover:bg-purple-800/70 transition-all duration-300 animate-scale-in">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{service.title}</CardTitle>
                        <p className="text-purple-400 font-semibold">{service.priceRange}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-200 mb-4">{service.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="text-white font-semibold mb-2">Key Features:</h4>
                      <div className="space-y-1">
                        {service.features.slice(0, 6).map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span className="text-purple-200 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-white font-semibold mb-2">Technologies:</h4>
                      <div className="flex flex-wrap gap-1">
                        {service.technologies.slice(0, 4).map((tech, idx) => (
                          <Badge key={idx} variant="outline" className="border-purple-600 text-purple-200 text-xs">
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
                      <div className="flex items-center justify-between text-sm text-purple-300">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{service.duration}</span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700"
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
          <div className="bg-purple-800/30 rounded-2xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Our Development Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {[
                { step: '01', title: 'Requirements Analysis', description: 'Understanding your web needs and business objectives' },
                { step: '02', title: 'Design & Prototyping', description: 'Creating wireframes and interactive prototypes' },
                { step: '03', title: 'Development', description: 'Building robust web solutions with modern technologies' },
                { step: '04', title: 'Testing & QA', description: 'Rigorous testing to ensure reliability and performance' },
                { step: '05', title: 'Deployment & Support', description: 'Seamless deployment with ongoing maintenance' }
              ].map((process, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">{process.step}</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{process.title}</h3>
                  <p className="text-purple-200 text-sm">{process.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Elevate Your Web Presence?</h2>
            <p className="text-xl text-purple-200 mb-8 max-w-3xl mx-auto">
              Let's discuss your project requirements and create a custom web solution that drives engagement and achieves your business goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-purple-600 hover:bg-purple-700"
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
          <div className="bg-purple-800/50 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Join Our Web Development Community</h3>
            <p className="text-purple-200 mb-6">
              Connect with fellow developers, share knowledge about modern web technologies, discuss best practices, and collaborate on exciting projects.
            </p>
            <Button 
              size="lg" 
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => window.open('https://chat.whatsapp.com/Hy7ZQl1vSmR7Id1ZSX52I2', '_blank')}
            >
              <Users className="w-5 h-5 mr-2" />
              Join Web Development Community
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default WebDevelopment;
