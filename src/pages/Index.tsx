
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SEO from '@/components/SEO';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { CheckCircle, Users } from 'lucide-react';

const Index = () => {
  return (
    <>
      <SEO 
        title="DataQuest Solutions - Leading Data Analytics & Training Company in Kenya"
        description="Transform your business with expert data analytics services. We offer machine learning, business intelligence, data visualization, and professional training courses in Kenya. Get data-driven insights today."
        keywords={['data analytics Kenya', 'machine learning training', 'business intelligence', 'data science courses', 'analytics consulting Nairobi', 'Python training', 'data visualization']}
        url="https://dataquestsolutions.com"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        <Navigation />
        <WhatsAppButton />
        
        {/* Hero Section */}
        <section className="py-20 px-4 text-center">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 animate-fade-in">
              Transform Your Data Into
              <span className="text-gradient bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Actionable Insights</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 mb-12 max-w-4xl mx-auto animate-fade-in-delay">
              At DataQuest Solutions, we blend expertise with innovation to deliver impactful data solutions. Our commitment is to empower individuals and organizations by transforming data into actionable insights for sustainable growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2">
              <Link to="/services">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                  Explore Our Services
                </Button>
              </Link>
              <Link to="/courses">
                <Button size="lg" variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-4 text-lg">
                  View Training Courses
                </Button>
              </Link>
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
                onClick={() => window.open('https://chat.whatsapp.com/DKI1ubJLrci6H3yehfEInM', '_blank')}
              >
                <Users className="w-5 h-5 mr-2" />
                Join Our Community
              </Button>
            </div>
          </div>
        </section>

        {/* Services Section with Images */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-8 text-center">Our Expertise</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Service 1 - Data Analytics */}
              <div className="bg-blue-800/50 rounded-lg p-6 hover:scale-105 transition-transform duration-300">
                <div className="mb-4">
                  <img 
                    src="/images/ffdd5d5f-ff99-4e0d-ba6d-4192da94e09c.png" 
                    alt="Data Analytics" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Data Analytics</h3>
                <p className="text-blue-200">
                  Unlock the power of your data with our comprehensive analytics services.
                  We transform raw data into actionable insights.
                </p>
                <Link to="/services" className="mt-4 inline-block text-blue-400 hover:text-blue-300">
                  Learn More →
                </Link>
              </div>
              {/* Service 2 - Machine Learning */}
              <div className="bg-blue-800/50 rounded-lg p-6 hover:scale-105 transition-transform duration-300">
                <div className="mb-4">
                  <img 
                    src="/images/a653b6e1-a38a-430d-8785-019de9c19d47.png" 
                    alt="Machine Learning" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Machine Learning</h3>
                <p className="text-blue-200">
                  Leverage AI to automate processes, predict outcomes, and gain a competitive edge.
                  Our machine learning solutions are tailored to your unique needs.
                </p>
                <Link to="/services" className="mt-4 inline-block text-blue-400 hover:text-blue-300">
                  Learn More →
                </Link>
              </div>
              {/* Service 3 - Business Intelligence */}
              <div className="bg-blue-800/50 rounded-lg p-6 hover:scale-105 transition-transform duration-300">
                <div className="mb-4">
                  <img 
                    src="/images/16bdb1d6-8116-41db-970d-c8e828056c83.png" 
                    alt="Business Intelligence" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Business Intelligence</h3>
                <p className="text-blue-200">
                  Make informed decisions with our BI solutions. We provide interactive dashboards
                  and reporting to monitor your business performance.
                </p>
                <Link to="/services" className="mt-4 inline-block text-blue-400 hover:text-blue-300">
                  Learn More →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-blue-700/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-8 text-center">Why Choose Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Feature 1 */}
              <div className="flex items-start">
                <CheckCircle className="w-8 h-8 text-green-400 mr-4" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Expert Team</h3>
                  <p className="text-blue-200">
                    Our team comprises experienced data scientists, engineers, and consultants
                    dedicated to delivering exceptional results.
                  </p>
                </div>
              </div>
              {/* Feature 2 */}
              <div className="flex items-start">
                <CheckCircle className="w-8 h-8 text-green-400 mr-4" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Custom Solutions</h3>
                  <p className="text-blue-200">
                    We understand that every business is unique. That's why we tailor our solutions
                    to meet your specific needs and objectives.
                  </p>
                </div>
              </div>
              {/* Feature 3 */}
              <div className="flex items-start">
                <CheckCircle className="w-8 h-8 text-green-400 mr-4" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Proven Track Record</h3>
                  <p className="text-blue-200">
                    We have a proven track record of helping businesses across various industries
                    transform their data into actionable insights and achieve tangible results.
                  </p>
                </div>
              </div>
              {/* Feature 4 */}
              <div className="flex items-start">
                <CheckCircle className="w-8 h-8 text-green-400 mr-4" />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Comprehensive Training</h3>
                  <p className="text-blue-200">
                    We offer comprehensive training programs to equip your team with the skills
                    and knowledge to leverage data effectively.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Training & Consultation Section with Images */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-8 text-center">Training & Consultation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Training */}
              <div className="bg-blue-800/50 rounded-lg p-6">
                <div className="mb-4">
                  <img 
                    src="/images/37895379-988b-4ab8-a3e1-823ff39500c8.png" 
                    alt="Training Programs" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Professional Training</h3>
                <p className="text-blue-200">
                  Our comprehensive training programs cover essential skills in data analysis,
                  machine learning, and statistical methods for real-world applications.
                </p>
                <Link to="/courses" className="mt-4 inline-block text-blue-400 hover:text-blue-300">
                  Explore Courses →
                </Link>
              </div>
              {/* Consultation */}
              <div className="bg-blue-800/50 rounded-lg p-6">
                <div className="mb-4">
                  <img 
                    src="/images/65cddcef-8a87-4469-9246-4f7e983cc0e1.png" 
                    alt="Consultation Services" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">Expert Consultation</h3>
                <p className="text-blue-200">
                  Get strategic guidance from our experts across various domains including
                  health, data science, and software development fields.
                </p>
                <Link to="/consultation" className="mt-4 inline-block text-blue-400 hover:text-blue-300">
                  Learn More →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-8">What Our Clients Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Testimonial 1 - Joy Consolate with image */}
              <div className="bg-blue-800/50 rounded-lg p-6 flex flex-col items-center">
                <img 
                  src="/images/251fdfb2-1910-4939-8012-6960254ddb4c.png"
                  alt="Joy Consolate"
                  className="w-20 h-20 object-cover rounded-full mb-4 border-4 border-white shadow-lg"
                />
                <p className="text-lg text-blue-200 italic mb-4">
                  "Working with DataQuest Solutions transformed our approach to data management. Their professional
                  consultation and hands-on training gave our team the confidence to implement advanced analytics."
                </p>
                <p className="text-blue-400 font-semibold">- Joy Consolate, Operations Manager</p>
              </div>
              {/* Testimonial 2 - Faith Jepkoech with image */}
              <div className="bg-blue-800/50 rounded-lg p-6 flex flex-col items-center">
                <img 
                  src="/images/ac5302a4-1235-4250-ae61-e5925093e461.png"
                  alt="Faith Jepkoech"
                  className="w-20 h-20 object-cover rounded-full mb-4 border-4 border-white shadow-lg"
                />
                <p className="text-lg text-blue-200 italic mb-4">
                  "DataQuest Solutions has been instrumental in helping us understand our customers
                  better and optimize our marketing campaigns. Their expertise is unmatched."
                </p>
                <p className="text-blue-400 font-semibold">- Faith Jepkoech, Marketing Director</p>
              </div>
              {/* Testimonial 3 - Dan Barasa with image */}
              <div className="bg-blue-800/50 rounded-lg p-6 flex flex-col items-center">
                <img 
                  src="/images/51eef821-7a41-4f56-add1-11057cbdcbe9.png"
                  alt="Dan Barasa"
                  className="w-20 h-20 object-cover rounded-full mb-4 border-4 border-white shadow-lg"
                />
                <p className="text-lg text-blue-200 italic mb-4">
                  "The consultation services from DataQuest Solutions were exceptional. They provided clear insights
                  and practical solutions that helped us streamline our business processes effectively."
                </p>
                <p className="text-blue-400 font-semibold">- Dan Barasa, Business Analyst</p>
              </div>
              {/* Testimonial 4 - Nockris Joshua with uploaded image */}
              <div className="bg-blue-800/50 rounded-lg p-6 flex flex-col items-center">
                <img 
                  src="/images/c5eb503e-ceed-418d-8bd7-e65568c5b7cd.png"
                  alt="Nockris Joshua"
                  className="w-20 h-20 object-cover rounded-full mb-4 border-4 border-white shadow-lg"
                />
                <p className="text-lg text-blue-200 italic mb-4">
                  "The training courses provided by DataQuest Solutions have significantly improved
                  our team's data analysis skills. We are now able to make data-driven decisions with confidence."
                </p>
                <p className="text-blue-400 font-semibold">- Nockris Joshua, CEO</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-24 px-4 text-center">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-5xl font-bold text-white mb-8 animate-pulse">
              Ready to Transform Your Business with Data?
            </h2>
            <p className="text-xl text-blue-200 mb-12">
              Contact us today to learn more about our services and how we can help you achieve
              your business goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/contacts">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg">
                  Get in Touch
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline"
                className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-4 text-lg"
                onClick={() => window.open('https://chat.whatsapp.com/DKI1ubJLrci6H3yehfEInM', '_blank')}
              >
                <Users className="w-5 h-5 mr-2" />
                Join DataQuest Community
              </Button>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    </>
  );
};

export default Index;
