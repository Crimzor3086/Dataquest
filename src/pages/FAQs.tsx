import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, MessageCircle, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const FAQs = () => {
  const navigate = useNavigate();

  const handleEmailClick = () => {
    window.open('mailto:dataquestsolutions2@gmail.com?subject=Support Request&body=Hello DataQuest Solutions,%0D%0A%0D%0AI need help with:', '_blank');
  };

  const handleCallClick = () => {
    window.open('tel:+254707612395', '_blank');
  };

  const handleLiveChatClick = () => {
    // Redirect to WhatsApp for live chat
    const phoneNumber = "+254707612395";
    const message = "Hello! I need support with DataQuest Solutions services.";
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const faqCategories = [
    {
      title: 'General Questions',
      icon: HelpCircle,
      faqs: [
        {
          question: 'What is DataQuest Solutions?',
          answer: 'DataQuest Solutions is a leading data analytics and technology company based in Kenya, specializing in data science, software development, web development, graphic design, and consultation services. We help businesses transform their data into actionable insights.'
        },
        {
          question: 'Where are you located?',
          answer: 'We are based in Kenya and serve clients both locally and internationally. Our team works remotely and can collaborate with clients worldwide through digital platforms.'
        },
        {
          question: 'What industries do you serve?',
          answer: 'We serve a wide range of industries including healthcare, finance, education, retail, manufacturing, agriculture, and technology. Our solutions are customized to meet the specific needs of each industry.'
        }
      ]
    },
    {
      title: 'Services',
      icon: MessageCircle,
      faqs: [
        {
          question: 'What data analytics services do you offer?',
          answer: 'We offer comprehensive data analytics services including data collection and cleaning, statistical analysis, predictive modeling, data visualization, business intelligence setup, and AI/ML implementation.'
        },
        {
          question: 'Do you provide software development services?',
          answer: 'Yes, we offer full-stack software development services including web applications, mobile apps, desktop software, and custom enterprise solutions using modern technologies.'
        },
        {
          question: 'What consultation services are available?',
          answer: 'Our consultation services include data strategy development, analytics implementation guidance, AI/ML feasibility studies, and business intelligence setup. Prices range from KES 2,000 to 20,000 depending on the scope and complexity.'
        },
        {
          question: 'Do you offer graphic design services?',
          answer: 'Yes, we provide comprehensive graphic design services including logo design, branding, marketing materials, web design, and visual identity development.'
        }
      ]
    },
    {
      title: 'Training & Courses',
      icon: HelpCircle,
      faqs: [
        {
          question: 'What training courses do you offer?',
          answer: 'We offer various data science and analytics courses including Advanced Excel, Statistical Analysis with SPSS, Data Analysis with R, Machine Learning with R, Predictive Modeling with Python, and more. Check our Courses page for the complete list.'
        },
        {
          question: 'How much do courses cost?',
          answer: 'Course prices vary depending on the content and duration. Prices typically range from KES 15,000 to 50,000. Each course page shows the specific pricing.'
        },
        {
          question: 'How do I enroll in a course?',
          answer: 'You can enroll by visiting the course detail page and clicking the "Enroll Now" button. This will take you to our registration form where you can complete your enrollment and payment.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept PayPal (dataquestsolutions2@gmail.com), Mobile Money (+254 707 612 395), and bank transfers (Paybill: 522522, Account: 1340849054) for Kenyan students.'
        },
        {
          question: 'Do you provide certificates?',
          answer: 'Yes, all our courses include a certificate of completion. You will receive your certificate after successfully completing all course modules and assessments.'
        }
      ]
    },
    {
      title: 'Technical Support',
      icon: MessageCircle,
      faqs: [
        {
          question: 'What technologies do you work with?',
          answer: 'We work with a wide range of technologies including Python, R, JavaScript, React, Node.js, SQL databases, cloud platforms (AWS, Azure, GCP), and various data visualization tools like Tableau and Power BI.'
        },
        {
          question: 'Do you provide ongoing support?',
          answer: 'Yes, we provide ongoing support for all our services. Support levels vary depending on the service package, but we ensure our clients have access to help when needed.'
        },
        {
          question: 'How long do projects typically take?',
          answer: 'Project timelines vary based on scope and complexity. Simple analytics projects may take 2-4 weeks, while comprehensive software development projects can take 3-6 months. We provide detailed timelines during the consultation phase.'
        }
      ]
    },
    {
      title: 'Pricing & Payments',
      icon: HelpCircle,
      faqs: [
        {
          question: 'How do you price your services?',
          answer: 'Our pricing is based on project scope, complexity, timeline, and resource requirements. We provide detailed quotes after understanding your specific needs during the initial consultation.'
        },
        {
          question: 'Do you offer payment plans?',
          answer: 'Yes, for larger projects we can arrange payment plans and milestone-based payments. Contact us to discuss payment options that work for your budget.'
        },
        {
          question: 'Is there a money-back guarantee?',
          answer: 'We stand behind the quality of our work. If you\'re not satisfied with our services, we\'ll work with you to make it right. Specific terms depend on the service agreement.'
        }
      ]
    }
  ];

  return (
    <>
      <SEO 
        title="Frequently Asked Questions - DataQuest Solutions"
        description="Find answers to common questions about DataQuest Solutions' data analytics, software development, training courses, and consultation services."
        keywords={['FAQ', 'DataQuest Solutions questions', 'data analytics FAQ', 'course questions', 'support']}
        url="https://dataquestsolutions.com/faqs"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        <Navigation />
        
        {/* Hero Section */}
        <section className="py-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 animate-fade-in">
              Frequently Asked
              <span className="text-gradient bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Questions</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 mb-12 max-w-3xl mx-auto animate-fade-in-delay">
              Find answers to common questions about our services, courses, and support
            </p>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            {faqCategories.map((category, categoryIndex) => {
              const Icon = category.icon;
              return (
                <Card key={categoryIndex} className="mb-8 bg-blue-800/50 border-blue-700">
                  <CardHeader>
                    <CardTitle className="text-white text-2xl flex items-center">
                      <Icon className="w-6 h-6 mr-3 text-blue-400" />
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="space-y-4">
                      {category.faqs.map((faq, faqIndex) => (
                        <AccordionItem 
                          key={faqIndex} 
                          value={`${categoryIndex}-${faqIndex}`}
                          className="border-blue-600"
                        >
                          <AccordionTrigger className="text-left text-white hover:text-blue-300 text-lg">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-blue-200 text-base leading-relaxed">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Contact Support Section */}
        <section className="py-16 px-4 bg-blue-800/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Still Have Questions?</h2>
            <p className="text-xl text-blue-200 mb-8">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-blue-700/50 border-blue-600 cursor-pointer hover:bg-blue-700/70 transition-colors" onClick={handleEmailClick}>
                <CardContent className="p-6 text-center">
                  <Mail className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">Email Us</h3>
                  <p className="text-blue-200 text-sm">dataquestsolutions2@gmail.com</p>
                </CardContent>
              </Card>
              
              <Card className="bg-blue-700/50 border-blue-600 cursor-pointer hover:bg-blue-700/70 transition-colors" onClick={handleCallClick}>
                <CardContent className="p-6 text-center">
                  <Phone className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">Call Us</h3>
                  <p className="text-blue-200 text-sm">+254 707 612 395</p>
                  <p className="text-blue-200 text-sm">+254 701 344 230</p>
                </CardContent>
              </Card>
              
              <Card className="bg-blue-700/50 border-blue-600 cursor-pointer hover:bg-blue-700/70 transition-colors" onClick={handleLiveChatClick}>
                <CardContent className="p-6 text-center">
                  <MessageCircle className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">Live Chat</h3>
                  <p className="text-blue-200 text-sm">Available via WhatsApp</p>
                </CardContent>
              </Card>
            </div>

            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
              onClick={() => navigate('/contacts')}
            >
              Contact Support
            </Button>
          </div>
        </section>
        
        <Footer />
      </div>
    </>
  );
};

export default FAQs;
