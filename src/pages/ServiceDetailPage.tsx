import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link, Navigate } from 'react-router-dom';
import { getServiceBySlug, getServices } from '../lib/supabase/services';
import { Service, ServiceSlug } from '../types';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { ServiceIcon } from '../components/ui/ServiceIcon';
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Calendar,
  Layers,
} from 'lucide-react';

export const ServiceDetailPage: React.FC = () => {
  const { slug: paramSlug } = useParams<{ slug: string }>();
  const location = useLocation();
  // Extract slug from either param or path
  const slug =
    paramSlug ||
    location.pathname.replace(/^\/services\//, '').split('/')[0] ||
    '';

  const [service, setService] = useState<Service | null>(null);
  const [relatedList, setRelatedList] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      setLoading(true);
      try {
        const current = await getServiceBySlug(slug);
        setService(current);

        if (current && current.relatedServices.length > 0) {
          const all = await getServices();
          const related = all.filter((s) => current.relatedServices.includes(s.slug));
          setRelatedList(related);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs">Loading service information...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Service Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">
          The requested service page does not exist or may have been renamed.
        </p>
        <Link
          to="/services"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-500"
        >
          <span>Return to Services Catalog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full py-10 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Services', href: '/services' },
            { label: service.name },
          ]}
        />

        {/* Hero Section */}
        <div className="mt-4 mb-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8 space-y-5">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider">
              <span className="w-7 h-7 rounded-lg bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400">
                <ServiceIcon iconKey={service.iconKey} className="w-4 h-4" />
              </span>
              <span>{service.category}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
              {service.headline}
            </h1>

            <p className="text-base text-slate-300 leading-relaxed max-w-2xl">
              {service.fullDescription}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to={`/request-service?service=${service.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-500 active:bg-purple-700 transition-all shadow-md shadow-purple-950/50"
              >
                <span>Request a Quote for {service.name}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to={`/book-consultation?topic=${service.slug}`}
                className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-medium text-slate-200 bg-slate-900/90 hover:bg-slate-800 hover:text-white rounded-lg border border-slate-700/80 transition-colors"
              >
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>Book Consultation</span>
              </Link>
            </div>
          </div>

          {/* Quick Details Sidebar Card */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl bg-[#0F172A] border border-slate-800 p-6 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
                Service Overview
              </h3>
              
              <div className="space-y-3 text-xs text-slate-300">
                <div>
                  <span className="text-slate-400 block text-[11px]">Primary Domain:</span>
                  <span className="font-medium text-white">{service.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Estimated Scoping Time:</span>
                  <span>1–2 business days upon brief receipt</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Client Deliverables:</span>
                  <span>Full source code, production assets & documentation</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Engagement Model:</span>
                  <span>Fixed-scope milestones or dedicated retainers</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <Link
                  to="/request-service"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-purple-300 hover:text-white bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800/60 rounded-lg transition-colors"
                >
                  <span>Submit Inquiry</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------------
            SECTION 1: Typical Problems Addressed
           --------------------------------------------------------------------- */}
        <section className="my-16 py-12 px-6 sm:px-10 rounded-2xl bg-[#0F172A] border border-slate-800">
          <div className="max-w-3xl mb-8 space-y-2">
            <span className="text-xs font-bold text-purple-400 tracking-wider uppercase">
              Targeted Resolution
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Typical Challenges This Service Solves
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {service.problemsSolved.map((problem, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-start gap-3 text-xs sm:text-sm text-slate-300"
              >
                <div className="w-5 h-5 rounded-full bg-rose-950/60 border border-rose-800/60 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                  <AlertCircle className="w-3 h-3" />
                </div>
                <span className="leading-relaxed">{problem}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------------------
            SECTION 2: Specific Deliverables
           --------------------------------------------------------------------- */}
        <section className="my-16 space-y-8">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold text-purple-400 tracking-wider uppercase">
              What You Receive
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Specific Deliverables & Artifacts
            </h2>
            <p className="text-sm text-slate-300">
              Clear, tangible outputs engineered to agreed specifications and handed over to your organization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.deliverables.map((del, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 hover:border-slate-700 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-purple-400 mb-3">
                    <CheckCircle2 className="w-5 h-5" />
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      {del.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {del.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------------------
            SECTION 3: Suitable Use Cases & The Process
           --------------------------------------------------------------------- */}
        <div className="my-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Suitable Use Cases */}
          <div className="lg:col-span-5 p-7 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                Suitability
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Ideal Use Cases
              </h3>
            </div>

            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-300">
              {service.suitableUseCases.map((uc, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0 mt-2" />
                  <span className="leading-relaxed">{uc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Delivery Process */}
          <div className="lg:col-span-7 p-7 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                Methodology
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight">
                How We Deliver This Service
              </h3>
            </div>

            <div className="space-y-4">
              {service.processSteps.map((step, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <h4 className="text-xs font-bold text-white mb-1">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ---------------------------------------------------------------------
            SECTION 4: Frequently Asked Questions
           --------------------------------------------------------------------- */}
        {service.faqs && service.faqs.length > 0 && (
          <section className="my-16 space-y-6">
            <div className="space-y-1 max-w-2xl">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                Common Inquiries
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3 max-w-4xl">
              {service.faqs.map((faq, i) => {
                const isOpen = openFaqIndex === i;
                return (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-800 bg-[#0F172A] overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 text-sm font-semibold text-white hover:text-purple-300 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-purple-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ---------------------------------------------------------------------
            SECTION 5: Related Services
           --------------------------------------------------------------------- */}
        {relatedList.length > 0 && (
          <section className="my-16 pt-12 border-t border-slate-800/80 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                Complementary Services
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Related Digital Capabilities
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedList.map((rel) => (
                <Link
                  key={rel.slug}
                  to={`/services/${rel.slug}`}
                  className="p-5 rounded-xl bg-[#0F172A] border border-slate-800 hover:border-purple-500/50 hover:bg-[#131C35] transition-all flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                      {rel.name}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {rel.shortDescription}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform shrink-0 ml-3" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ---------------------------------------------------------------------
            FINAL SERVICE CTA
           --------------------------------------------------------------------- */}
        <div className="mt-16 p-8 sm:p-12 rounded-2xl bg-gradient-to-r from-purple-950/60 via-[#0F172A] to-slate-900 border border-purple-800/50 text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ready to implement {service.name}?
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Submit your requirements to receive a structured quotation, or schedule an exploratory consultation with an engineer.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to={`/request-service?service=${service.slug}`}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors shadow-sm shadow-purple-950/60"
            >
              Request a Quote
            </Link>
            <Link
              to={`/book-consultation?topic=${service.slug}`}
              className="px-5 py-2.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
            >
              Book a Consultation
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
