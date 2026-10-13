import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getServices, getPortfolioProjects } from '../lib/supabase/services';
import { Service, PortfolioProject } from '../types';
import { ServiceCard } from '../components/services/ServiceCard';
import { PortfolioCard } from '../components/portfolio/PortfolioCard';
import { EmptyPortfolioState } from '../components/portfolio/EmptyPortfolioState';
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Layers,
  Cpu,
  Shield,
  MessageSquare,
  Compass,
  CheckCircle,
  Users,
  Calendar,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [srvs, projs] = await Promise.all([
          getServices(),
          getPortfolioProjects(),
        ]);
        setServices(srvs);
        setFeaturedProjects(projs.filter((p) => p.isFeatured).slice(0, 3));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const whyChooseUs = [
    {
      icon: Compass,
      title: 'Solutions Built Around Your Needs',
      description:
        'We do not force your operations into generic off-the-shelf templates. Every architecture and design is selected to address your exact business requirements.',
    },
    {
      icon: Cpu,
      title: 'Practical, Outcome-Driven Problem Solving',
      description:
        'We focus on tangible business outcomes — higher conversion, reduced administrative friction, automated workflows, and rock-solid reliability.',
    },
    {
      icon: Layers,
      title: 'Modern, Sustainable Technologies',
      description:
        'Built with production-grade engineering (TypeScript, React, cloud hosting, and secure databases) ensuring high speed, maintainability, and portability.',
    },
    {
      icon: MessageSquare,
      title: 'Transparent, Direct Communication',
      description:
        'Clear milestones, transparent scoping, and responsive technical advice in plain language that non-technical leaders and teams appreciate.',
    },
    {
      icon: Shield,
      title: 'Reliable Support Beyond Launch',
      description:
        'Technology requires care. We provide structured handover documentation, staff training, and proactive managed maintenance agreements.',
    },
  ];

  const workflowSteps = [
    {
      number: '01',
      title: 'Discover',
      tagline: 'Understand Goals & Constraints',
      description:
        'We evaluate your current systems, operational pain points, target audience, and desired business outcomes to establish clear project parameters.',
    },
    {
      number: '02',
      title: 'Plan',
      tagline: 'Architecture & Recommended Scope',
      description:
        'We define the technical blueprint, visual prototypes, milestones, deliverables, and transparent budget estimates before writing production code.',
    },
    {
      number: '03',
      title: 'Build',
      tagline: 'Iterative Engineering & Polish',
      description:
        'We develop clean, tested code and responsive interfaces with regular check-ins, allowing your team to review progress and validate functionality.',
    },
    {
      number: '04',
      title: 'Deliver',
      tagline: 'Launch, Handover & Support',
      description:
        'We handle domain setups, SSL verification, security hardening, staff training, and handover of your proprietary assets with ongoing support.',
    },
  ];

  const targetAudiences = [
    {
      title: 'Small & Medium Enterprises (SMEs)',
      description:
        'Businesses modernizing manual record keeping, improving client inquiry conversion, or launching reliable digital stores.',
    },
    {
      title: 'Startups & Entrepreneurs',
      description:
        'Founders needing a distinctive brand identity, high-converting launch web presence, or tailored software MVP.',
    },
    {
      title: 'Schools & Educational Institutions',
      description:
        'Primary, secondary, and tertiary academies seeking integrated student records, automated fee tracking, and parent communications.',
    },
    {
      title: 'Professional Service Providers',
      description:
        'Consultancies, legal practices, and medical facilities requiring client booking workflows, secure file access, and authoritative websites.',
    },
    {
      title: 'Established Organizations',
      description:
        'Corporations seeking internal workflow automation, custom API middleware, or legacy infrastructure modernization.',
    },
    {
      title: 'International Clients',
      description:
        'Global partners seeking reliable full-stack engineering, web development, and digital design services executed to international standards.',
    },
  ];

  return (
    <div className="w-full">
      {/* -----------------------------------------------------------------------
          HERO SECTION
          Single dominant focal composition, no fake metrics/dashboards
         ----------------------------------------------------------------------- */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-slate-800/80 bg-gradient-to-b from-[#0B132B] via-[#0F172A] to-[#0B132B]">
        {/* Subtle background ambient mesh */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-purple-900/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Hero Proposition */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Unboxed editorial kicker */}
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 tracking-wider uppercase">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Digital Solutions & Technology Partner</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] text-balance">
                Know the Internet.{' '}
                <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-white bg-clip-text text-transparent">
                  Build What's Next.
                </span>
              </h1>

              {/* Supporting copy */}
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                From websites and branding to business software, AI, and digital infrastructure — thoughtfully built around your goals.
              </p>

              {/* Primary & Secondary Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-500 active:bg-purple-700 transition-all shadow-md shadow-purple-950/50 focus-visible:ring-2 focus-visible:ring-purple-400 whitespace-nowrap shrink-0"
                >
                  <span>Explore Our Services</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/portfolio"
                  className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-medium text-slate-200 bg-slate-900/90 hover:bg-slate-800 hover:text-white rounded-lg border border-slate-700/80 transition-colors whitespace-nowrap shrink-0"
                >
                  <span>View Our Work</span>
                </Link>

                <Link
                  to="/request-service"
                  className="inline-flex items-center gap-1.5 px-3 py-3 text-xs sm:text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors ml-1"
                >
                  <span>Tell Us About Your Project</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust signals (Unboxed metadata with · separators) */}
              <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                <span className="text-slate-300 font-medium">Serving Clients in Kenya & Internationally</span>
                <span aria-hidden="true">·</span>
                <span>Practical Solutions</span>
                <span aria-hidden="true">·</span>
                <span>Custom Architecture</span>
                <span aria-hidden="true">·</span>
                <span>No Proprietary Vendor Lock-in</span>
              </div>
            </div>

            {/* Right Column: Premium Abstract Technology Visual Composition */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md lg:max-w-none rounded-2xl bg-[#0F172A] border border-slate-800/90 p-6 sm:p-8 shadow-2xl relative overflow-hidden ring-1 ring-white/5">
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-5 border-b border-slate-800 text-xs">
                  <span className="font-mono text-purple-400 font-semibold">juanet.cloud/systems</span>
                  <span className="text-slate-500 font-mono">v1.0 / PROD</span>
                </div>

                {/* Conceptual Architecture Diagram */}
                <div className="py-6 space-y-4">
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Public Brand & Web Platforms</div>
                        <div className="text-[11px] text-slate-400">High-speed React, Vite & Technical SEO</div>
                      </div>
                    </div>
                    <CheckCircle className="w-4 h-4 text-purple-400 shrink-0" />
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Business Software & Automation</div>
                        <div className="text-[11px] text-slate-400">Workflow pipelines & school systems</div>
                      </div>
                    </div>
                    <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0" />
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Cloud Infrastructure & Security</div>
                        <div className="text-[11px] text-slate-400">Hosting, SSL, business email & DNS</div>
                      </div>
                    </div>
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  </div>
                </div>

                {/* Footer of the visual component */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Reliable Digital Engineering</span>
                  <Link to="/about" className="text-purple-400 hover:text-purple-300 font-medium">
                    Learn Our Approach →
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* -----------------------------------------------------------------------
          SERVICES OVERVIEW GRID (12 Principal Categories)
         ----------------------------------------------------------------------- */}
      <section id="services" className="py-20 bg-[#0B132B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-purple-400 tracking-wider uppercase">
                Comprehensive Capabilities
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Principal Digital Services
              </h2>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                Practical, modern technology solutions designed to solve real business challenges and support scalable operations.
              </p>
            </div>

            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 whitespace-nowrap"
            >
              <span>View full service catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 12 Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <ServiceCard key={service.id} service={service} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* -----------------------------------------------------------------------
          WHY WORK WITH JUANET.cloud?
         ----------------------------------------------------------------------- */}
      <section className="py-20 bg-[#070D1E] border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-purple-400 tracking-wider uppercase">
              The JUANET Approach
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why Work with JUANET.cloud?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              We combine deep technical capabilities with clear, straightforward business alignment to deliver technology that works reliably.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-7 rounded-2xl bg-[#0F172A] border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-400 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}

            {/* Sixth card: CTA summary */}
            <div className="p-7 rounded-2xl bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-800/40 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white mb-2">
                  Have a specific challenge?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                  Schedule an exploratory consultation to discuss your technical requirements and receive objective architectural guidance.
                </p>
              </div>
              <Link
                to="/book-consultation"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-300 hover:text-white"
              >
                <span>Book a Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* -----------------------------------------------------------------------
          FEATURED PROJECTS / CASE STUDIES
         ----------------------------------------------------------------------- */}
      <section className="py-20 bg-[#0B132B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-purple-400 tracking-wider uppercase">
                Featured Work
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Case Studies & Portfolio
              </h2>
              <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                Reviewed and published project highlights. Only client-authorized work is presented publicly.
              </p>
            </div>

            <Link
              to="/portfolio"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300"
            >
              <span>View portfolio directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((p) => (
                <PortfolioCard key={p.id} project={p} />
              ))}
            </div>
          ) : (
            <EmptyPortfolioState />
          )}
        </div>
      </section>

      {/* -----------------------------------------------------------------------
          HOW WE WORK (4-Step Process)
         ----------------------------------------------------------------------- */}
      <section className="py-20 bg-[#070D1E] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-purple-400 tracking-wider uppercase">
              Proven Delivery Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              How We Work
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              A structured four-step journey ensuring clarity, predictable progress, and dependable outcomes from discovery to launch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step) => (
              <div
                key={step.number}
                className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="text-2xl font-mono font-bold text-purple-400 mb-3">
                    {step.number}
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">
                    {step.title}
                  </h3>
                  <div className="text-xs text-purple-300/80 font-medium mb-3">
                    {step.tagline}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -----------------------------------------------------------------------
          WHO WE SERVE
         ----------------------------------------------------------------------- */}
      <section className="py-20 bg-[#0B132B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold text-purple-400 tracking-wider uppercase">
              Tailored Collaboration
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Who We Serve
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              We collaborate with forward-thinking organizations, educational leaders, and businesses seeking dependable digital capability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {targetAudiences.map((aud, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <Users className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    {aud.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {aud.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -----------------------------------------------------------------------
          FINAL CALL TO ACTION
         ----------------------------------------------------------------------- */}
      <section className="py-20 bg-gradient-to-b from-[#0F172A] to-[#070D1E] border-t border-slate-800 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Have a project in mind?
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Tell us what you want to build, improve, or automate. We'll help you identify the next step with pragmatic, transparent advice.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/request-service"
              className="inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-500 active:bg-purple-700 transition-all shadow-md shadow-purple-950/60"
            >
              <span>Request a Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/book-consultation"
              className="inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-medium text-slate-200 bg-slate-800/90 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-700/80 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a Consultation</span>
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 px-4 py-3 text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              <span>Contact Us</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
