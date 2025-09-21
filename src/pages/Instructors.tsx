
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Github, Linkedin, Instagram, Youtube, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const instructors = [
  {
    name: 'Enock Bereka',
    expertise: 'Lead Data Scientist',
    email: 'enock@dataquestsolutions.com',
    bio: 'Expert in machine learning with R, data analysis, time series analysis, and qualitative analysis.',
    image: '/images/71911584-6432-421a-96c8-e63d0e987c20.png',
    mode: 'Hybrid (Online & In-person)',
    experience: '2-3 years',
    specializations: ['Machine Learning', 'Data Analysis', 'Time Series Analysis', 'R Programming'],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/enock-bereka',
      github: 'https://github.com/Biosticianenoch',
      portfolio: 'https://enock-bereka-git-main-enocks-projects-27f604c8.vercel.app/'
    }
  },
  {
    name: 'Timothy Achala',
    expertise: 'AI Engineer',
    email: 'timothy@dataquestsolutions.com',
    bio: 'Specialist in predictive modeling with Python and advanced Excel for business intelligence.',
    image: '/images/4d807615-4c39-4a68-a88a-a444c0d31a87.png',
    mode: 'Online Sessions',
    experience: '2-3 years',
    specializations: ['Python Programming', 'Predictive Modeling', 'Business Intelligence', 'Excel Analytics'],
    socialLinks: {}
  },
  {
    name: 'Nobert Wakasala',
    expertise: 'Software Developer',
    email: 'nobert@dataquestsolutions.com',
    bio: 'Expert in statistical analysis with SPSS, data collection tools, and graphic design.',
    image: '/images/6794e2bc-3edb-4cf9-b7d1-7381dca4fcd4.png',
    mode: 'Live Sessions',
    experience: '2-3 years',
    specializations: ['Statistical Analysis', 'SPSS', 'Graphic Design', 'Data Collection'],
    socialLinks: {
      youtube: 'https://youtube.com/@nobertwakasala?si=QbODQMpPkRoRvHnC',
      linkedin: 'https://www.linkedin.com/in/nobert-wafula-b7b1782a2?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
      github: 'https://github.com/Nobert66'
    }
  },
  {
    name: 'Ogechi Koel',
    expertise: 'Biostatistician',
    email: 'ogechi@dataquestsolutions.com',
    bio: 'Specialist in spatial analysis, survival analysis, and epidemiological research methods.',
    image: '/images/1070566c-39d3-4e32-98df-7eb42af613bc.png',
    mode: 'Research Mentorship',
    experience: '2-3 years',
    specializations: ['Spatial Analysis', 'Survival Analysis', 'Epidemiology', 'Biostatistics'],
    socialLinks: {
      github: 'https://github.com/ogechikoel',
      linkedin: 'http://www.linkedin.com/in/ogechi-koel-4b90b92ab'
    }
  }
];

export default function InstructorsPage() {
  const navigate = useNavigate();

  const handleScheduleConsultation = () => {
    navigate('/consultation');
  };

  const handleBrowseCourses = () => {
    navigate('/courses');
  };

  const renderSocialLinks = (socialLinks: any) => {
    if (!socialLinks || Object.keys(socialLinks).length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {socialLinks.linkedin && (
          <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
            <Linkedin className="w-4 h-4" />
          </a>
        )}
        {socialLinks.github && (
          <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
            <Github className="w-4 h-4" />
          </a>
        )}
        {socialLinks.youtube && (
          <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
            <Youtube className="w-4 h-4" />
          </a>
        )}
        {socialLinks.portfolio && (
          <a href={socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
            <Globe className="w-4 h-4" />
          </a>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navigation />
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Our Expert Instructors</h1>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Meet our experienced team of instructors who bring real-world expertise and passion for teaching 
              to guide you through your learning journey in data science, programming, and research.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {instructors.map((instructor, i) => (
              <Card key={i} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-6">
                    <img 
                      src={instructor.image} 
                      alt={instructor.name} 
                      className="w-24 h-24 rounded-full object-cover border-2 border-blue-600"
                    />
                    <div className="flex-1">
                      <CardTitle className="text-white text-xl mb-1">{instructor.name}</CardTitle>
                      <CardDescription className="text-blue-400 font-semibold mb-2">{instructor.expertise}</CardDescription>
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 text-sm">{instructor.email}</span>
                      </div>
                      <Badge variant="outline" className="border-blue-400 text-blue-400">
                        {instructor.experience} experience
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{instructor.bio}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-white font-semibold mb-2">Specializations:</h4>
                    <div className="flex flex-wrap gap-2">
                      {instructor.specializations.map((spec, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-gray-700 text-gray-300">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-gray-400 mb-4">
                    <div>
                      <span className="font-semibold text-white">Teaching Mode:</span>
                      <span className="ml-2">{instructor.mode}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      {renderSocialLinks(instructor.socialLinks)}
                    </div>
                    <Button 
                      variant="outline" 
                      className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                    >
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="bg-blue-800/30 rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Learn from the Best?</h2>
            <p className="text-blue-200 mb-6 max-w-2xl mx-auto">
              Our instructors are ready to guide you through comprehensive courses in data science, 
              programming, and research methodologies. Join thousands of successful students.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-blue-600 hover:bg-blue-700" 
                size="lg"
                onClick={handleBrowseCourses}
              >
                Browse Courses
              </Button>
              <Button 
                variant="outline" 
                className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white" 
                size="lg"
                onClick={handleScheduleConsultation}
              >
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
