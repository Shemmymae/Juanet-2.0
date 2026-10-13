import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowRight, Search, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="w-full py-20 px-4 sm:px-6 lg:px-8 text-center flex items-center justify-center min-h-[60vh]">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-purple-950/60 border border-purple-800/60 flex items-center justify-center text-purple-400 mx-auto">
          <Compass className="w-8 h-8 stroke-[1.5]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-purple-400 tracking-wider">
            ERROR 404
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            The page or route you are looking for does not exist, has been moved, or the URL might be mistyped.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-500 transition-colors shadow-sm shadow-purple-950/60"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            to="/services"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <span>Explore Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="pt-6 border-t border-slate-800/80 text-xs text-slate-400">
          Need assistance? <Link to="/contact" className="text-purple-400 underline hover:text-purple-300">Contact our support team</Link>.
        </div>
      </div>
    </div>
  );
};
