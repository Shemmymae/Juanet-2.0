import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getServices } from '../lib/supabase/services';
import { Service } from '../types';
import { ServiceCard } from '../components/services/ServiceCard';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { ArrowRight, Layers, HelpCircle, CheckCircle } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getServices();
        setServices(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = [
    'All',
    'Engineering & Development',
    'Design & Creative',
    'Enterprise & Education',
    'Infrastructure & Support',
    'Innovation & AI',
    'Marketing & Growth',
  ];

  const filteredServices =
    selectedCategory === 'All'
      ? services
      : services.filter((s) => s.category === selectedCategory);

  return (
    <div className="w-full py-10 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Services Overview' }]} />

        {/* Page Header */}
        <div className="mt-4 mb-12 space-y-4 max-w-3xl">
          <span className="text-xs font-bold text-purple-400 tracking-wider uppercase">
            Service Catalog
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Digital Solutions & Technology Services
          </h1>
          <p className="text-base text-slate-300 leading-relaxed">
            From modern responsive websites and distinctive brand systems to school management platforms, custom business software, and secure cloud infrastructure.
          </p>
        </div>

        {/* Category Filter Tabs (Interactive Segmented Control - WCAG accessible buttons) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-950/60'
                  : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 rounded-2xl bg-slate-900 border border-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, idx) => (
              <ServiceCard key={service.id} service={service} index={idx} />
            ))}
          </div>
        )}

        {/* Scope and Custom Solutions Banner */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-[#0F172A] to-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Need a tailored solution outside standard packages?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              We frequently architect bespoke digital middleware, private database applications, and specialized institutional integrations.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/services/custom-solutions"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            >
              Custom Solutions
            </Link>
            <Link
              to="/request-service"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
            >
              Request a Quote
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
