import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Service } from '../../types';
import { ServiceIcon } from '../ui/ServiceIcon';

interface ServiceCardProps {
  service: Service;
  index?: number;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => {
  return (
    <div
      className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[#0F172A] border border-slate-800/90 hover:border-purple-500/50 hover:bg-[#131C35] transition-all duration-200 shadow-sm hover:shadow-xl hover:shadow-purple-950/20"
    >
      <div>
        {/* Top: Icon & Category Indicator (unboxed metadata) */}
        <div className="flex items-center justify-between mb-5">
          <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-400 group-hover:text-purple-300 group-hover:scale-105 transition-all">
            <ServiceIcon iconKey={service.iconKey} className="w-6 h-6" />
          </div>

          {/* Clean editorial numbering or unboxed category */}
          <span className="text-xs font-mono text-slate-400 tabular-nums">
            {typeof index === 'number' ? `0${index + 1}`.slice(-2) : ''}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-2 tracking-tight">
          {service.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-300 leading-relaxed line-clamp-3 mb-6">
          {service.shortDescription}
        </p>
      </div>

      {/* Footer: Learn More Link */}
      <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between">
        <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
          {service.category}
        </span>
        
        <Link
          to={`/services/${service.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 group-hover:text-purple-300 group-hover:translate-x-0.5 transition-all focus-visible:ring-2 focus-visible:ring-purple-400 rounded py-1 px-1.5 -mr-1.5"
          aria-label={`Learn more about ${service.name}`}
        >
          <span>Learn More</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
