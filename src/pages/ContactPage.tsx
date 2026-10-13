import React from 'react';
import { Link } from 'react-router-dom';
import { ContactForm } from '../components/forms/ContactForm';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { siteConfig } from '../config/site';
import {
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { contact } = siteConfig;

  return (
    <div className="w-full py-10 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Contact & Inquiries' }]} />

        {/* Page Header */}
        <div className="mt-4 mb-12 space-y-3 max-w-3xl">
          <span className="text-xs font-bold text-purple-400 tracking-wider uppercase">
            Let's Connect
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Contact JUANET.cloud
          </h1>
          <p className="text-base text-slate-300 leading-relaxed">
            Have a question, request, or technical brief? Reach out directly using our contact form or our direct communication channels.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Functional Contact Form (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl bg-[#0F172A] border border-slate-800 p-6 sm:p-8 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-1 tracking-tight">
              Send Us a Message
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Fill out this form and our engineering team will respond within 1 business day.
            </p>

            <ContactForm />
          </div>

          {/* Right Column: Direct Channels & Consultation Callout (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Consultation Quick Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-950/50 via-[#0F172A] to-slate-900 border border-purple-800/50 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400">
                <Calendar className="w-5 h-5" />
              </div>

              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Need an Exploratory Consultation?
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  If you need guidance on technical feasibility, system architecture, or scoping before writing requirements, schedule a dedicated consultation.
                </p>
              </div>

              <Link
                to="/book-consultation"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-300 hover:text-white"
              >
                <span>Request a Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Direct Communication Channels (Only verified supplied data displayed) */}
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
                Direct Channels
              </h3>

              <div className="space-y-3.5 text-xs">
                {contact.email ? (
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-[11px]">Primary Email</span>
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-white hover:text-purple-300 transition-colors font-medium break-all"
                      >
                        {contact.email}
                      </a>
                    </div>
                  </div>
                ) : null}

                {contact.phoneDisplay ? (
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-[11px]">Direct Telephone</span>
                      <a
                        href={`tel:${contact.phone}`}
                        className="text-white hover:text-purple-300 transition-colors font-medium"
                      >
                        {contact.phoneDisplay}
                      </a>
                    </div>
                  </div>
                ) : null}

                {contact.whatsappNumber ? (
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-[11px]">WhatsApp Business</span>
                      <a
                        href={`https://wa.me/${contact.whatsappNumber}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-white hover:text-emerald-300 transition-colors font-medium"
                      >
                        {contact.whatsappDisplay || 'Open WhatsApp Chat'}
                      </a>
                    </div>
                  </div>
                ) : null}

                {contact.physicalLocation ? (
                  <div className="pt-2 border-t border-slate-800/80 text-slate-300">
                    <span className="text-slate-400 block text-[11px]">Operational Coverage</span>
                    <span>{contact.physicalLocation}</span>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Privacy & Security note */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Your submitted messages are encrypted in transit and never shared with commercial advertising brokers. Review our{' '}
                <Link to="/privacy" className="text-purple-400 underline hover:text-purple-300">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
