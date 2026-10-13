import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { servicesData } from '../../data/servicesData';
import { submitInquiry } from '../../lib/supabase/services';
import { InquiryPayload, InquirySubmissionResult, ServiceSlug } from '../../types';
import { buildWhatsAppProjectSummary, generateWhatsAppLink } from '../../lib/utils/format';
import { siteConfig } from '../../config/site';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  FileCheck2,
  MessageSquare,
} from 'lucide-react';

interface ServiceRequestFormProps {
  initialServiceSlug?: ServiceSlug | string;
}

export const ServiceRequestForm: React.FC<ServiceRequestFormProps> = ({ initialServiceSlug }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<InquirySubmissionResult | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Contact Details
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    country: 'Kenya',
    preferredContactMethod: 'email' as 'email' | 'phone' | 'whatsapp',

    // Step 2: Project Details
    serviceSlug: initialServiceSlug || 'web-development',
    projectSummary: '',
    projectDetails: '',
    intendedAudience: '',
    existingWebsiteUrl: '',
    preferredTechnologies: '',

    // Step 3: Planning & Budget
    budgetRange: "I'm not sure yet",
    preferredTimeline: 'Flexible',
    desiredStartDate: '',
    additionalNotes: '',

    // Step 4: Review & Consent
    privacyConsent: false,
    honeypot: '',
  });

  const budgetOptions = [
    "I'm not sure yet / Needs consultation",
    'Under $500 / Under KES 65,000',
    '$500 - $1,500 / KES 65,000 - 200,000',
    '$1,500 - $3,500 / KES 200,000 - 450,000',
    '$3,500+ / KES 450,000+',
  ];

  const timelineOptions = [
    'Immediate (within 1-2 weeks)',
    'Standard (1-2 months)',
    'Flexible / Planning Phase',
  ];

  // Validation per step
  const validateStep1 = () => {
    if (!formData.fullName.trim()) return 'Please enter your full name.';
    if (!formData.email.trim()) return 'Please enter your email address.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) return 'Please enter a valid email format.';
    return null;
  };

  const validateStep2 = () => {
    if (!formData.projectSummary.trim()) return 'Please enter a project title or summary.';
    if (!formData.projectDetails.trim()) return 'Please describe your project requirements in a few sentences.';
    return null;
  };

  const [stepError, setStepError] = useState<string | null>(null);

  const handleNext = () => {
    setStepError(null);
    if (currentStep === 1) {
      const err = validateStep1();
      if (err) return setStepError(err);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const err = validateStep2();
      if (err) return setStepError(err);
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    setStepError(null);
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!formData.privacyConsent) {
      setStepError('Please review and agree to the privacy policy to submit.');
      return;
    }

    setLoading(true);
    setResult(null);
    setStepError(null);

    const payload: InquiryPayload = {
      inquiryType: 'quotation',
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone || undefined,
      organization: formData.organization || undefined,
      country: formData.country || undefined,
      preferredContactMethod: formData.preferredContactMethod,
      serviceSlug: formData.serviceSlug,
      projectSummary: formData.projectSummary,
      projectDetails: formData.projectDetails,
      intendedAudience: formData.intendedAudience || undefined,
      existingWebsiteUrl: formData.existingWebsiteUrl || undefined,
      preferredTechnologies: formData.preferredTechnologies || undefined,
      budgetRange: formData.budgetRange,
      preferredTimeline: formData.preferredTimeline,
      desiredStartDate: formData.desiredStartDate || undefined,
      additionalNotes: formData.additionalNotes || undefined,
      privacyConsent: formData.privacyConsent,
      honeypot: formData.honeypot,
    };

    const res = await submitInquiry(payload);
    setResult(res);
    setLoading(false);
  };

  const currentServiceName =
    servicesData.find((s) => s.slug === formData.serviceSlug)?.name || formData.serviceSlug;

  // Optional WhatsApp Summary Link
  const whatsAppPhone = siteConfig.contact.whatsappNumber;
  const whatsAppMessage = buildWhatsAppProjectSummary(
    {
      inquiryType: 'quotation',
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      organization: formData.organization,
      serviceSlug: currentServiceName,
      projectSummary: formData.projectSummary,
      projectDetails: formData.projectDetails,
      budgetRange: formData.budgetRange,
      preferredTimeline: formData.preferredTimeline,
      privacyConsent: formData.privacyConsent,
    },
    result?.referenceCode
  );
  const whatsAppLink = whatsAppPhone ? generateWhatsAppLink(whatsAppPhone, whatsAppMessage) : '';

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0F172A] p-6 sm:p-10 shadow-xl max-w-3xl mx-auto">
      {/* Wizard Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-3">
          <span className={currentStep === 1 ? 'text-purple-400 font-semibold' : ''}>1. Contact</span>
          <span className={currentStep === 2 ? 'text-purple-400 font-semibold' : ''}>2. Project</span>
          <span className={currentStep === 3 ? 'text-purple-400 font-semibold' : ''}>3. Planning</span>
          <span className={currentStep === 4 ? 'text-purple-400 font-semibold' : ''}>4. Review</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Error Notification */}
      {stepError && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{stepError}</span>
        </div>
      )}

      {/* Submission Result Notification */}
      {result && result.success ? (
        <div className="py-6 space-y-6 text-center animate-in fade-in">
          <div className="w-16 h-16 rounded-2xl bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white tracking-tight">
              Quotation Request Received
            </h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              {result.message}
            </p>
            {result.referenceCode && (
              <div className="inline-block px-4 py-2 mt-2 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-purple-300">
                Reference Code: <strong className="text-white">{result.referenceCode}</strong>
              </div>
            )}
          </div>

          {/* WhatsApp option if configured */}
          {whatsAppLink && (
            <div className="mt-6 p-5 rounded-xl bg-slate-900/80 border border-slate-800 text-left max-w-md mx-auto space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <MessageSquare className="w-4 h-4" />
                <span>Optional WhatsApp Direct Follow-up</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your request is securely logged. If you prefer to also start a real-time conversation immediately, you can open WhatsApp with your pre-filled project brief.
              </p>
              <a
                href={whatsAppLink}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 mt-1 px-4 py-2 text-xs font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-800/60 rounded-lg hover:bg-emerald-900/60 transition-colors"
              >
                <span>Open Brief in WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <p className="text-[10px] text-slate-400">
                Note: Opening WhatsApp creates a separate mobile chat and is not required for your quotation to be processed.
              </p>
            </div>
          )}

          <div className="pt-4 flex justify-center gap-4">
            <Link
              to="/services"
              className="px-5 py-2.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Explore Other Services
            </Link>
            <Link
              to="/"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          {/* Honeypot */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="hp_quote">Leave empty</label>
            <input
              id="hp_quote"
              type="text"
              value={formData.honeypot}
              onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* STEP 1: Contact Details */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Step 1: Your Contact Information</h3>
                <p className="text-xs text-slate-400 mt-1">
                  How we can reach you to provide your estimate and discuss specifications.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="q_name" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Full Name <span className="text-purple-400">*</span>
                  </label>
                  <input
                    id="q_name"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Grace Wanjiku"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="q_email" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email Address <span className="text-purple-400">*</span>
                  </label>
                  <input
                    id="q_email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. grace@organization.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="q_phone" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    id="q_phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+254 700 000 000"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="q_org" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Company, School, or Organization
                  </label>
                  <input
                    id="q_org"
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="e.g. Nairobi Preparatory School"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="q_country" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Country
                  </label>
                  <input
                    id="q_country"
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="e.g. Kenya, United Kingdom, USA"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Preferred Contact Method
                  </label>
                  <select
                    value={formData.preferredContactMethod}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferredContactMethod: e.target.value as any,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                  >
                    <option value="email">Email</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="phone">Phone Call</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Project Details */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Step 2: Project Details</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Tell us what you want to build, modernize, or integrate.
                </p>
              </div>

              <div>
                <label htmlFor="q_service" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Primary Service Category <span className="text-purple-400">*</span>
                </label>
                <select
                  id="q_service"
                  value={formData.serviceSlug}
                  onChange={(e) => setFormData({ ...formData, serviceSlug: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                >
                  {servicesData.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="q_summary" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Project Title or Brief Summary <span className="text-purple-400">*</span>
                </label>
                <input
                  id="q_summary"
                  type="text"
                  required
                  value={formData.projectSummary}
                  onChange={(e) => setFormData({ ...formData, projectSummary: e.target.value })}
                  placeholder="e.g. New corporate website or school fees management system"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="q_details" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Detailed Requirements <span className="text-purple-400">*</span>
                </label>
                <textarea
                  id="q_details"
                  rows={4}
                  required
                  value={formData.projectDetails}
                  onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
                  placeholder="Describe your current setup, the core problems to solve, desired key features, and deliverables..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors resize-y"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="q_web" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Existing Website or System URL <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    id="q_web"
                    type="url"
                    value={formData.existingWebsiteUrl}
                    onChange={(e) => setFormData({ ...formData, existingWebsiteUrl: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="q_audience" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Target Users / Audience <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    id="q_audience"
                    type="text"
                    value={formData.intendedAudience}
                    onChange={(e) => setFormData({ ...formData, intendedAudience: e.target.value })}
                    placeholder="e.g. Parents & Teachers, B2B Clients, Consumers"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Planning & Budget */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Step 3: Timeline & Budget Range</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Budget ranges are flexible guidelines that help us recommend the most pragmatic technical approach.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Estimated Budget Range
                </label>
                <div className="space-y-2">
                  {budgetOptions.map((opt) => (
                    <label
                      key={opt}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors text-xs ${
                        formData.budgetRange === opt
                          ? 'border-purple-500 bg-purple-950/30 text-white'
                          : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="budget"
                        value={opt}
                        checked={formData.budgetRange === opt}
                        onChange={() => setFormData({ ...formData, budgetRange: opt })}
                        className="text-purple-600 focus:ring-purple-500 bg-slate-900 border-slate-700"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Preferred Timeline
                  </label>
                  <select
                    value={formData.preferredTimeline}
                    onChange={(e) => setFormData({ ...formData, preferredTimeline: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                  >
                    {timelineOptions.map((tl) => (
                      <option key={tl} value={tl}>
                        {tl}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="q_date" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Desired Start Date <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    id="q_date"
                    type="date"
                    value={formData.desiredStartDate}
                    onChange={(e) => setFormData({ ...formData, desiredStartDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="q_notes" className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Additional Notes or Specific Constraints <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  id="q_notes"
                  rows={3}
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                  placeholder="e.g. Must integrate with existing M-Pesa paybill or require specific hosting location"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors resize-y"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Review & Consent */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Step 4: Review Your Quotation Request</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Please confirm your details before submitting.
                </p>
              </div>

              {/* Review summary cards */}
              <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="font-semibold text-purple-300 flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4" />
                    <span>Summary of Details</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs text-purple-400 hover:underline"
                  >
                    Edit details
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Contact Person:</span>
                    <strong className="text-white">{formData.fullName}</strong> ({formData.email})
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Organization / Country:</span>
                    <span>{formData.organization || 'Individual / Startup'} · {formData.country}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Selected Service:</span>
                    <strong className="text-white">{currentServiceName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Budget & Timeline:</span>
                    <span>{formData.budgetRange} · {formData.preferredTimeline}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-slate-400 block text-[11px]">Project Title & Requirements:</span>
                  <p className="text-slate-200 mt-1 font-medium">{formData.projectSummary}</p>
                  <p className="text-slate-400 mt-1 line-clamp-3 leading-relaxed">{formData.projectDetails}</p>
                </div>
              </div>

              {/* Privacy Consent */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-400 leading-relaxed">
                  <input
                    type="checkbox"
                    required
                    checked={formData.privacyConsent}
                    onChange={(e) => setFormData({ ...formData, privacyConsent: e.target.checked })}
                    className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 bg-slate-900 border-slate-700"
                  />
                  <span>
                    I confirm this request is accurate and agree that JUANET.cloud may store and process my information to prepare a quotation in accordance with the{' '}
                    <Link to="/privacy" className="text-purple-400 underline hover:text-purple-300">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Navigation & Submission Controls */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between gap-4">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : <div />}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors shadow-sm shadow-purple-950/50"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !formData.privacyConsent}
                className="inline-flex items-center gap-2 px-7 py-2.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 active:bg-purple-700 disabled:opacity-50 rounded-lg transition-colors shadow-sm shadow-purple-950/50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Quotation...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Service Request</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};
