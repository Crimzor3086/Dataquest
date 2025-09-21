
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, TrendingUp, CheckCircle } from 'lucide-react';

const CaseStudies = () => {
  const caseStudies = [
    {
      id: 1,
      title: "Healthcare Data Analytics",
      client: "Regional Hospital",
      industry: "Healthcare",
      description: "Implemented predictive modeling for patient outcomes",
      challenge: "Manual data processing and lack of predictive insights for patient care management",
      solution: "Developed automated ML pipeline for patient risk assessment using Python and scikit-learn",
      results: "40% improvement in early intervention and 25% reduction in readmission rates",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=500&h=300&fit=crop"
    },
    {
      id: 2,
      title: "Market Research Automation", 
      client: "Marketing Agency",
      industry: "Marketing",
      description: "Streamlined data collection and analysis processes",
      challenge: "Time-consuming manual surveys and analysis leading to delayed client reporting",
      solution: "Implemented automated data collection tools using KoBo Toolbox and created real-time dashboard",
      results: "60% faster reporting and 35% increase in client satisfaction scores",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      <Navigation />
      <WhatsAppButton />
      
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">Case Studies</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Discover how we've helped organizations transform their data into actionable insights and measurable results.
            </p>
          </div>

          {/* Case Studies */}
          <div className="space-y-12">
            {caseStudies.map((study) => (
              <Card key={study.id} className="bg-blue-800/50 border-blue-700">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <img 
                        src={study.image} 
                        alt={study.title}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center space-x-4 mb-4">
                          <Badge className="bg-blue-600/20 text-blue-400 border-blue-400">
                            {study.industry}
                          </Badge>
                          <div className="flex items-center space-x-2 text-blue-100">
                            <Building className="w-4 h-4" />
                            <span className="text-sm">{study.client}</span>
                          </div>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-3">{study.title}</h2>
                        <p className="text-blue-100">{study.description}</p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">Challenge</h4>
                          <p className="text-blue-100 text-sm">{study.challenge}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">Solution</h4>
                          <p className="text-blue-100 text-sm">{study.solution}</p>
                        </div>
                        
                        <div>
                          <h4 className="text-lg font-semibold text-blue-400 mb-2 flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2" />
                            Results
                          </h4>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-blue-400" />
                            <p className="text-blue-100 text-sm">{study.results}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CaseStudies;
