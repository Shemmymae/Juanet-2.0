import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { isSupabaseConfigured } from '../../lib/supabase/client';
import { Info, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { pathname } = useLocation();
  const [showDevNotice, setShowDevNotice] = useState(!isSupabaseConfigured);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B132B] text-slate-100 font-sans selection:bg-purple-600 selection:text-white">
      {/* Skip to Content Link for WCAG Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Unconfigured Supabase Preview Alert (Non-intrusive) */}
      {!isSupabaseConfigured && showDevNotice && (
        <aside
          aria-label="Configuration status"
          className="bg-indigo-950/80 border-b border-indigo-800/80 text-indigo-200 text-xs py-2 px-4 flex items-center justify-between"
        >
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-purple-400 shrink-0" />
              <span>
                <strong>Static & Preview Mode Active:</strong> Running with verified local catalog. To connect real database inquiries, set <code className="bg-indigo-900/60 px-1 py-0.5 rounded text-indigo-300">VITE_SUPABASE_URL</code> and key in <code className="bg-indigo-900/60 px-1 py-0.5 rounded text-indigo-300">.env</code>.
              </span>
            </div>
            <button
              onClick={() => setShowDevNotice(false)}
              className="text-indigo-400 hover:text-white p-1 rounded"
              title="Dismiss notice"
              aria-label="Dismiss notice"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>
      )}

      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 w-full">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
