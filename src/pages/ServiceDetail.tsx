
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, Clock, Phone, Mail } from 'lucide-react';
import { getServiceById } from '@/data/servicesData';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const service = getServiceById(id || '');

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Navigation />
        <div className="py-16 px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Service Not Found</h1>
          <Button onClick={() => navigate('/services')} className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Button>
        </div>
      </div>
    );
  }

  const handleContactUs = () => {
    navigate('/contacts');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navigation />
      
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Button 
            onClick={() => navigate('/services')}
            variant="outline"
            className="mb-8 border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Service Header */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline" className="border-blue-500 text-blue-400">
                      {service.category}
                    </Badge>
                    <div className="text-2xl font-bold text-blue-400">
                      {service.pricing.startingPrice}
                    </div>
                  </div>
                  <CardTitle className="text-white text-3xl mb-2">{service.title}</CardTitle>
                  <CardDescription className="text-gray-400 text-lg">
                    {service.detailedDescription}
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Service Features */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-xl">What's Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pricing Packages */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Pricing Packages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {service.pricing.packages.map((pkg, index) => (
                      <Card key={index} className="bg-gray-700/30 border-gray-600">
                        <CardHeader>
                          <CardTitle className="text-white text-lg">{pkg.name}</CardTitle>
                          <div className="text-2xl font-bold text-blue-400">{pkg.price}</div>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {pkg.features.map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-center gap-2 text-gray-300 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Deliverables */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Deliverables</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.deliverables.map((deliverable, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        <span className="text-gray-300">{deliverable}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Consultation Card */}
              <Card className="bg-gray-800/50 border-gray-700 sticky top-4">
                <CardHeader>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">
                      {service.pricing.startingPrice}
                    </div>
                    <p className="text-gray-400">Starting price</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={handleContactUs}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
                  >
                    Get Quote
                  </Button>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between text-gray-300">
                      <Clock className="w-4 h-4" />
                      <span className="text-white">{service.timeline}</span>
                    </div>
                    <div className="text-center text-gray-400 text-xs">
                      Custom pricing based on project scope
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Process */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Our Process</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        1
                      </div>
                      <span className="text-gray-300 text-sm">Consultation & Requirements</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        2
                      </div>
                      <span className="text-gray-300 text-sm">Project Planning</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        3
                      </div>
                      <span className="text-gray-300 text-sm">Implementation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        4
                      </div>
                      <span className="text-gray-300 text-sm">Delivery & Support</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Contact Us</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">+254 707 612 395</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">dataquestsolutions2@gmail.com</span>
                  </div>
                  <Button 
                    onClick={() => navigate('/contacts')}
                    variant="outline" 
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Send Message
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
