
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Target, Award, TrendingUp } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Users, label: 'Happy Clients', value: '100+' },
    { icon: Award, label: 'Projects Completed', value: '150+' },
    { icon: Target, label: 'Success Rate', value: '98%' },
    { icon: TrendingUp, label: 'Years Experience', value: '8+' }
  ];

  const values = [
    {
      title: 'Innovation',
      description: 'We constantly embrace new technologies and methodologies to deliver cutting-edge solutions.',
      icon: '🚀'
    },
    {
      title: 'Excellence',
      description: 'We maintain the highest standards in everything we do, from data analysis to client service.',
      icon: '⭐'
    },
    {
      title: 'Integrity',
      description: 'We build trust through transparency, honesty, and ethical practices in all our interactions.',
      icon: '🤝'
    },
    {
      title: 'Impact',
      description: 'We focus on creating meaningful change and measurable results for our clients and community.',
      icon: '💡'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      <Navigation />
      <WhatsAppButton />
      
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl font-bold text-white mb-6">About DataQuest Solutions</h1>
            <p className="text-xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
              Welcome to DataQuest Solutions — your premier gateway to the field of programming, data science, and health research. At DataQuest solutions, we provide a wide range of services including statistical analysis, machine learning and AI development. We also specialize in marketing strategy, data engineering, data collection, and web development. Our training programs cover essential skills in data analysis and machine learning, equipping learners with practical knowledge for real-world applications. In addition, we offer expert consultation across various domains, including health, data and software-related fields. At DataQuest Solutions, we are committed to delivering innovative, data-driven solutions that empower individuals and organizations to thrive in the digital age.
            </p>
          </div>

          {/* Hero Image Section */}
          <div className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <img 
                  src="/images/de215b7a-2cf7-4e79-b5a7-1538f94ccfc8.png" 
                  alt="Data Analysis Workspace" 
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div>
                <img 
                  src="/images/4b006795-23e4-40cb-b135-0f851473e02e.png" 
                  alt="Professional Consultation" 
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <Card className="bg-blue-800/50 border-blue-700">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
                <p className="text-blue-100 text-lg leading-relaxed">
                  Our mission is to empower businesses, organizations, and individuals by delivering innovative tools, expert knowledge, and tailored solutions that foster growth, enhance decision-making, and drive success in a data driven world. Through high-quality data services, cutting-edge AI development, and comprehensive training programs, we enable our clients to optimize performance and stay ahead of industry trends.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-800/50 border-blue-700">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-white mb-6">Our Vision</h2>
                <p className="text-blue-100 text-lg leading-relaxed">
                  Our vision is to be a trusted partner in transforming the way businesses and individuals leverage data, technology, and knowledge. We strive to lead the way in innovation, providing strategic insights and expertise that fuel progress, drive operational excellence, and unlock new opportunities for success in an ever-evolving digital landscape.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-blue-800/50 border-blue-700 text-center">
                <CardContent className="p-6">
                  <stat.icon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                  <p className="text-blue-200">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Story */}
          <div className="bg-blue-800/30 rounded-2xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Our Story</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-blue-100 text-lg leading-relaxed mb-6">
                  Founded in Kakamega, Kenya, DataQuest Solutions emerged from a passion for transforming 
                  raw data into actionable insights. Our journey began when our founder, Enock Bereka, 
                  recognized the growing need for accessible data science expertise in the region.
                </p>
                <p className="text-blue-100 text-lg leading-relaxed">
                  Starting with a small team of dedicated data scientists and analysts, we've grown into 
                  a comprehensive solutions provider, serving clients across various industries while 
                  maintaining our commitment to excellence and innovation.
                </p>
              </div>
              <div className="space-y-4">
                <Badge className="bg-blue-600/20 text-blue-400 border-blue-400 text-sm">
                  Founded 2023
                </Badge>
                <Badge className="bg-blue-600/20 text-blue-400 border-blue-400 text-sm ml-2">
                  Kakamega, Kenya
                </Badge>
                <div className="mt-4">
                  <h4 className="text-white font-semibold mb-2">Key Milestones:</h4>
                  <ul className="text-blue-200 space-y-1">
                    <li>• 2023: Company founded</li>
                    <li>• 2023: First 10 clients milestone</li>
                    <li>• 2024: Expanded service offerings</li>
                    <li>• 2024: 50+ projects completed</li>
                    <li>• 2024: AI/ML specialization launch</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="bg-blue-800/50 border-blue-700 text-center hover:bg-blue-800/70 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{value.icon}</div>
                    <h3 className="text-white font-bold text-xl mb-3">{value.title}</h3>
                    <p className="text-blue-200 text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Services Overview */}
          <div className="bg-blue-800/30 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white text-center mb-8">What We Do</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-white font-semibold text-xl mb-4">Data Analytics</h3>
                <p className="text-blue-200">
                  Transform your raw data into meaningful insights with our comprehensive analytics services.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-white font-semibold text-xl mb-4">Machine Learning</h3>
                <p className="text-blue-200">
                  Leverage AI and ML to predict trends, automate processes, and enhance decision-making.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-white font-semibold text-xl mb-4">Consulting</h3>
                <p className="text-blue-200">
                  Strategic guidance to help you implement data-driven solutions across your organization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default About;
