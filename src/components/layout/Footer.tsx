import React from 'react';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../config/site';
import { Mail, Phone, MessageSquare, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { contact, social, copyrightYear } = siteConfig;

  const coreServices = [
    { name: 'Web Development', href: '/services/web-development' },
    { name: 'Business Software & Automation', href: '/services/business-software-automation' },
    { name: 'School Management Systems', href: '/services/school-management-systems' },
    { name: 'AI Integrations & Solutions', href: '/services/ai-solutions' },
    { name: 'Mobile App Development', href: '/services/mobile-app-development' },
    { name: 'Hosting, Domains & Email', href: '/services/hosting-domains-email' },
    { name: 'E-commerce Development', href: '/services/ecommerce' },
    { name: 'Custom Digital Solutions', href: '/services/custom-solutions' },
  ];

  const quickLinks = [
    { name: 'Services Overview', href: '/services' },
    { name: 'Portfolio & Projects', href: '/portfolio' },
    { name: 'About JUANET.cloud', href: '/about' },
    { name: 'Contact Options', href: '/contact' },
    { name: 'Request a Quote', href: '/request-service' },
    { name: 'Book a Consultation', href: '/book-consultation' },
  ];

  return (
    <footer className="w-full bg-[#070D1E] border-t border-slate-800 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          
          {/* Brand Column (2 cols on large screen) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 text-white font-bold text-lg">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white shadow-sm ring-1 ring-white/10">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4v9a4 4 0 0 0 8 0V4" />
                  <path d="M12 13a4 4 0 0 0 8-4" />
                </svg>
              </div>
              <span className="text-xl tracking-tight font-extrabold text-white">
                JUANET<span className="text-purple-400 font-semibold">.cloud</span>
              </span>
            </Link>

            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              <strong className="text-white">Know the Internet. Build What's Next.</strong>
              <br />
              A modern digital solutions partner helping businesses, schools, and organizations turn ideas into dependable digital infrastructure.
            </p>

            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              {siteConfig.brandMeaning}
            </p>

            {/* Social Links (only if configured) */}
            {(social.linkedin || social.twitter || social.github) && (
              <div className="flex items-center gap-4 pt-2">
                {social.linkedin && (
                  <a
                    href={social.linkedin}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    LinkedIn
                  </a>
                )}
                {social.twitter && (
                  <a
                    href={social.twitter}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    X (Twitter)
                  </a>
                )}
                {social.github && (
                  <a
                    href={social.github}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    GitHub
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Services Column */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Digital Services
            </h3>
            <ul className="space-y-2.5 text-xs">
              {coreServices.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.href}
                    className="hover:text-purple-300 transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation & Company Column */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-xs">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="hover:text-purple-300 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details (Display only verified supplied details) */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Get in Touch
            </h3>

            <div className="space-y-3 text-xs">
              {contact.email ? (
                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-slate-300 hover:text-white transition-colors break-all"
                  >
                    {contact.email}
                  </a>
                </div>
              ) : null}

              {contact.phoneDisplay ? (
                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    {contact.phoneDisplay}
                  </a>
                </div>
              ) : null}

              {contact.whatsappNumber ? (
                <div className="flex items-start gap-2.5">
                  <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <a
                    href={`https://wa.me/${contact.whatsappNumber}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-slate-300 hover:text-white transition-colors"
                  >
                    WhatsApp Chat
                  </a>
                </div>
              ) : null}

              {contact.physicalLocation ? (
                <div className="text-slate-400 text-xs pt-1">
                  <span className="text-slate-300 font-medium">Operations:</span> {contact.physicalLocation}
                </div>
              ) : null}

              <div className="pt-2">
                <Link
                  to="/request-service"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300"
                >
                  <span>Submit project inquiry</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {copyrightYear} JUANET.cloud. All rights reserved.
          </div>
          
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <a href="https://juanet.cloud" className="hover:text-slate-300 transition-colors">
              juanet.cloud
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
