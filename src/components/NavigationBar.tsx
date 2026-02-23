import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AudioWaveform as Waveform, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import UserProfile from './UserProfile';

function NavigationBar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [activeSection, setActiveSection] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      if (location.pathname !== '/') return;

      const sections = ['about', 'features', 'pricing', 'faq', 'contact'];
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }

      if (window.scrollY < 100) {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const scrollToSection = (sectionId: string) => {
    setIsOpen(false);
    
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 64;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const menuItems = [
    { name: 'Home', id: '' },
    { name: 'About', id: 'about' },
    { name: 'Features', id: 'features' },
    { name: 'FAQ', id: 'faq' },
    { name: 'Contact Us', id: 'contact' }
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/90 backdrop-blur-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <Waveform className="h-8 w-8 text-blue-500" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  MELVA
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? 'text-white bg-blue-600'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              
              {user ? (
                <button
                  onClick={() => setShowProfile(true)}
                  className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
                >
                  <User className="h-5 w-5" />
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-colors"
                >
                  Get Started
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              >
                <span className="sr-only">Open menu</span>
                {isOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/90 backdrop-blur-sm">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full px-3 py-2 rounded-md text-base font-medium text-left ${
                  activeSection === item.id
                    ? 'text-white bg-blue-600'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                {item.name}
              </button>
            ))}
            
            {user ? (
              <button
                onClick={() => {
                  setShowProfile(true);
                  setIsOpen(false);
                }}
                className="block w-full px-3 py-2 rounded-md text-base font-medium text-left text-gray-300 hover:text-white hover:bg-gray-700"
              >
                Profile
              </button>
            ) : (
              <Link
                to="/auth"
                className="block px-3 py-2 rounded-md text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </nav>

      <UserProfile
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </>
  );
}

export default NavigationBar;