import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Target, 
  BarChart3, 
  Lightbulb, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  MessageSquare,
  FileText,
  TrendingUp,
  Database,
  Brain,
  Activity,
  Map,
  Stethoscope,
  PenTool
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Consultation = () => {
  const navigate = useNavigate();

  const consultationServices = [
    {
      title: 'Data Management Systems',
      description: 'Expert consultation on designing and implementing effective data management systems for health and research',
      features: [
        'Survey & Questionnaire Design for tailored data collection',
        'Electronic Health Forms (EHR) design and implementation',
        'Kobo Toolbox setup and customization for mobile data collection',
        'CommCare & REDCap platform setup with team training',
        'Data collection workflow optimization'
      ],
      duration: '2-4 weeks',
      price: 'KES 8,000 - 15,000',
      icon: Database
    },
    {
      title: 'Medical Data Analytics',
      description: 'Expert consultation in analyzing medical and epidemiological data to inform health decisions',
      features: [
        'Advanced statistical analysis on epidemiological datasets',
        'Software expertise in R, Stata, SPSS, and SAS',
        'Data interpretation of rates, risks, ratios, and trends',
        'Health policy and intervention guidance',
        'Custom analytics solutions'
      ],
      duration: '3-6 weeks',
      price: 'KES 10,000 - 18,000',
      icon: BarChart3
    },
    {
      title: 'Infectious Disease Modelling',
      description: 'Expert consultation on applying infectious disease modelling to understand and control outbreaks',
      features: [
        'Compartmental Models (SIR, SEIR) guidance',
        'R₀ estimation for disease transmission understanding',
        'Disease spread projections and scenario planning',
        'Intervention impact evaluation',
        'Model calibration & sensitivity analysis'
      ],
      duration: '3-5 weeks',
      price: 'KES 12,000 - 20,000',
      icon: Activity
    },
    {
      title: 'Scientific Writing & Reporting',
      description: 'Expert consultation in scientific writing and reporting for health research',
      features: [
        'Academic papers & grant proposal assistance',
        'Data visualization and chart creation',
        'Policy brief writing and structuring',
        'Research report editing and review',
        'Publication strategy guidance'
      ],
      duration: '2-4 weeks',
      price: 'KES 6,000 - 12,000',
      icon: PenTool
    },
    {
      title: 'Machine Learning & AI for Health',
      description: 'Expert consultation on leveraging ML and AI to enhance healthcare delivery and research',
      features: [
        'AI in diagnosis & prognosis guidance',
        'Model selection & development support',
        'Data preparation & feature engineering',
        'Clinical Decision Support Systems (CDSS) design',
        'Integration into health systems and EHRs'
      ],
      duration: '4-8 weeks',
      price: 'KES 15,000 - 25,000',
      icon: Brain
    },
    {
      title: 'Spatial Epidemiology and GIS Mapping',
      description: 'Expert consultation in spatial epidemiology, utilizing GIS mapping to analyze disease patterns',
      features: [
        'Geospatial data analysis and disease hotspot identification',
        'Interactive disease distribution mapping',
        'Environmental & social determinants assessment',
        'Spatial risk assessment and modeling',
        'Health surveillance system development'
      ],
      duration: '3-6 weeks',
      price: 'KES 10,000 - 18,000',
      icon: Map
    }
  ];

  const consultationProcess = [
    {
      step: 1,
      title: 'Initial Assessment',
      description: 'We begin with a comprehensive evaluation of your current data landscape, business objectives, and technical infrastructure.',
      icon: FileText
    },
    {
      step: 2,
      title: 'Strategic Planning',
      description: 'Our experts develop a customized strategy that aligns with your business goals and maximizes ROI.',
      icon: Lightbulb
    },
    {
      step: 3,
      title: 'Implementation Guidance',
      description: 'We provide hands-on support during implementation, ensuring best practices and optimal results.',
      icon: Users
    },
    {
      step: 4,
      title: 'Performance Monitoring',
      description: 'Continuous monitoring and optimization to ensure sustained success and maximum value.',
      icon: TrendingUp
    }
  ];

  const benefits = [
    'Expert guidance from seasoned professionals',
    'Customized solutions for your specific needs',
    'Reduced implementation risks and costs',
    'Faster time-to-value for your projects',
    'Knowledge transfer to your internal team',
    'Ongoing support and maintenance guidance'
  ];

  return (
    <>
      <SEO 
        title="Data Analytics Consultation Services - DataQuest Solutions"
        description="Expert consultation services for data analytics, business intelligence, and AI/ML implementation. Get strategic guidance from our experienced consultants in Kenya."
        keywords={['data consultation Kenya', 'analytics consulting', 'BI consultation', 'data strategy', 'AI consulting Nairobi']}
        url="https://dataquestsolutions.com/consultation"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        <Navigation />
        <WhatsAppButton />
        
        {/* Hero Section */}
        <section className="py-20 px-4 text-center">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 animate-fade-in">
              Expert Data Analytics
              <span className="text-gradient bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Consultation</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 mb-12 max-w-4xl mx-auto animate-fade-in-delay">
              Get strategic guidance from our experienced consultants to transform your data into competitive advantage
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
                onClick={() => navigate('/contacts')}
              >
                Schedule Consultation
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-4 text-lg"
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Services
              </Button>
            </div>
          </div>
        </section>

        {/* Why Choose Our Consultation */}
        <section className="py-16 px-4 bg-blue-800/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-8 text-center">Why Choose Our Consultation Services?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Expert Team</h3>
                <p className="text-blue-200">
                  Our consultants have years of experience across various industries and technical domains.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Strategic Focus</h3>
                <p className="text-blue-200">
                  We align our recommendations with your business objectives for maximum impact.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Proven Results</h3>
                <p className="text-blue-200">
                  Track record of successful implementations and measurable business outcomes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Consultation Services */}
        <section id="services" className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-8 text-center">Our Consultation Services</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {consultationServices.map((service, index) => {
                const Icon = service.icon;
                return (
                  <Card key={index} className="bg-blue-800/50 border-blue-700 hover:bg-blue-800/70 transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-xl">{service.title}</CardTitle>
                          <p className="text-blue-400 font-semibold">{service.price}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-blue-200 mb-4">{service.description}</p>
                      
                      <div className="mb-4">
                        <h4 className="text-white font-semibold mb-2">What's Included:</h4>
                        <div className="space-y-2">
                          {service.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-blue-200 text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-blue-300 mb-6">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{service.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4" />
                          <span>Competitive Pricing</span>
                        </div>
                      </div>

                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => navigate('/contacts')}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Get Quote
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Consultation Process */}
        <section className="py-16 px-4 bg-blue-800/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-8 text-center">Our Consultation Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {consultationProcess.map((process, index) => {
                const Icon = process.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="relative mb-6">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <Badge className="absolute -top-2 -right-2 bg-blue-400 text-white">
                        {process.step}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{process.title}</h3>
                    <p className="text-blue-200 text-sm">{process.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-8 text-center">Benefits of Our Consultation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-400 mt-1" />
                  <p className="text-blue-200 text-lg">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-blue-200 mb-8">
              Let's discuss how our consultation services can help transform your data strategy
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
                onClick={() => navigate('/contacts')}
              >
                Schedule Free Discovery Call
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-4 text-lg"
                onClick={() => navigate('/services')}
              >
                View All Services
              </Button>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    </>
  );
};

export default Consultation;
