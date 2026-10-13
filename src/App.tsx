/**
 * JUANET.cloud — Phase 1 Public Application
 * Routing and Layout Architecture
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

// Pages
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { RequestServicePage } from './pages/RequestServicePage';
import { BookConsultationPage } from './pages/BookConsultationPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* 1. Home */}
          <Route path="/" element={<HomePage />} />

          {/* 2. Services Overview */}
          <Route path="/services" element={<ServicesPage />} />

          {/* 3 - 14. Explicit Service Category Routes */}
          <Route path="/services/web-development" element={<ServiceDetailPage />} />
          <Route path="/services/graphic-design" element={<ServiceDetailPage />} />
          <Route path="/services/branding" element={<ServiceDetailPage />} />
          <Route path="/services/business-software-automation" element={<ServiceDetailPage />} />
          <Route path="/services/school-management-systems" element={<ServiceDetailPage />} />
          <Route path="/services/ai-solutions" element={<ServiceDetailPage />} />
          <Route path="/services/mobile-app-development" element={<ServiceDetailPage />} />
          <Route path="/services/it-support" element={<ServiceDetailPage />} />
          <Route path="/services/hosting-domains-email" element={<ServiceDetailPage />} />
          <Route path="/services/digital-marketing-seo" element={<ServiceDetailPage />} />
          <Route path="/services/ecommerce" element={<ServiceDetailPage />} />
          <Route path="/services/custom-solutions" element={<ServiceDetailPage />} />
          {/* Dynamic fallback for services */}
          <Route path="/services/:slug" element={<ServiceDetailPage />} />

          {/* 15. Portfolio Overview */}
          <Route path="/portfolio" element={<PortfolioPage />} />

          {/* 16. Portfolio Project Details */}
          <Route path="/portfolio/:slug" element={<ProjectDetailPage />} />

          {/* 17. About */}
          <Route path="/about" element={<AboutPage />} />

          {/* 18. Contact */}
          <Route path="/contact" element={<ContactPage />} />

          {/* 19. Request Service & Quotation Form */}
          <Route path="/request-service" element={<RequestServicePage />} />

          {/* 20. Book Consultation Form */}
          <Route path="/book-consultation" element={<BookConsultationPage />} />

          {/* 21. Privacy Policy */}
          <Route path="/privacy" element={<PrivacyPage />} />

          {/* 22. Terms of Service */}
          <Route path="/terms" element={<TermsPage />} />

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
