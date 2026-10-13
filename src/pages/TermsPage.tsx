import React from 'react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { siteConfig } from '../config/site';
import { AlertCircle } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const { brandName, domain, contact } = siteConfig;

  return (
    <div className="w-full py-10 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Terms of Service' }]} />

        {/* Page Header */}
        <div className="mt-4 mb-8 space-y-3">
          <span className="text-xs font-bold text-purple-400 tracking-wider uppercase">
            Legal Terms & Conditions
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-400">
            Version 1.0 (Draft for Review) · Applicable to Phase 1 Public Services
          </p>
        </div>

        {/* Prominent Draft Notice */}
        <div className="mb-10 p-4 rounded-xl bg-purple-950/40 border border-purple-800/80 text-purple-200 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-white">DRAFT LEGAL DOCUMENT — SUBJECT TO FORMAL REVIEW</h4>
            <p className="mt-1 leading-relaxed text-purple-300">
              The terms outlined below represent the standard operational and commercial baseline for {brandName}. Specific client engagements, Statements of Work (SOW), and Non-Disclosure Agreements (NDAs) supersede these general website terms.
            </p>
          </div>
        </div>

        {/* Document Content */}
        <div className="rounded-2xl bg-[#0F172A] border border-slate-800 p-8 sm:p-12 space-y-8 text-sm text-slate-300 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or utilizing the public website and forms of {brandName} ({domain}), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you should discontinue use of the site.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">
              2. Nature of Public Website & Quotations
            </h2>
            <p>
              The content provided on this website is for informational, scoping, and introductory purposes:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300">
              <li>
                <strong className="text-white">Service Descriptions:</strong> Descriptions of capabilities, deliverables, and technologies represent services we offer, but do not constitute a binding unilateral contract until formalized in an agreed proposal.
              </li>
              <li>
                <strong className="text-white">Quotations & Consultations:</strong> Submission of an inquiry or consultation request generates an estimate or exploratory meeting proposal. It does not create a confirmed contract until both parties sign a Statement of Work (SOW).
              </li>
              <li>
                <strong className="text-white">No Fabricated Commitments:</strong> We do not publish automated binding quotes without reviewing project constraints and security parameters.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">
              3. Intellectual Property Rights
            </h2>
            <p>
              <strong className="text-white">Website Materials:</strong> All original website copy, branding, design architecture, graphics, and code underlying {domain} are the intellectual property of {brandName}.
            </p>
            <p>
              <strong className="text-white">Client Project Handover:</strong> Upon full payment of all contracted milestones under a formal Statement of Work, all custom deliverables, codebases, design files, and proprietary database configurations developed specifically for the client are fully transferred and assigned to the client.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">
              4. Client Responsibilities & Content
            </h2>
            <p>
              When requesting services or providing assets (logos, text, data, credentials):
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-300">
              <li>You warrant that all materials provided do not infringe third-party copyrights, trademarks, or trade secrets.</li>
              <li>You agree not to use our inquiry channels to transmit malicious code, automated spam, or defamatory content.</li>
              <li>You are responsible for maintaining backups of your existing legacy systems prior to authorized migration work.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">
              5. Warranties & Limitation of Liability
            </h2>
            <p>
              While {brandName} adheres to rigorous software engineering and cybersecurity standards, this public website is provided "as is" without warranties of uninterrupted uptime or error-free availability.
            </p>
            <p>
              To the maximum extent permitted by applicable law, {brandName} and its engineers shall not be liable for indirect, incidental, special, or consequential damages resulting from the use of this website or delays in response times.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">
              6. Confidentiality & Non-Disclosure
            </h2>
            <p>
              We treat all project briefs, proprietary software ideas, and business workflows shared during inquiries as strictly confidential. Formal mutual Non-Disclosure Agreements (NDAs) are available upon request prior to technical disclosure.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight">
              7. Governing Law & Jurisdiction
            </h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of Kenya. For international commercial engagements, formal dispute resolution procedures (such as arbitration or agreed jurisdiction clauses) shall be set out in the individual Statement of Work.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-800">
            <h2 className="text-base font-bold text-white tracking-tight">
              8. Contact for Legal Inquiries
            </h2>
            <p>
              For inquiries regarding these terms or commercial contracting, please contact:
            </p>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <strong className="text-white block">{brandName} — Legal & Contracts</strong>
              {contact.email && <div>Email: {contact.email}</div>}
              <div>Website: {domain}</div>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
};
