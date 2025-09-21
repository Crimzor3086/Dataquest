
import { Phone, Mail, MapPin, Youtube, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/images/ebe93ea9-d27c-4b65-a743-568137bd5494.png" 
                alt="DataQuest Solutions Logo" 
                className="w-8 h-8"
              />
              <h3 className="text-xl font-bold text-blue-400">DataQuest Solutions</h3>
            </div>
            <p className="text-blue-100 text-sm">
              Your premier gateway to programming, data science, and health research.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://web.facebook.com/share/g/1ETe2uPr36/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-5 h-5 text-blue-200 hover:text-blue-400 cursor-pointer transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://x.com/Dataquest123" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-5 h-5 text-blue-200 hover:text-blue-400 cursor-pointer transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <Youtube 
                className="w-5 h-5 text-blue-200 hover:text-blue-400 cursor-pointer transition-colors" 
                onClick={() => window.open('https://www.youtube.com/@dataquestsolutions-z9k', '_blank')} 
              />
              <Linkedin className="w-5 h-5 text-blue-200 hover:text-blue-400 cursor-pointer transition-colors" onClick={() => window.open('https://www.linkedin.com/groups/10084405/', '_blank')} />
              <Instagram className="w-5 h-5 text-blue-200 hover:text-blue-400 cursor-pointer transition-colors" onClick={() => window.open('https://www.instagram.com/dataquestsolutions/', '_blank')} />
              <a 
                href="https://www.tiktok.com/@dataquestsolution?is_from_webapp=1&sender_device=pc" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-5 h-5 text-blue-200 hover:text-blue-400 cursor-pointer transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.321 5.562a5.122 5.122 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.936-1.343-2.164-1.343-3.433V0h-3.282v16.877c0 .529-.069 1.036-.203 1.518a4.512 4.512 0 0 1-4.29 3.255c-2.493 0-4.513-2.02-4.513-4.512s2.02-4.513 4.513-4.513c.47 0 .922.073 1.346.207v-3.336a7.816 7.816 0 0 0-1.346-.118C4.04 8.378 0 12.418 0 17.4s4.04 9.022 9.022 9.022 9.022-4.04 9.022-9.022V8.859a9.173 9.173 0 0 0 5.347 1.712V7.289a6.07 6.07 0 0 1-4.07-1.727z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-blue-400">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/about" className="block text-blue-200 hover:text-blue-400 transition-colors">About Us</Link>
              <Link to="/courses" className="block text-blue-200 hover:text-blue-400 transition-colors">Courses</Link>
              <Link to="/services" className="block text-blue-200 hover:text-blue-400 transition-colors">Services</Link>
              <Link to="/consultation" className="block text-blue-200 hover:text-blue-400 transition-colors">Consultation</Link>
              <Link to="/team" className="block text-blue-200 hover:text-blue-400 transition-colors">Our Team</Link>
              <Link to="/blog" className="block text-blue-200 hover:text-blue-400 transition-colors">Blog</Link>
              <Link to="/resources" className="block text-blue-200 hover:text-blue-400 transition-colors">Resources</Link>
              <Link to="/projects" className="block text-blue-200 hover:text-blue-400 transition-colors">Projects</Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-blue-400">Our Services</h4>
            <div className="space-y-2">
              <Link to="/services" className="block text-blue-200 hover:text-blue-400 transition-colors text-sm">Data Analysis</Link>
              <Link to="/services" className="block text-blue-200 hover:text-blue-400 transition-colors text-sm">Machine Learning</Link>
              <Link to="/software-development" className="block text-blue-200 hover:text-blue-400 transition-colors text-sm">Software Development</Link>
              <Link to="/web-development" className="block text-blue-200 hover:text-blue-400 transition-colors text-sm">Web Development</Link>
              <Link to="/graphic-design" className="block text-blue-200 hover:text-blue-400 transition-colors text-sm">Graphic Design</Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-blue-400">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <div className="text-sm text-blue-200">
                  <p>+254 707 612 395</p>
                  <p>+254 701 344 230</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <div className="text-sm text-blue-200">
                  <p>dataquestsolutions2@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <div className="text-sm text-blue-200">
                  <p>Kakamega, Kenya</p>
                  <p>P.O. Box 190-50100</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-8 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-200 text-sm">
              © 2025 DataQuest Solutions. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/terms" className="text-blue-200 hover:text-blue-400 text-sm transition-colors">Terms of Service</Link>
              <Link to="/privacy" className="text-blue-200 hover:text-blue-400 text-sm transition-colors">Privacy Policy</Link>
              <Link to="/cookies" className="text-blue-200 hover:text-blue-400 text-sm transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
