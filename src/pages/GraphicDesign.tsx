import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, Image, Layers, Zap, CheckCircle, Clock, Phone, Mail, Star, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GraphicDesign = () => {
  const navigate = useNavigate();

  const services = [
    {
      id: 1,
      title: 'Brand Identity Design',
      description: 'Complete brand identity packages including logo design, color schemes, and brand guidelines',
      features: ['Logo Design & Variations', 'Color Palette Creation', 'Typography Selection', 'Brand Guidelines', 'Business Card Design', 'Letterhead Design', 'Social Media Templates', 'Brand Asset Library'],
      priceRange: 'KES 15,000 - 50,000',
      duration: '1-3 weeks',
      icon: Palette,
      popular: true
    },
    {
      id: 2,
      title: 'Marketing Materials',
      description: 'Eye-catching marketing collaterals to promote your business effectively',
      features: ['Brochure Design', 'Flyer Creation', 'Poster Design', 'Banner Design', 'Catalog Design', 'Presentation Templates', 'Infographic Design', 'Advertisement Layouts'],
      priceRange: 'KES 5,000 - 25,000',
      duration: '3-7 days',
      icon: Image,
      popular: false
    },
    {
      id: 3,
      title: 'Digital Graphics',
      description: 'Modern digital graphics for websites, social media, and online platforms',
      features: ['Social Media Graphics', 'Web Banners', 'Email Templates', 'Digital Illustrations', 'Icon Design', 'UI Graphics', 'App Interface Design', 'Online Ad Creatives'],
      priceRange: 'KES 3,000 - 20,000',
      duration: '2-5 days',
      icon: Layers,
      popular: true
    },
    {
      id: 4,
      title: 'Print Design',
      description: 'Professional print-ready designs for all your physical marketing needs',
      features: ['Magazine Layout', 'Book Design', 'Packaging Design', 'Label Design', 'Sticker Design', 'Menu Design', 'Annual Reports', 'Product Catalogs'],
      priceRange: 'KES 8,000 - 35,000',
      duration: '1-2 weeks',
      icon: Zap,
      popular: false
    }
  ];

  const portfolio = [
    { category: 'Logos', count: '200+', description: 'Unique logo designs created' },
    { category: 'Brands', count: '150+', description: 'Complete brand identities developed' },
    { category: 'Projects', count: '500+', description: 'Successful design projects completed' },
    { category: 'Clients', count: '300+', description: 'Satisfied clients served' }
  ];

  const designProcess = [
    { step: '01', title: 'Brief & Research', description: 'Understanding your vision, target audience, and market research' },
    { step: '02', title: 'Concept Development', description: 'Creating initial concepts and design directions' },
    { step: '03', title: 'Design Creation', description: 'Developing detailed designs with multiple iterations' },
    { step: '04', title: 'Review & Refine', description: 'Client feedback integration and design refinement' },
    { step: '05', title: 'Final Delivery', description: 'Delivering final files in all required formats' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900">
      <Navigation />
      <WhatsAppButton />
      
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl font-bold text-white mb-6">Professional Graphic Design Services</h1>
            <p className="text-xl text-purple-200 max-w-4xl mx-auto">
              Transform your brand with stunning visual designs. From logos to complete brand identities, 
              we create designs that capture attention and communicate your message effectively.
            </p>
          </div>

          {/* Portfolio Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {portfolio.map((stat, index) => (
              <Card key={index} className="bg-purple-800/30 border-purple-600 text-center animate-scale-in">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-purple-300 mb-2">{stat.count}</div>
                  <div className="text-lg font-semibold text-white mb-1">{stat.category}</div>
                  <div className="text-sm text-purple-200">{stat.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.id} className="bg-purple-800/50 border-purple-700 hover:bg-purple-800/70 transition-all duration-300 animate-scale-in relative">
                  {service.popular && (
                    <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500">
                      <Star className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-xl">{service.title}</CardTitle>
                        <p className="text-purple-400 font-semibold">{service.priceRange}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-purple-200 text-base mb-6">
                      {service.description}
                    </CardDescription>
                    
                    <div className="mb-6">
                      <h4 className="text-white font-semibold mb-3">What's Included:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {service.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span className="text-purple-100 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2 text-purple-300">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{service.duration}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        onClick={() => navigate('/contacts')}
                      >
                        Get Started
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-purple-600 text-purple-200 hover:bg-purple-700"
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

          {/* Design Process */}
          <div className="bg-purple-800/30 rounded-2xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Our Design Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {designProcess.map((process, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">{process.step}</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{process.title}</h3>
                  <p className="text-purple-200 text-sm">{process.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Why Choose Our Design Services?</h2>
              <div className="space-y-4">
                {[
                  'Professional designers with 5+ years experience',
                  'Unlimited revisions until you\'re satisfied',
                  'Quick turnaround times',
                  'Original, custom designs - no templates',
                  'All file formats provided (AI, PSD, PNG, JPG, PDF)',
                  'Commercial usage rights included',
                  'Free consultation and quote',
                  'Affordable pricing for all business sizes'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-purple-100">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-800/50 to-pink-800/50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Ready to Start Your Project?</h3>
              <p className="text-purple-200 mb-6">
                Get a free consultation and quote for your design project. We'll discuss your vision and provide a detailed proposal.
              </p>
              <div className="space-y-4">
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  onClick={() => navigate('/contacts')}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Get Free Consultation
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full border-purple-600 text-purple-200 hover:bg-purple-700"
                  onClick={() => window.open('mailto:dataquestsolutions2@gmail.com', '_blank')}
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Email Your Requirements
                </Button>
              </div>
            </div>
          </div>

          {/* Community Section */}
          <div className="bg-gradient-to-r from-purple-800/50 to-pink-800/50 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Join Our Graphic Design Community</h3>
            <p className="text-purple-200 mb-6">
              Connect with fellow designers, share your work, get feedback, and stay updated with the latest design trends and tips.
            </p>
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => window.open('https://chat.whatsapp.com/IHeiFCyOuiSA9rAbLcueW5', '_blank')}
            >
              <Users className="w-5 h-5 mr-2" />
              Join Graphic Design Community
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default GraphicDesign;
