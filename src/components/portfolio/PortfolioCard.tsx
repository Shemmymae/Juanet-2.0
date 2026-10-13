import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight, FolderKanban } from 'lucide-react';
import { PortfolioProject } from '../../types';

interface PortfolioCardProps {
  project: PortfolioProject;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({ project }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <article className="group flex flex-col justify-between rounded-2xl bg-[#0F172A] border border-slate-800/90 overflow-hidden hover:border-purple-500/50 transition-all duration-200 shadow-sm hover:shadow-xl hover:shadow-purple-950/20">
      <div>
        {/* Thumbnail with robust CSS/SVG fallback */}
        <div className="relative aspect-video w-full bg-slate-900 overflow-hidden border-b border-slate-800/60">
          {project.featuredImagePath && !imageError ? (
            <img
              src={project.featuredImagePath}
              alt={project.title}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-[#0F172A] to-purple-950/30 text-slate-400">
              <FolderKanban className="w-10 h-10 text-purple-400/80 mb-2 stroke-[1.5]" />
              <span className="text-xs font-medium text-slate-300 text-center line-clamp-1">
                {project.category}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Metadata: Unboxed text with · separators (Anti-Slop Zero-Pill) */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2.5">
            <span className="text-purple-400 font-medium">{project.category}</span>
            {project.clientVisibilityApproved && project.clientName && (
              <>
                <span aria-hidden="true">·</span>
                <span>Client: {project.clientName}</span>
              </>
            )}
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-2 tracking-tight">
            <Link to={`/portfolio/${project.slug}`}>
              {project.title}
            </Link>
          </h3>

          <p className="text-sm text-slate-300 leading-relaxed line-clamp-3 mb-4">
            {project.summary}
          </p>

          {/* Tech Stack list (clean unboxed inline text) */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400 mb-4">
              <span className="text-slate-400">Stack:</span>
              <span className="text-slate-300">{project.technologies.join(', ')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Action Links */}
      <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-800/60 mt-4">
        <Link
          to={`/portfolio/${project.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 group-hover:text-purple-300 transition-colors focus-visible:ring-2 focus-visible:ring-purple-400 rounded py-1 px-1"
        >
          <span>View Case Study</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {project.externalUrl && (
          <a
            href={project.externalUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors py-1 px-1"
            title="Visit live project"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </article>
  );
};
