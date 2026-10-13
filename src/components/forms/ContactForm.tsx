import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { submitInquiry } from '../../lib/supabase/services';
import { InquiryPayload, InquirySubmissionResult } from '../../types';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    subject: '',
    message: '',
    preferredContactMethod: 'email' as 'email' | 'phone' | 'whatsapp',
    privacyConsent: false,
    honeypot: '',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InquirySubmissionResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setResult(null);

    const payload: InquiryPayload = {
      inquiryType: 'contact',
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone || undefined,
      organization: formData.organization || undefined,
      subject: formData.subject || undefined,
      message: formData.message,
      preferredContactMethod: formData.preferredContactMethod,
      privacyConsent: formData.privacyConsent,
      honeypot: formData.honeypot,
    };

    const res = await submitInquiry(payload);
    setResult(res);
    setLoading(false);

    if (res.success) {
      // Clear form on confirmed success
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        organization: '',
        subject: '',
        message: '',
        preferredContactMethod: 'email',
        privacyConsent: false,
        honeypot: '',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-sm" noValidate>
      {/* Anti-spam Honeypot (hidden from real users) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="hp_contact">Leave blank</label>
        <input
          id="hp_contact"
          type="text"
          value={formData.honeypot}
          onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Success Notification */}
      {result && result.success && (
        <div className="p-5 rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-emerald-200">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-emerald-300">Message Received</h4>
              <p className="text-xs text-emerald-300/90 mt-1">{result.message}</p>
              {result.referenceCode && (
                <p className="text-xs font-mono mt-2 text-emerald-400">
                  Reference Code: <span className="font-bold underline">{result.referenceCode}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {result && !result.success && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="font-semibold text-rose-300">Submission Error</h4>
            <p className="mt-0.5">{result.message}</p>
          </div>
        </div>
      )}

      {/* Row 1: Name & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact_name" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Full Name <span className="text-purple-400">*</span>
          </label>
          <input
            id="contact_name"
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="e.g. David Mwangi"
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="contact_email" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Email Address <span className="text-purple-400">*</span>
          </label>
          <input
            id="contact_email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="e.g. david@company.com"
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
          />
        </div>
      </div>

      {/* Row 2: Phone & Organization (Optional) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact_phone" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Phone / WhatsApp <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            id="contact_phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+254 700 000 000"
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
          />
        </div>

        <div>
          <label htmlFor="contact_org" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Company / Organization <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            id="contact_org"
            type="text"
            value={formData.organization}
            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
            placeholder="e.g. Apex Tech Ltd"
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="contact_subject" className="block text-xs font-semibold text-slate-300 mb-1.5">
          Subject <span className="text-purple-400">*</span>
        </label>
        <input
          id="contact_subject"
          type="text"
          required
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder="e.g. Website redesign inquiry or system migration"
          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact_message" className="block text-xs font-semibold text-slate-300 mb-1.5">
          Message <span className="text-purple-400">*</span>
        </label>
        <textarea
          id="contact_message"
          rows={4}
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Tell us what you would like to build, improve, or ask..."
          className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors resize-y"
        />
      </div>

      {/* Preferred Contact Method */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2">
          Preferred Response Method
        </label>
        <div className="flex flex-wrap gap-4 text-xs text-slate-300">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="contact_pref"
              value="email"
              checked={formData.preferredContactMethod === 'email'}
              onChange={() => setFormData({ ...formData, preferredContactMethod: 'email' })}
              className="text-purple-600 focus:ring-purple-500 bg-slate-900 border-slate-700"
            />
            <span>Email</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="contact_pref"
              value="whatsapp"
              checked={formData.preferredContactMethod === 'whatsapp'}
              onChange={() => setFormData({ ...formData, preferredContactMethod: 'whatsapp' })}
              className="text-purple-600 focus:ring-purple-500 bg-slate-900 border-slate-700"
            />
            <span>WhatsApp</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="contact_pref"
              value="phone"
              checked={formData.preferredContactMethod === 'phone'}
              onChange={() => setFormData({ ...formData, preferredContactMethod: 'phone' })}
              className="text-purple-600 focus:ring-purple-500 bg-slate-900 border-slate-700"
            />
            <span>Phone Call</span>
          </label>
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
            I agree that JUANET.cloud may process my submitted details to respond to this inquiry in accordance with the{' '}
            <Link to="/privacy" className="text-purple-400 underline hover:text-purple-300">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-500 active:bg-purple-700 disabled:opacity-50 transition-all shadow-sm shadow-purple-950/50"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Sending Message...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Send Message</span>
          </>
        )}
      </button>
    </form>
  );
};
