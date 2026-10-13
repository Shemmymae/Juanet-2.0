import React from 'react';
import { ConsultationForm } from '../components/forms/ConsultationForm';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { Calendar, HelpCircle, ShieldCheck } from 'lucide-react';

export const BookConsultationPage: React.FC = () => {
  return (
    <div className="w-full py-10 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Book a Consultation' }]} />

        {/* Page Header */}
        <div className="mt-4 mb-10 text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-purple-400 tracking-wider uppercase">
            Advisory & Scoping
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Book an Exploratory Consultation
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Need guidance on technical feasibility, architecture options, or technology choices before committing to a project? Schedule a structured discussion with an engineer.
          </p>
        </div>

        {/* Form Container */}
        <ConsultationForm />

      </div>
    </div>
  );
};
