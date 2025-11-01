import React, { useState, useEffect } from 'react';

interface PublicNavbarProps {
  onAdminClick: () => void;
}

const PublicNavbar: React.FC<PublicNavbarProps> = ({ onAdminClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-lg py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="cursor-pointer"
          >
            <div className={`transition-all duration-300 ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}>
              <div className="text-2xl font-bold tracking-wider">BKAAP</div>
              <div className="text-xs text-green-600 tracking-widest">CONSTRUÇÕES</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={`font-medium transition-colors ${
                isScrolled
                  ? 'text-gray-700 hover:text-green-600'
                  : 'text-white hover:text-green-400'
              }`}
            >
              Início
            </button>
            <button
              onClick={() => scrollToSection('sobre')}
              className={`font-medium transition-colors ${
                isScrolled
                  ? 'text-gray-700 hover:text-green-600'
                  : 'text-white hover:text-green-400'
              }`}
            >
              Sobre
            </button>
            <button
              onClick={() => scrollToSection('portfolio')}
              className={`font-medium transition-colors ${
                isScrolled
                  ? 'text-gray-700 hover:text-green-600'
                  : 'text-white hover:text-green-400'
              }`}
            >
              Portfólio
            </button>
            <button
              onClick={() => scrollToSection('contato')}
              className={`font-medium transition-colors ${
                isScrolled
                  ? 'text-gray-700 hover:text-green-600'
                  : 'text-white hover:text-green-400'
              }`}
            >
              Contato
            </button>
            <button
              onClick={onAdminClick}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105"
            >
              Área Admin
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled
                ? 'text-gray-700 hover:bg-gray-100'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 bg-white rounded-lg shadow-lg">
            <div className="flex flex-col space-y-4 px-4">
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setIsMobileMenuOpen(false);
                }}
                className="text-gray-700 hover:text-green-600 font-medium text-left py-2"
              >
                Início
              </button>
              <button
                onClick={() => scrollToSection('sobre')}
                className="text-gray-700 hover:text-green-600 font-medium text-left py-2"
              >
                Sobre
              </button>
              <button
                onClick={() => scrollToSection('portfolio')}
                className="text-gray-700 hover:text-green-600 font-medium text-left py-2"
              >
                Portfólio
              </button>
              <button
                onClick={() => scrollToSection('contato')}
                className="text-gray-700 hover:text-green-600 font-medium text-left py-2"
              >
                Contato
              </button>
              <button
                onClick={() => {
                  onAdminClick();
                  setIsMobileMenuOpen(false);
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-medium transition-all text-center"
              >
                Área Admin
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default PublicNavbar;
