import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Copy,
  Check,
  Download,
  RefreshCw,
  Mail,
  Send,
  Zap,
} from 'lucide-react';
import { Business, OutreachGeneration, UserProfile } from '../types.js';

interface OutreachModalProps {
  business: Business | null;
  userProfile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onGenerateOutreach: (params: {
    businessId: string;
    opportunityId: string;
    angle: 'problem_solution' | 'value_audit' | 'consultative_inquiry';
    tone?: 'professional' | 'direct' | 'consultative';
  }) => Promise<OutreachGeneration>;
}

export const OutreachModal: React.FC<OutreachModalProps> = ({
  business,
  userProfile,
  isOpen,
  onClose,
  onGenerateOutreach,
}) => {
  const [angle, setAngle] = useState<'problem_solution' | 'value_audit' | 'consultative_inquiry'>('problem_solution');
  const [tone, setTone] = useState<'professional' | 'direct' | 'consultative'>('consultative');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [callToAction, setCallToAction] = useState('');
  const [referencedEvidence, setReferencedEvidence] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !business) return null;

  const topOpp = business.opportunities[0];

  const handleGenerate = async () => {
    if (!topOpp) return;
    setIsGenerating(true);
    try {
      const result = await onGenerateOutreach({ businessId: business.id, opportunityId: topOpp.id, angle, tone });
      setSubject(result.subject);
      setBody(result.body);
      setCallToAction(result.callToAction);
      setReferencedEvidence(result.referencedEvidence || topOpp.triad.observed);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    const fullText = `Subject: ${subject}\n\n${body}\n\n${callToAction}\n\nBest regards,\n${userProfile.name}\n${userProfile.agencyName}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const fullText = `To: ${business.email || 'Decision Maker'} <${business.name}>\nSubject: ${subject}\n\n${body}\n\n${callToAction}\n\nBest regards,\n${userProfile.name}\n${userProfile.agencyName}\n${userProfile.primaryService}`;
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Outreach_${business.name.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const ANGLES = [
    {
      id: 'problem_solution',
      title: 'Problem & Solution',
      desc: 'Cites specific flaws found (e.g. mobile breakage) & offers rapid turnaround.'
    },
    {
      id: 'value_audit',
      title: 'Industry Benchmark',
      desc: 'Shows how competitors outrank them and quantifies potential lost revenue.'
    },
    {
      id: 'consultative_inquiry',
      title: 'Consultative Inquiry',
      desc: 'Polite, peer-to-peer executive inquiry asking about digital growth goals.'
    },
  ] as const;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="card w-full max-w-2xl p-6 sm:p-8 relative my-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-scale-up"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Evidence Outreach Pitch</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
            Tailored Pitch for {business.name}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            This pitch references the exact flaws detected during the technical audit of their digital presence.
          </p>
        </div>

        {/* Angle Selection Cards */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            Select Outreach Angle
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ANGLES.map(a => {
              const isSelected = angle === a.id;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAngle(a.id)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/30 dark:border-amber-500 text-[var(--text-primary)] shadow-xs'
                      : 'border-[var(--border-moderate)] hover:bg-[var(--surface-2)] text-[var(--text-secondary)]'
                  }`}
                >
                  <p className="text-sm font-bold mb-1 text-[var(--text-primary)]">
                    {a.title}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {a.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tone & Generate Button Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border-subtle)]">
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[var(--text-secondary)]">Tone:</span>
            <div className="flex rounded-lg border border-[var(--border-moderate)] bg-[var(--surface-1)] p-0.5">
              {(['consultative', 'direct', 'professional'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-3 py-1 rounded-md text-xs font-medium capitalize cursor-pointer transition-colors ${
                    tone === t
                      ? 'bg-amber-600 text-white font-bold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="btn-primary text-xs cursor-pointer justify-center"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generating Pitch with Gemini...' : body ? 'Regenerate Pitch' : 'Generate Tailored Email'}</span>
          </button>

        </div>

        {/* Email Draft Output Area */}
        {body ? (
          <div className="space-y-4 pt-2">
            
            {/* Subject Line */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Subject Line
              </label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="field-input font-medium"
              />
            </div>

            {/* Body */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Email Message (Editable)
              </label>
              <textarea
                rows={7}
                value={body}
                onChange={e => setBody(e.target.value)}
                className="field-input text-sm leading-relaxed"
              />
            </div>

            {/* CTA */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Call to Action
              </label>
              <input
                type="text"
                value={callToAction}
                onChange={e => setCallToAction(e.target.value)}
                className="field-input font-medium text-xs"
              />
            </div>

            {/* Evidence footprint */}
            {referencedEvidence.length > 0 && (
              <div className="p-3.5 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/50">
                <span className="text-xs font-bold text-teal-800 dark:text-teal-300 block mb-2">
                  ✓ Verified Digital Evidence Cited in This Message
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {referencedEvidence.map((ev, i) => (
                    <span
                      key={i}
                      className="badge badge-teal text-[11px]"
                    >
                      {ev}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border-subtle)]">
              <div className="text-xs text-[var(--text-muted)]">
                Recipient: <strong className="text-[var(--text-primary)] font-mono">{business.email || 'Public contact channel'}</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  className="btn-secondary text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export .txt</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="btn-primary text-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Full Email'}</span>
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className="card p-10 text-center space-y-3 bg-[var(--surface-2)]">
            <Mail className="w-10 h-10 text-[var(--text-muted)] mx-auto" />
            <h4 className="text-base font-bold text-[var(--text-primary)]">
              Ready to generate personalized pitch
            </h4>
            <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
              Pick your preferred angle above and click <strong>"Generate Tailored Email"</strong>. Gemini will compose a ready-to-send pitch referencing {business.name}'s exact mobile and conversion flaws.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
