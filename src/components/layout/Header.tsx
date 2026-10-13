import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, ChevronDown } from 'lucide-react';
import { siteConfig } from '../../config/site';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services', hasDropdown: true },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const quickServices = [
    { name: 'Web Development', slug: 'web-development' },
    { name: 'Business Software & Automation', slug: 'business-software-automation' },
    { name: 'School Management Systems', slug: 'school-management-systems' },
    { name: 'AI Integrations & Solutions', slug: 'ai-solutions' },
    { name: 'Mobile App Development', slug: 'mobile-app-development' },
    { name: 'Hosting, Domains & Email', slug: 'hosting-domains-email' },
    { name: 'E-commerce Development', slug: 'ecommerce' },
    { name: 'All 12 Services →', slug: '', isAll: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0B132B]/95 backdrop-blur-md border-b border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-8">
          
          {/* Zone 1: Single Brand Wordmark & Monogram */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 group focus-visible:ring-2 focus-visible:ring-purple-500 rounded-md py-1"
            aria-label="JUANET.cloud Home"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white shadow-sm ring-1 ring-white/10 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4v9a4 4 0 0 0 8 0V4" />
                <path d="M12 13a4 4 0 0 0 8-4" />
              </svg>
            </div>
            <span className="text-xl tracking-tight font-extrabold text-white">
              JUANET<span className="text-purple-400 font-semibold">.cloud</span>
            </span>
          </Link>

          {/* Zone 2: Clean 4–5 single-line navigation links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.href);

              if (link.hasDropdown) {
                return (
                  <div
                    key={link.label}
                    className="relative group"
                    onMouseEnter={() => setServicesDropdownOpen(true)}
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                  >
                    <Link
                      to={link.href}
                      className={`flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 py-2 ${
                        isActive ? 'text-purple-400 font-semibold' : 'hover:text-white'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
                    </Link>

                    {/* Dropdown Menu */}
                    {servicesDropdownOpen && (
                      <div className="absolute top-full left-0 w-72 pt-1 z-50">
                        <div className="bg-[#0F172A] border border-slate-700/80 rounded-xl shadow-2xl p-2.5 backdrop-blur-xl ring-1 ring-white/5">
                          <div className="text-[11px] font-semibold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
                            Core Capabilities
                          </div>
                          {quickServices.map((srv) => (
                            <Link
                              key={srv.slug || 'all'}
                              to={srv.isAll ? '/services' : `/services/${srv.slug}`}
                              className={`block px-3 py-2 text-xs rounded-lg transition-colors ${
                                srv.isAll
                                  ? 'text-purple-400 font-semibold hover:bg-purple-950/40 mt-1 border-t border-slate-800'
                                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                              }`}
                            >
                              {srv.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`transition-colors whitespace-nowrap shrink-0 py-2 border-b-2 ${
                    isActive
                      ? 'border-purple-400 text-purple-400 font-semibold'
                      : 'border-transparent hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Link
              to="/request-service"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-500 active:bg-purple-700 transition-all shadow-sm shadow-purple-900/40 whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-purple-400"
            >
              <span>Request a Quote</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg focus-visible:ring-2 focus-visible:ring-purple-400"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Responsive Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0F172A] px-4 pt-3 pb-6 animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-2 text-base font-medium">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg ${
                location.pathname === '/' ? 'bg-purple-900/30 text-purple-400' : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              Home
            </Link>
            <Link
              to="/services"
              className={`px-3 py-2 rounded-lg ${
                location.pathname.startsWith('/services') ? 'bg-purple-900/30 text-purple-400' : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              Services (All 12)
            </Link>
            <Link
              to="/portfolio"
              className={`px-3 py-2 rounded-lg ${
                location.pathname.startsWith('/portfolio') ? 'bg-purple-900/30 text-purple-400' : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              Portfolio & Work
            </Link>
            <Link
              to="/about"
              className={`px-3 py-2 rounded-lg ${
                location.pathname === '/about' ? 'bg-purple-900/30 text-purple-400' : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              About JUANET.cloud
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-2 rounded-lg ${
                location.pathname === '/contact' ? 'bg-purple-900/30 text-purple-400' : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              Contact
            </Link>
            
            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <Link
                to="/request-service"
                className="w-full text-center py-2.5 px-4 text-sm font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors"
              >
                Request a Quote
              </Link>
              <Link
                to="/book-consultation"
                className="w-full text-center py-2.5 px-4 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Book a Consultation
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
