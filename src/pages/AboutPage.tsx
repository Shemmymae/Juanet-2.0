import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { siteConfig } from '../config/site';
import {
  Compass,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
  Shield,
  Lightbulb,
  Workflow,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="w-full py-10 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'About JUANET.cloud' }]} />

        {/* Hero Section */}
        <div className="mt-4 mb-16 space-y-4 max-w-3xl">
          <span className="text-xs font-bold text-purple-400 tracking-wider uppercase">
            Who We Are & What We Stand For
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            Know the Internet. Build What's Next.
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            JUANET.cloud is a modern digital solutions and technology partner dedicated to helping businesses, educational institutions, and organizations navigate modern technology with clarity and confidence.
          </p>
        </div>

        {/* ---------------------------------------------------------------------
            THE BRAND STORY: "KNOW THE INTERNET"
           --------------------------------------------------------------------- */}
        <section className="mb-16 p-8 sm:p-10 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-6">
          <div className="flex items-center gap-2.5 text-xs font-bold text-purple-400 uppercase tracking-wider">
            <Compass className="w-4 h-4" />
            <span>The Meaning Behind the Name</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Rooted in Understanding, Engineered for Purpose
          </h2>

          <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            <p>
              The name <strong className="text-white">JUANET</strong> is inspired by the Swahili word <em>"Kujua"</em> — meaning to know, to understand, and to perceive with clarity. Combined with <em>"Net"</em>, it represents our foundational commitment: <strong className="text-purple-300">"Know the Internet."</strong>
            </p>
            <p>
              For many businesses and schools, digital technology can feel needlessly complex, fragmented, or governed by buzzwords. Proprietary vendors lock clients into rigid systems, while unmaintainable templates fail when operations expand.
            </p>
            <p>
              JUANET.cloud was created to provide a dependable alternative: combining deep software engineering, robust cloud infrastructure, and clear communication. We demystify digital systems so our clients can make sound architectural choices that serve their business goals over the long term.
            </p>
          </div>
        </section>

        {/* ---------------------------------------------------------------------
            MISSION & CORE PRINCIPLES
           --------------------------------------------------------------------- */}
        <section className="mb-16 space-y-8">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              Our Compass
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Mission & Guiding Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-400 mb-2">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Practicality Over Hype
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                We implement solutions that solve measurable operational bottlenecks. We do not chase fashionable technology for its own sake when simpler, more stable architectures deliver superior results.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-400 mb-2">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Client Ownership & Transparency
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Your code, databases, and intellectual property belong to you. We build on open, standardized ecosystems without artificial lock-in, providing complete documentation and code handovers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-400 mb-2">
                <Workflow className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Engineered for Maintainability
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                From strict type checking to clean SQL relational schemas and responsive CSS, our engineering standards ensure that your software remains maintainable, scalable, and secure years after launch.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-400 mb-2">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Continuous Reliability
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Deployments are not the end of a relationship; they are the start of operations. We provide ongoing maintenance, security patching, and managed cloud operations to keep your digital services active.
              </p>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------------
            AREAS OF EXPERTISE
           --------------------------------------------------------------------- */}
        <section className="mb-16 p-8 sm:p-10 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-8">
          <div className="space-y-2">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              Technical Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Our Core Domains of Expertise
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-300">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <strong className="text-white block mb-1">Web Platforms</strong>
              <span>React, TypeScript, Vite, Tailwind CSS, static site generation, and SEO architectures.</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <strong className="text-white block mb-1">Database & Cloud Systems</strong>
              <span>PostgreSQL, Supabase, CloudPanel, REST APIs, microservices, and server security.</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <strong className="text-white block mb-1">Education Management</strong>
              <span>Student information portals, fee reconciliations, grading systems, and parent SMS alerts.</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <strong className="text-white block mb-1">Workflow Automation</strong>
              <span>Automated reporting pipelines, CRM sync, webhook processing, and business tooling.</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <strong className="text-white block mb-1">Brand & Visual Identity</strong>
              <span>Logomarks, design systems, vector guidelines, and marketing communications collateral.</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <strong className="text-white block mb-1">Infrastructure & Mail</strong>
              <span>DNS configuration, SPF/DKIM/DMARC deliverability, SSL management, and Google Workspace.</span>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------------
            HOW CLIENTS WORK WITH US
           --------------------------------------------------------------------- */}
        <section className="mb-16 space-y-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
              Collaboration Models
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              How You Can Work With JUANET.cloud
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-300">
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-3">
              <h3 className="text-base font-bold text-white tracking-tight">
                1. Scoped Project Delivery
              </h3>
              <p className="leading-relaxed">
                Ideal for websites, brand identity rollouts, or new software modules. We agree on fixed milestones, clear deliverables, and a transparent budget.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-3">
              <h3 className="text-base font-bold text-white tracking-tight">
                2. Dedicated Retainers
              </h3>
              <p className="leading-relaxed">
                Ongoing technical management, IT support, infrastructure monitoring, and incremental software enhancements for growing organizations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-3">
              <h3 className="text-base font-bold text-white tracking-tight">
                3. Technical Consultation
              </h3>
              <p className="leading-relaxed">
                Advisory sessions focused on technical feasibility, evaluating third-party vendors, designing architecture, or auditing security.
              </p>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------------
            CTA SECTION
           --------------------------------------------------------------------- */}
        <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-800/50 text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ready to explore a digital partnership?
          </h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Let's discuss what you want to achieve. We'll help you define a practical roadmap to get there.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/request-service"
              className="px-6 py-2.5 text-xs font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors shadow-sm shadow-purple-950/60"
            >
              Request a Project Quote
            </Link>
            <Link
              to="/book-consultation"
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
