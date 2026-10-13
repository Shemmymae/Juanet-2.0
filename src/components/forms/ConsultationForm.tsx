import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { submitInquiry } from '../../lib/supabase/services';
import { InquiryPayload, InquirySubmissionResult } from '../../types';
import { siteConfig } from '../../config/site';
import { Calendar, CheckCircle2, AlertCircle, Loader2, ArrowRight, Clock } from 'lucide-react';

export const ConsultationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    consultationTopic: 'Technical Feasibility & Architecture',
    consultationDescription: '',
    preferredDate: '',
    preferredTimeWindow: 'Morning (09:00 - 12:00 EAT)',
    timeZone: 'Africa/Nairobi (UTC+3)',
    preferredContactMethod: 'email' as 'email' | 'phone' | 'whatsapp',
    privacyConsent: false,
    honeypot: '',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InquirySubmissionResult | null>(null);

  const topics = [
    'Technical Feasibility & Architecture',
    'Website / Web Application Project',
    'School Management System Deployment',
    'Business Process Automation & APIs',
    'AI Integrations & Feasibility',
    'Hosting, Domain, or Email Infrastructure',
    'Other Custom Digital Inquiry',
  ];

  const timeWindows = [
    'Morning (09:00 - 12:00 EAT / UTC+3)',
    'Afternoon (13:00 - 16:00 EAT / UTC+3)',
    'Evening (16:00 - 18:00 EAT / UTC+3)',
    'Flexible / Let JUANET suggest',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setResult(null);

    const payload: InquiryPayload = {
      inquiryType: 'consultation',
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone || undefined,
      organization: formData.organization || undefined,
      preferredContactMethod: formData.preferredContactMethod,
      consultationTopic: formData.consultationTopic,
      consultationDescription: formData.consultationDescription,
      preferredDate: formData.preferredDate || undefined,
      preferredTimeWindow: formData.preferredTimeWindow,
      timeZone: formData.timeZone,
      privacyConsent: formData.privacyConsent,
      honeypot: formData.honeypot,
    };

    const res = await submitInquiry(payload);
    setResult(res);
    setLoading(false);

    if (res.success) {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        organization: '',
        consultationTopic: topics[0],
        consultationDescription: '',
        preferredDate: '',
        preferredTimeWindow: timeWindows[0],
        timeZone: 'Africa/Nairobi (UTC+3)',
        preferredContactMethod: 'email',
        privacyConsent: false,
        honeypot: '',
      });
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0F172A] p-6 sm:p-10 shadow-xl max-w-2xl mx-auto">
      {/* Important Notice */}
      <div className="mb-6 p-4 rounded-xl bg-purple-950/40 border border-purple-800/60 text-purple-200 text-xs flex items-start gap-3">
        <Clock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Consultation Request:</strong> This form logs your advisory request. Our team reviews your topics and confirms an agreed meeting time via your preferred contact channel. (No automatic calendar bookings are confirmed until acknowledged).
        </p>
      </div>

      {result && result.success ? (
        <div className="py-6 space-y-5 text-center animate-in fade-in">
          <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white tracking-tight">
              Consultation Request Received
            </h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Thank you for reaching out. A technology specialist will review your topic and propose a confirmed meeting link or invite.
            </p>
            {result.referenceCode && (
              <div className="inline-block px-3 py-1.5 mt-2 rounded bg-slate-900 border border-slate-800 font-mono text-xs text-purple-300">
                Reference Code: <strong className="text-white">{result.referenceCode}</strong>
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-center gap-3">
            <Link
              to="/services"
              className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Browse Services
            </Link>
            <Link
              to="/"
              className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 text-sm" noValidate>
          {/* Honeypot */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="hp_consult">Do not fill</label>
            <input
              id="hp_consult"
              type="text"
              value={formData.honeypot}
              onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {result && !result.success && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{result.message}</span>
            </div>
          )}

          {/* Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cons_name" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name <span className="text-purple-400">*</span>
              </label>
              <input
                id="cons_name"
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. John Kariuki"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="cons_email" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address <span className="text-purple-400">*</span>
              </label>
              <input
                id="cons_email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. john@business.com"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              />
            </div>
          </div>

          {/* Phone & Organization */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cons_phone" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Phone / WhatsApp <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                id="cons_phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+254 700 000 000"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="cons_org" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Company / Organization <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                id="cons_org"
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="e.g. Frontier Solutions"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              />
            </div>
          </div>

          {/* Topic */}
          <div>
            <label htmlFor="cons_topic" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Consultation Topic <span className="text-purple-400">*</span>
            </label>
            <select
              id="cons_topic"
              value={formData.consultationTopic}
              onChange={(e) => setFormData({ ...formData, consultationTopic: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
            >
              {topics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="cons_desc" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Brief Discussion Goals / Questions <span className="text-purple-400">*</span>
            </label>
            <textarea
              id="cons_desc"
              rows={3}
              required
              value={formData.consultationDescription}
              onChange={(e) => setFormData({ ...formData, consultationDescription: e.target.value })}
              placeholder="What specific questions would you like to explore during the discussion?"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors resize-y"
            />
          </div>

          {/* Preferred Date & Time Window */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cons_date" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Preferred Date <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                id="cons_date"
                type="date"
                value={formData.preferredDate}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Preferred Time Window
              </label>
              <select
                value={formData.preferredTimeWindow}
                onChange={(e) => setFormData({ ...formData, preferredTimeWindow: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              >
                {timeWindows.map((tw) => (
                  <option key={tw} value={tw}>
                    {tw}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Timezone & Contact Preference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cons_tz" className="block text-xs font-semibold text-slate-300 mb-1.5">
                Your Time Zone
              </label>
              <input
                id="cons_tz"
                type="text"
                value={formData.timeZone}
                onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Contact Preference
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

          {/* Consent */}
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
                I agree that JUANET.cloud may review my details to arrange a consultation in accordance with the{' '}
                <Link to="/privacy" className="text-purple-400 underline hover:text-purple-300">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
          </div>

          {/* Submit */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={loading || !formData.privacyConsent}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 active:bg-purple-700 disabled:opacity-50 rounded-lg transition-colors shadow-sm shadow-purple-950/50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Request...</span>
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  <span>Request Consultation</span>
                </>
              )}
            </button>
          </div>

          {/* Optional external scheduler note if configured */}
          {siteConfig.schedulingUrl && (
            <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
              Need immediate self-scheduling? You can also{' '}
              <a
                href={siteConfig.schedulingUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="text-purple-400 underline inline-flex items-center gap-1 hover:text-purple-300"
              >
                <span>book directly on our scheduling calendar</span>
                <ArrowRight className="w-3 h-3" />
              </a>
              .
            </div>
          )}
        </form>
      )}
    </div>
  );
};
