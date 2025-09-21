import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import WhatsAppButton from './WhatsAppButton';
import ProfileDropdown from './ProfileDropdown';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isBlogOpen, setIsBlogOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    await signOut();
    closeMenu();
  };

  const navigationItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { 
      name: 'Services', 
      path: '/services',
      hasDropdown: true,
      dropdownItems: [
        { name: 'All Services', path: '/services' },
        { name: 'Software Development', path: '/software-development' },
        { name: 'Web Development', path: '/web-development' },
        { name: 'Graphic Design', path: '/graphic-design' },
        { name: 'Consultation', path: '/consultation' },
      ]
    },
    { name: 'Courses', path: '/courses' },
    { name: 'Team', path: '/team' },
    { name: 'Resources', path: '/resources' },
    { name: 'Webinars', path: '/webinars' },
    { 
      name: 'Blog', 
      path: '/blog',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Blog Posts', path: '/blog' },
        { name: 'FAQs', path: '/faqs' },
      ]
    },
    { name: 'Contact', path: '/contacts' },
    { name: 'Admin', path: '/admin', adminOnly: true }
  ];

  // Filter navigation items based on user role
  const filteredNavigationItems = navigationItems.filter(item => {
    if (item.adminOnly) {
      return user && user.email === 'enochosenwafulah@gmail.com';
    }
    return true;
  });

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/images/ebe93ea9-d27c-4b65-a743-568137bd5494.png" 
                alt="DataQuest Solutions Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-lg sm:text-xl font-bold text-blue-600 whitespace-nowrap">DataQuest Solutions</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {filteredNavigationItems.map((item) => (
              <div key={item.name} className="relative">
                {item.hasDropdown ? (
                  <div className="relative group">
                    <button
                      className={`flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        isActive(item.path) ? 'text-blue-600' : ''
                      }`}
                      onMouseEnter={() => {
                        if (item.name === 'Services') setIsServicesOpen(true);
                        if (item.name === 'Blog') setIsBlogOpen(true);
                      }}
                      onMouseLeave={() => {
                        if (item.name === 'Services') setIsServicesOpen(false);
                        if (item.name === 'Blog') setIsBlogOpen(false);
                      }}
                    >
                      <span>{item.name}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                        (item.name === 'Services' && isServicesOpen) || (item.name === 'Blog' && isBlogOpen) ? 'rotate-180' : ''
                      }`} />
                    </button>
                    <div
                      className={`absolute top-full left-0 w-48 bg-white shadow-xl rounded-lg py-2 border border-gray-100 transition-all duration-200 z-50 ${
                        (item.name === 'Services' && isServicesOpen) || (item.name === 'Blog' && isBlogOpen) ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                      }`}
                      onMouseEnter={() => {
                        if (item.name === 'Services') setIsServicesOpen(true);
                        if (item.name === 'Blog') setIsBlogOpen(true);
                      }}
                      onMouseLeave={() => {
                        if (item.name === 'Services') setIsServicesOpen(false);
                        if (item.name === 'Blog') setIsBlogOpen(false);
                      }}
                    >
                      {item.dropdownItems?.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          to={dropdownItem.path}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive(item.path) ? 'text-blue-600' : ''
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            
            {/* Profile Dropdown */}
            <div className="ml-4">
              <ProfileDropdown />
            </div>
            
            <div className="ml-2">
              <WhatsAppButton />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-3">
            <WhatsAppButton />
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600 transition-colors duration-200 p-2 rounded-md hover:bg-gray-100"
              aria-label="Toggle mobile menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="px-4 pt-4 pb-6 space-y-2 bg-white border-t border-gray-200 shadow-lg">
            {filteredNavigationItems.map((item) => (
              <div key={item.name}>
                {item.hasDropdown ? (
                  <>
                    <Link
                      to={item.path}
                      onClick={closeMenu}
                      className={`block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 ${
                        isActive(item.path) ? 'text-blue-600 bg-blue-50' : ''
                      }`}
                    >
                      {item.name}
                    </Link>
                    <div className="pl-4 space-y-1">
                      {item.dropdownItems?.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          to={dropdownItem.path}
                          onClick={closeMenu}
                          className="block px-4 py-2 rounded-lg text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.path}
                    onClick={closeMenu}
                    className={`block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 ${
                      isActive(item.path) ? 'text-blue-600 bg-blue-50' : ''
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            
            {/* Mobile Profile Dropdown */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
