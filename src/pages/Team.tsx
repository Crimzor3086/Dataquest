
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Github, Linkedin, Instagram, Youtube, Globe } from 'lucide-react';

const Team = () => {
  const teamMembers = [
    {
      name: 'Enock Bereka',
      role: 'Lead Data Scientist',
      specialization: 'Machine Learning & Data Analysis',
      experience: '2-3 years',
      education: 'MSc Data Science',
      description: 'Expert in machine learning with R, data analysis, time series analysis, and qualitative analysis.',
      image: '/images/d045b4ea-20be-44b1-8e5c-e2ba3ceb1c76.png',
      socialLinks: {
        facebook: 'https://web.facebook.com/EnockDataQuest',
        linkedin: 'https://www.linkedin.com/in/enock-bereka',
        tiktok: 'https://www.tiktok.com/@dataquestsolution?is_from_webapp=1&sender_device=pc',
        instagram: 'https://www.instagram.com/enockdataquest/',
        twitter: 'https://x.com/biostician',
        portfolio: 'https://enock-bereka-git-main-enocks-projects-27f604c8.vercel.app/',
        github: 'https://github.com/Biosticianenoch'
      }
    },
    {
      name: 'Timothy Achala',
      role: 'AI Engineer',
      specialization: 'Python & Predictive Modeling',
      experience: '2-3 years',
      education: 'BS Computer Science',
      description: 'Specialist in predictive modeling with Python and advanced Excel for business intelligence.',
      image: '/images/4d807615-4c39-4a68-a88a-a444c0d31a87.png'
    },
    {
      name: 'Nobert Wakasala',
      role: 'Software Developer',
      specialization: 'Statistical Analysis & Design',
      experience: '2-3 years',
      education: 'BS Information Technology',
      description: 'Expert in statistical analysis with SPSS, data collection tools, and graphic design.',
      image: '/images/6794e2bc-3edb-4cf9-b7d1-7381dca4fcd4.png',
      socialLinks: {
        youtube: 'https://youtube.com/@nobertwakasala?si=QbODQMpPkRoRvHnC',
        linkedin: 'https://www.linkedin.com/in/nobert-wafula-b7b1782a2?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
        tiktok: 'https://www.tiktok.com/@nobert.wafula4?_t=ZM-8wXj8zEUX70&_r=1',
        github: 'https://github.com/Nobert66'
      }
    },
    {
      name: 'Ogechi Koel',
      role: 'Biostatistician',
      specialization: 'Spatial & Survival Analysis',
      experience: '2-3 years',
      education: 'MSc Biostatistics',
      description: 'Specialist in spatial analysis, survival analysis, and epidemiological research methods.',
      image: '/images/1070566c-39d3-4e32-98df-7eb42af613bc.png',
      socialLinks: {
        github: 'https://github.com/ogechikoel',
        linkedin: 'http://www.linkedin.com/in/ogechi-koel-4b90b92ab'
      }
    }
  ];

  const departments = [
    { name: 'Data Science', count: 2, color: 'bg-blue-600' },
    { name: 'AI Engineering', count: 1, color: 'bg-blue-500' },
    { name: 'Software Dev', count: 1, color: 'bg-blue-700' },
    { name: 'Biostatistics', count: 1, color: 'bg-blue-400' }
  ];

  const renderSocialLinks = (socialLinks: any) => {
    if (!socialLinks) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {socialLinks.facebook && (
          <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
        )}
        {socialLinks.linkedin && (
          <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
            <Linkedin className="w-4 h-4" />
          </a>
        )}
        {socialLinks.instagram && (
          <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
            <Instagram className="w-4 h-4" />
          </a>
        )}
        {socialLinks.youtube && (
          <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
            <Youtube className="w-4 h-4" />
          </a>
        )}
        {socialLinks.github && (
          <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
            <Github className="w-4 h-4" />
          </a>
        )}
        {socialLinks.portfolio && (
          <a href={socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
            <Globe className="w-4 h-4" />
          </a>
        )}
        {socialLinks.twitter && (
          <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        )}
        {socialLinks.tiktok && (
          <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.321 5.562a5.122 5.122 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.936-1.343-2.164-1.343-3.433V0h-3.282v16.877c0 .529-.069 1.036-.203 1.518a4.512 4.512 0 0 1-4.29 3.255c-2.493 0-4.513-2.02-4.513-4.512s2.02-4.513 4.513-4.513c.47 0 .922.073 1.346.207v-3.336a7.816 7.816 0 0 0-1.346-.118C4.04 8.378 0 12.418 0 17.4s4.04 9.022 9.022 9.022 9.022-4.04 9.022-9.022V8.859a9.173 9.173 0 0 0 5.347 1.712V7.289a6.07 6.07 0 0 1-4.07-1.727z"/>
            </svg>
          </a>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      <Navigation />
      <WhatsAppButton />
      
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl font-bold text-white mb-6">Our Expert Team</h1>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Meet the brilliant minds behind DataQuest Solutions - a dedicated team of data scientists, 
              AI engineers, and specialists committed to delivering innovative solutions.
            </p>
          </div>

          {/* Department Overview */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Team Structure</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {departments.map((dept, index) => (
                <Card key={index} className="bg-blue-800/50 border-blue-700 text-center">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 ${dept.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <span className="text-white font-bold">{dept.count}</span>
                    </div>
                    <h3 className="text-white font-semibold">{dept.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Team Members */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Our Team</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="bg-blue-800/50 border-blue-700 hover:bg-blue-800/70 transition-all duration-300 animate-scale-in">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-white font-bold text-lg">{member.name}</h3>
                        <p className="text-blue-400 font-semibold">{member.role}</p>
                      </div>
                    </div>
                    
                    <p className="text-blue-200 text-sm mb-4">{member.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-300">Specialization:</span>
                        <span className="text-blue-100">{member.specialization}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-300">Experience:</span>
                        <span className="text-blue-100">{member.experience}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-300">Education:</span>
                        <span className="text-blue-100">{member.education}</span>
                      </div>
                    </div>
                    
                    <Badge className="bg-blue-600/20 text-blue-400 border-blue-400 mb-3">
                      {member.specialization}
                    </Badge>
                    
                    {renderSocialLinks(member.socialLinks)}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Culture & Values */}
          <div className="bg-blue-800/30 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <h3 className="text-white text-xl font-semibold mb-4">Excellence</h3>
                <p className="text-blue-200">
                  We strive for excellence in everything we do, from education to research.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-white text-xl font-semibold mb-4">Innovation</h3>
                <p className="text-blue-200">
                  We embrace new ideas and technologies to push the boundaries of what is possible.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-white text-xl font-semibold mb-4">Collaboration</h3>
                <p className="text-blue-200">
                  We believe in the power of working together to achieve greater results.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-white text-xl font-semibold mb-4">Integrity</h3>
                <p className="text-blue-200">
                  We maintain the highest standards of integrity in our work and relationships.
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

export default Team;
