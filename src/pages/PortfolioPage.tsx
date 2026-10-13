import React, { useState, useEffect } from 'react';
import { getPortfolioProjects } from '../lib/supabase/services';
import { PortfolioProject, PortfolioCategory } from '../types';
import { PortfolioCard } from '../components/portfolio/PortfolioCard';
import { EmptyPortfolioState } from '../components/portfolio/EmptyPortfolioState';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { Search, Filter } from 'lucide-react';

export const PortfolioPage: React.FC = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    async function load() {
      try {
        const data = await getPortfolioProjects();
        setProjects(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories: ('All' | PortfolioCategory)[] = [
    'All',
    'Websites',
    'Web Applications',
    'Software & Automation',
    'Branding',
    'Graphic Design',
    'E-commerce',
    'AI Solutions',
    'Other',
  ];

  const filteredProjects = projects.filter((p) => {
    const matchesCategory =
      selectedCategory === 'All' || p.category === selectedCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesQuery;
  });

  return (
    <div className="w-full py-10 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Portfolio & Case Studies' }]} />

        {/* Page Header */}
        <div className="mt-4 mb-10 space-y-3 max-w-3xl">
          <span className="text-xs font-bold text-purple-400 tracking-wider uppercase">
            Proof of Craft
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Portfolio & Selected Case Studies
          </h1>
          <p className="text-base text-slate-300 leading-relaxed">
            Exploration of client websites, digital platforms, brand systems, and custom automation. In strict adherence to client NDAs, only authorized case studies appear publicly.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="mb-10 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects by keyword, technology, or domain..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              />
            </div>

            {/* Total count badge (clean unboxed text) */}
            <div className="text-xs text-slate-400 self-center">
              Showing <span className="text-white font-semibold tabular-nums">{filteredProjects.length}</span> published work{filteredProjects.length === 1 ? '' : 's'}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-950/60'
                    : 'bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid / Empty State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-72 rounded-2xl bg-slate-900 border border-slate-800" />
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((p) => (
              <PortfolioCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <EmptyPortfolioState />
        )}

      </div>
    </div>
  );
};
