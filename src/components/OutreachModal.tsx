import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Send, 
  RefreshCw, 
  SlidersHorizontal,
  Mail,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { Business, Opportunity, OutreachGeneration, UserProfile } from '../types.js';

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
      const result = await onGenerateOutreach({
        businessId: business.id,
        opportunityId: topOpp.id,
        angle,
        tone,
      });

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-7 text-left relative my-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tailored Commercial Outreach Generator</span>
        </div>
        <h2 className="text-xl font-bold text-slate-950">
          Personalized Pitch for {business.name}
        </h2>
        <p className="text-xs text-slate-600 mt-0.5 mb-5">
          Grounded directly in verifiable findings. References specific digital presence signals rather than generic templates.
        </p>

        {/* Angle & Strategy Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
          {[
            {
              id: 'problem_solution',
              title: 'Problem-First Angle',
              desc: 'Leads with specific verified finding & frictionless fix'
            },
            {
              id: 'value_audit',
              title: 'Value Benchmark Angle',
              desc: 'Presents industry benchmarks & potential lead lift'
            },
            {
              id: 'consultative_inquiry',
              title: 'Executive Inquiry',
              desc: 'Peer-level consultative inquiry regarding quarterly growth'
            },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setAngle(item.id as any)}
              className={`p-3 rounded-lg border text-left transition-all ${
                angle === item.id
                  ? 'border-indigo-600 bg-indigo-50/60 text-indigo-950'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <p className="text-xs font-bold leading-tight">{item.title}</p>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">{item.desc}</p>
            </button>
          ))}
        </div>

        {/* Controls Bar: Tone + Trigger */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 mb-5">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-600">Tone:</span>
            <div className="flex rounded-md border border-slate-300 bg-white p-0.5">
              {(['consultative', 'direct', 'professional'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded capitalize ${
                    tone === t ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
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
            className="inline-flex items-center justify-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Synthesizing Outreach...' : (body ? 'Regenerate Draft' : 'Generate Tailored Outreach')}</span>
          </button>
        </div>

        {/* Generated Email Form (Editable) */}
        {body ? (
          <div className="space-y-3.5">
            {/* Subject Line */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Subject Line
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-xs font-semibold text-slate-900 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Email Body */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Message Body (Editable)
              </label>
              <textarea
                rows={6}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full text-xs text-slate-800 p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
              />
            </div>

            {/* Call to Action */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Low-Friction Call To Action
              </label>
              <input
                type="text"
                value={callToAction}
                onChange={(e) => setCallToAction(e.target.value)}
                className="w-full text-xs font-medium text-slate-900 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Referenced Evidence Footprint */}
            {referencedEvidence.length > 0 && (
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                  Verifiable Findings Cited In This Message
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {referencedEvidence.map((ev, i) => (
                    <span key={i} className="text-[10px] font-medium bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700">
                      ✓ {ev}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions: Copy & Export */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-200">
              <span className="text-[11px] text-slate-500">
                Recipient: {business.email || 'Public inquiry channel'}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export .txt</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Full Message'}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-xl text-slate-500 text-xs">
            <Mail className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">Ready to synthesize personalized pitch</p>
            <p className="text-slate-500 text-[11px] mt-1 max-w-sm mx-auto">
              Select your preferred angle and click "Generate Tailored Outreach" above to synthesize an email citing {business.name}'s exact digital signals.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
