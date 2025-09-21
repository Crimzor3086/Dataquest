
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ServiceInquiryForm from '@/components/ServiceInquiryForm';
import SoftwareDevelopmentSection from '@/components/SoftwareDevelopmentSection';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartBar, Users, Settings, Briefcase, Brain, Stethoscope, Palette, Code, TrendingUp, Activity, Globe, FileText, Database, Microscope, PenTool, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { servicesData, getServiceCategories } from '@/data/servicesData';
import { useState } from 'react';

const Services = () => {
  const [selectedService, setSelectedService] = useState<any>(null);
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const categories = ['All', ...getServiceCategories()];
  
  const filteredServices = selectedCategory === 'All' 
    ? servicesData 
    : servicesData.filter(service => service.category === selectedCategory);

  // Override pricing for all services to be in the 2-10 KES range
  const updatedServices = filteredServices.map(service => ({
    ...service,
    pricing: {
      ...service.pricing,
      startingPrice: `From ${Math.floor(Math.random() * 9) + 2000} KES`
    }
  }));

  const getServiceIcon = (serviceId: string) => {
    switch (serviceId) {
      case 'statistical-analysis':
        return BarChart3;
      case 'time-series-analysis':
        return TrendingUp;
      case 'survival-analysis':
        return Activity;
      case 'spatial-gis-analysis':
        return Globe;
      case 'data-collection-services':
        return Database;
      case 'machine-learning':
        return Brain;
      case 'deep-learning':
        return Brain;
      case 'research-writing':
        return FileText;
      case 'outbreak-investigation':
        return Stethoscope;
      case 'graphic-design':
        return Palette;
      case 'epidemiology-biostatistics':
        return Microscope;
      default:
        return ChartBar;
    }
  };

  const handleLearnMore = (serviceId: string) => {
    navigate(`/services/${serviceId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      <Navigation />
      <WhatsAppButton />
      
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl font-bold text-white mb-6">Our Services</h1>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Comprehensive data solutions designed to transform your business operations and drive growth through intelligent insights.
            </p>
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
                    : "border-blue-600 text-blue-200 hover:bg-blue-700"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {updatedServices.map((service) => {
              const Icon = getServiceIcon(service.id);
              return (
                <Card key={service.id} className="bg-blue-800/50 border-blue-700 hover:bg-blue-800/70 transition-all duration-300 animate-scale-in">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-xl">{service.title}</CardTitle>
                        <p className="text-blue-400 font-semibold">{service.pricing.startingPrice}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-blue-200 text-base mb-4">
                      {service.description}
                    </CardDescription>
                    <div className="space-y-2 mb-6">
                      {service.features.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span className="text-blue-100">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleLearnMore(service.id)}
                      >
                        Learn More
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-blue-600 text-blue-200 hover:bg-blue-700"
                        onClick={() => navigate('/contacts')}
                      >
                        Get Quote
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Software Development Section */}
          <SoftwareDevelopmentSection />

          {/* Process Section */}
          <div className="bg-blue-800/30 rounded-2xl p-8 mb-16 mt-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Our Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'Discovery', description: 'Understanding your business needs and data landscape' },
                { step: '02', title: 'Analysis', description: 'Deep dive into your data to identify opportunities' },
                { step: '03', title: 'Implementation', description: 'Building and deploying custom solutions' },
                { step: '04', title: 'Optimization', description: 'Continuous improvement and support' }
              ].map((process, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">{process.step}</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{process.title}</h3>
                  <p className="text-blue-200">{process.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Updated CTA Section with Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Ready to Get Started?</h2>
              <p className="text-xl text-blue-200 mb-8">
                Contact us today to discuss how we can transform your data into competitive advantage.
              </p>
              <div className="space-y-4 text-blue-100">
                <div>
                  <h3 className="font-semibold text-white mb-2">Why Choose DataQuest Solutions?</h3>
                  <ul className="space-y-2">
                    <li>• Expert team with 3+ years experience</li>
                    <li>• Proven track record with 50+ successful projects</li>
                    <li>• End-to-end data solutions</li>
                    <li>• Based in Kakamega, Kenya with local expertise</li>
                    <li>• Affordable pricing starting from 2000 KES</li>
                  </ul>
                </div>
              </div>
            </div>
            <ServiceInquiryForm />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Services;
