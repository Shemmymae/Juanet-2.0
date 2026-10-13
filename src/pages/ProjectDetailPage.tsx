import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPortfolioProjectBySlug } from '../lib/supabase/services';
import { PortfolioProject } from '../types';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  FolderKanban,
  Layers,
} from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      setLoading(true);
      try {
        const item = await getPortfolioProjectBySlug(slug);
        setProject(item);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs">Loading case study...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Project Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">
          The requested portfolio project could not be found or has not been published yet.
        </p>
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-500"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Portfolio</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full py-10 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Portfolio', href: '/portfolio' },
            { label: project.title },
          ]}
        />

        {/* Back Link */}
        <div className="mt-2 mb-6">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Projects</span>
          </Link>
        </div>

        {/* Project Header */}
        <div className="space-y-4 mb-10">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="text-purple-400 font-semibold">{project.category}</span>
            {project.clientVisibilityApproved && project.clientName && (
              <>
                <span aria-hidden="true">·</span>
                <span>Client: {project.clientName}</span>
              </>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
            {project.summary}
          </p>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {project.externalUrl && (
              <a
                href={project.externalUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors shadow-sm shadow-purple-950/60"
              >
                <span>Visit Live Project</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <Link
              to="/request-service"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium text-slate-200 bg-slate-900 border border-slate-700 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <span>Build Similar Solution</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Featured Image Banner */}
        <div className="mb-12 rounded-2xl overflow-hidden border border-slate-800 bg-[#0F172A] aspect-video w-full relative">
          {project.featuredImagePath && !imageError ? (
            <img
              src={project.featuredImagePath}
              alt={project.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-900 via-[#0F172A] to-purple-950/40 text-slate-400">
              <FolderKanban className="w-16 h-16 text-purple-400/80 mb-3 stroke-[1.5]" />
              <span className="text-sm font-semibold text-white">{project.title}</span>
              <span className="text-xs text-slate-400 mt-1">{project.category}</span>
            </div>
          )}
        </div>

        {/* Technical Specs Strip */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="mb-12 p-5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center gap-3 text-xs">
            <span className="font-semibold text-white">Technologies & Tools:</span>
            <div className="flex flex-wrap gap-2 text-slate-300">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700/80 text-slate-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Narrative: Challenge, Approach & Outcomes */}
        <div className="space-y-10 text-slate-300">
          {project.description && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Project Overview
              </h2>
              <p className="text-sm leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>
          )}

          {project.challenge && (
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-3">
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>The Challenge</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {project.challenge}
              </p>
            </div>
          )}

          {project.approach && (
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-3">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Our Engineering & Design Approach
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {project.approach}
              </p>
            </div>
          )}

          {project.outcomes && (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-950/30 to-[#0F172A] border border-purple-800/40 space-y-3">
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-purple-400" />
                <span>Results & Business Outcomes</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {project.outcomes}
              </p>
            </div>
          )}

          {/* Project Gallery if images exist */}
          {project.images && project.images.length > 0 && (
            <div className="space-y-4 pt-6">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Project Gallery
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.images.map((img) => (
                  <div
                    key={img.id}
                    className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900"
                  >
                    <img
                      src={img.storagePath}
                      alt={img.altText}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                    {img.caption && (
                      <p className="p-2.5 text-[11px] text-slate-400 bg-slate-950/80 border-t border-slate-800">
                        {img.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA Strip */}
        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/portfolio"
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Portfolio</span>
          </Link>

          <Link
            to="/request-service"
            className="px-6 py-2.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors shadow-sm shadow-purple-950/50"
          >
            Start Your Own Project
          </Link>
        </div>

      </div>
    </div>
  );
};
