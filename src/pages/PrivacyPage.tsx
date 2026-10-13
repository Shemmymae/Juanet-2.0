import React from 'react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { siteConfig } from '../config/site';

export const PrivacyPage: React.FC = () => {
  const { brandName, domain, contact } = siteConfig;

  return (
    <div className="w-full py-10 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

        {/* Page Header */}
        <div className="mt-4 mb-10 space-y-3">
          <span className="text-xs font-bold text-purple-400 tracking-wider uppercase">
            Data Protection & Privacy
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-400">
            Effective Date: October 2026 · Last Updated: October 2026
          </p>
        </div>

        {/* Document Content */}
        <div className="rounded-2xl bg-[#0F172A] border border-slate-800 p-8 sm:p-12 space-y-8 text-sm text-slate-300 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">
              1. Introduction & Overview
            </h2>
            <p>
              {brandName} ("we", "our", or "us") operates the website located at{' '}
              <a href={domain} className="text-purple-400 underline">
                {domain}
              </a>
              . We are committed to safeguarding the privacy and personal data of our website visitors, prospective clients, and partners in Kenya and internationally.
            </p>
            <p>
              This Privacy Policy explains how we collect, process, store, and protect your information when you browse our website, submit service inquiries, request quotations, or book consultations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">
              2. Information We Collect
            </h2>
            <p>
              We collect only the minimal information necessary to deliver our digital services and communicate with you effectively:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300">
              <li>
                <strong className="text-white">Contact & Identity Details:</strong> Full name, business email address, phone or WhatsApp number, and organization or school name submitted via our web forms.
              </li>
              <li>
                <strong className="text-white">Project Specifications:</strong> Service preferences, requirements descriptions, budget ranges, and desired timelines provided when requesting a quotation or consultation.
              </li>
              <li>
                <strong className="text-white">Technical Usage Data:</strong> Standard server access logs, browser type, operating system, and IP address collected automatically for security monitoring and rate limiting.
              </li>
            </ul>
            <p className="text-xs text-slate-400 mt-2">
              Note: We do NOT collect or store sensitive payment card information, financial passwords, or unnecessary special categories of personal data on our public website.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">
              3. Purposes of Processing
            </h2>
            <p>We use your personal data exclusively for lawful purposes:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300">
              <li>To evaluate and respond to your messages, service inquiries, and consultation requests.</li>
              <li>To prepare customized project scopes, architecture proposals, and quotations.</li>
              <li>To communicate regarding scheduled advisory meetings or follow-ups.</li>
              <li>To protect our website infrastructure against automated spam, abuse, and cyber threats.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">
              4. Legal Basis for Processing
            </h2>
            <p>
              We process personal data under applicable data protection laws, including the Kenya Data Protection Act (2019) and the European General Data Protection Regulation (GDPR) where relevant:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300">
              <li><strong className="text-white">Consent:</strong> When you voluntarily submit a form and tick our privacy consent checkbox.</li>
              <li><strong className="text-white">Pre-Contractual Steps:</strong> When processing is required to prepare a service agreement or quotation at your request.</li>
              <li><strong className="text-white">Legitimate Interests:</strong> For network security, fraud prevention, and maintaining website operational integrity.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">
              5. Data Storage, Retention & Security
            </h2>
            <p>
              Your submitted data is stored in secure database environments employing Row Level Security (RLS) and encrypted transport (TLS/HTTPS). We do not permit public anonymous access to inquiry records.
            </p>
            <p>
              We retain inquiry records only as long as necessary to fulfill the operational business purpose for which they were gathered, typically up to 24 months for commercial records, unless a formal client agreement is entered or statutory retention is required.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">
              6. Third-Party Sharing & Transfers
            </h2>
            <p>
              <strong className="text-white">We never sell, rent, or trade your personal information.</strong> We share data only with trusted cloud infrastructure providers (such as hosting servers, database providers, and transactional email gateways) strictly bound by confidentiality and security obligations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">
              7. Your Legal Rights
            </h2>
            <p>
              Subject to applicable law, you have the right to request access to your personal data, request correction of inaccuracies, request erasure of your data, or withdraw consent at any time.
            </p>
            <p>
              To exercise any of these rights, please contact our data team at{' '}
              {contact.email ? (
                <a href={`mailto:${contact.email}`} className="text-purple-400 underline">
                  {contact.email}
                </a>
              ) : (
                <span>our official contact email</span>
              )}
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">
              8. Cookies & Local Storage
            </h2>
            <p>
              Our website uses strictly necessary cookies and local storage tokens for interface functionality and security. We do not use intrusive third-party cross-site advertising trackers on our public pages.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-800">
            <h2 className="text-base font-bold text-white tracking-tight">
              9. Contact for Privacy Inquiries
            </h2>
            <p>
              For questions concerning this Privacy Policy or our data handling practices, please write to:
            </p>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <strong className="text-white block">{brandName} — Data Compliance</strong>
              {contact.email && <div>Email: {contact.email}</div>}
              {contact.physicalLocation && <div>Location: {contact.physicalLocation}</div>}
              <div>Website: {domain}</div>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
};
