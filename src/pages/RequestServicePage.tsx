import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ServiceRequestForm } from '../components/forms/ServiceRequestForm';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

export const RequestServicePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const serviceParam = searchParams.get('service') || '';

  return (
    <div className="w-full py-10 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Request a Service / Quotation' }]} />

        {/* Page Header */}
        <div className="mt-4 mb-10 text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-purple-400 tracking-wider uppercase">
            Project Scoping
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Request a Service Quotation
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Tell us about your project goals and requirements. We'll analyze your specifications and prepare a clear, structured estimate.
          </p>
        </div>

        {/* Value trust strip */}
        <div className="max-w-3xl mx-auto mb-10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300 text-center">
          <div className="p-3 rounded-xl bg-[#0F172A] border border-slate-800 flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Response within 1-2 business days</span>
          </div>
          <div className="p-3 rounded-xl bg-[#0F172A] border border-slate-800 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>No obligation estimate</span>
          </div>
          <div className="p-3 rounded-xl bg-[#0F172A] border border-slate-800 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Strict privacy & NDA compliance</span>
          </div>
        </div>

        {/* Multi-step Form Wizard */}
        <ServiceRequestForm initialServiceSlug={serviceParam} />

      </div>
    </div>
  );
};
