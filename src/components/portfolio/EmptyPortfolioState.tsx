import React from 'react';
import { Link } from 'react-router-dom';
import { FolderGit2, ShieldCheck, ArrowRight, MessageSquare } from 'lucide-react';

interface EmptyPortfolioStateProps {
  isAdminInvite?: boolean;
}

export const EmptyPortfolioState: React.FC<EmptyPortfolioStateProps> = () => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0F172A] p-8 sm:p-12 text-center max-w-3xl mx-auto my-8 shadow-lg">
      <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-purple-950/60 border border-purple-800/50 flex items-center justify-center text-purple-400">
        <FolderGit2 className="w-7 h-7 stroke-[1.75]" />
      </div>

      <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
        Client Work Curated Under Confidentiality
      </h3>

      <p className="text-sm text-slate-300 leading-relaxed max-w-xl mx-auto mb-6">
        In accordance with our strict client privacy standards and Non-Disclosure Agreements (NDAs), public project case studies are published only with explicit client authorization. We never display fabricated client work or invented metrics.
      </p>

      {/* Trust Notes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-8 text-left text-xs text-slate-300">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            <strong>Confidentiality First:</strong> Enterprise workflows and proprietary software remain private to their respective organizations.
          </span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
          <FolderGit2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <span>
            <strong>Private Portfolios Available:</strong> Request a tailored walkthrough of relevant past architecture and code samples under NDA.
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/request-service"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors shadow-sm shadow-purple-950/50"
        >
          <span>Discuss Your Project</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          to="/contact"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-medium text-slate-300 bg-slate-800/90 hover:bg-slate-700 hover:text-white rounded-lg transition-colors border border-slate-700/60"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Request Private Case Deck</span>
        </Link>
      </div>

      {/* Admin hint note */}
      <p className="mt-8 pt-6 border-t border-slate-800/80 text-[11px] text-slate-400 max-w-md mx-auto">
        Site Administrator: To publish verified case studies, insert records into the <code className="text-purple-300 font-mono">portfolio_projects</code> Supabase table with <code className="text-purple-300 font-mono">publication_status = 'published'</code>.
      </p>
    </div>
  );
};
