import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Copy,
  Check,
  Download,
  RefreshCw,
  Mail,
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
    { id: 'problem_solution', title: 'Problem-first', desc: 'Opens with the specific verified finding — mobile viewport missing, no CTA, etc.' },
    { id: 'value_audit', title: 'Benchmark case', desc: 'Presents industry benchmarks and where this company falls short.' },
    { id: 'consultative_inquiry', title: 'Executive inquiry', desc: 'Peer-level tone, light on specifics, designed to start a conversation.' },
  ];

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.65)', padding: '16px', overflowY: 'auto' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--border-moderate)',
          borderRadius: '6px',
          maxWidth: '660px',
          width: '100%',
          padding: '28px',
          position: 'relative',
          margin: 'auto',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <X style={{ width: '18px', height: '18px' }} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Sparkles style={{ width: '13px', height: '13px', color: 'var(--amber)' }} />
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--amber)' }}>Outreach generator</span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Pitch for {business.name}
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>
          Grounded in verifiable findings from the technical audit — not generic templates.
        </p>

        {/* Angle selector — no uniform SaaS card kit, just clear option buttons */}
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Pitch angle</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {ANGLES.map(a => {
              const isActive = angle === a.id;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAngle(a.id as any)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '4px',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--amber-border)' : 'var(--border-moderate)',
                    background: isActive ? 'var(--amber-surface)' : 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 120ms ease',
                  }}
                >
                  <p style={{ fontSize: '12px', fontWeight: 600, color: isActive ? 'var(--amber-bright)' : 'var(--text-primary)', marginBottom: '4px' }}>{a.title}</p>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>{a.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tone + generate */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
            padding: '12px 14px',
            background: 'var(--surface-2)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '4px',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>Tone:</span>
            <div style={{ display: 'flex', border: '1px solid var(--border-moderate)', borderRadius: '3px', overflow: 'hidden' }}>
              {(['consultative', 'direct', 'professional'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  style={{
                    fontSize: '11px',
                    fontWeight: tone === t ? 600 : 400,
                    padding: '5px 10px',
                    background: tone === t ? 'var(--amber-surface)' : 'transparent',
                    color: tone === t ? 'var(--amber-bright)' : 'var(--text-secondary)',
                    border: 'none',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    transition: 'all 100ms ease',
                    borderRight: t !== 'professional' ? '1px solid var(--border-subtle)' : 'none',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleGenerate} disabled={isGenerating} className="btn-primary" style={{ fontSize: '12px' }}>
            <RefreshCw style={{ width: '12px', height: '12px', animation: isGenerating ? 'spin 1s linear infinite' : 'none' }} />
            {isGenerating ? 'Synthesising with Gemini…' : body ? 'Regenerate draft' : 'Generate pitch draft'}
          </button>
        </div>

        {/* Output */}
        {body ? (
          <div className="space-y-4">
            {/* Subject */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Subject line</label>
              <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="field-input" style={{ fontWeight: 600 }} />
            </div>

            {/* Body */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Message body (editable)</label>
              <textarea rows={7} value={body} onChange={e => setBody(e.target.value)} className="field-input" style={{ resize: 'vertical', lineHeight: 1.65 }} />
            </div>

            {/* CTA */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Call to action</label>
              <input type="text" value={callToAction} onChange={e => setCallToAction(e.target.value)} className="field-input" />
            </div>

            {/* Evidence footprint */}
            {referencedEvidence.length > 0 && (
              <div style={{ padding: '12px 14px', background: 'var(--teal-surface)', border: '1px solid var(--teal-border)', borderRadius: '4px' }}>
                <p style={{ fontSize: '10px', fontWeight: 600, color: 'var(--teal-bright)', marginBottom: '8px' }}>
                  Findings cited in this message
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {referencedEvidence.map((ev, i) => (
                    <span
                      key={i}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '11px',
                        color: 'var(--teal-bright)',
                        background: 'var(--ground)',
                        border: '1px solid var(--teal-border)',
                        padding: '3px 8px',
                        borderRadius: '3px',
                      }}
                    >
                      <Check style={{ width: '10px', height: '10px' }} />
                      {ev}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {business.email || 'Public inquiry channel'}
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleDownload} className="btn-secondary" style={{ fontSize: '12px' }}>
                  <Download style={{ width: '12px', height: '12px' }} />
                  Export .txt
                </button>
                <button onClick={handleCopy} className="btn-primary" style={{ fontSize: '12px' }}>
                  {copied ? <Check style={{ width: '12px', height: '12px' }} /> : <Copy style={{ width: '12px', height: '12px' }} />}
                  {copied ? 'Copied' : 'Copy message'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: '40px 24px',
              textAlign: 'center',
              border: '1px dashed var(--border-moderate)',
              borderRadius: '4px',
            }}
          >
            <Mail style={{ width: '24px', height: '24px', color: 'var(--text-muted)', margin: '0 auto 12px' }} />
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Ready to synthesise
            </p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '360px', margin: '0 auto', lineHeight: 1.6 }}>
              Select your angle and click "Generate pitch draft" to produce an email citing {business.name}'s exact digital signals.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
