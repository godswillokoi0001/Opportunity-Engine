import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { ServiceType, UserProfile } from '../types.js';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveProfile: (updated: Partial<UserProfile>) => Promise<void>;
}

const AVAILABLE_SERVICES: ServiceType[] = [
  'Website Design & Development',
  'Website Redesign & Modernization',
  'SEO & Search Visibility',
  'Conversion Rate Optimization (CRO)',
  'Branding & Creative Identity',
  'Social Media & Content Strategy',
  'B2B Lead Generation',
  'Custom Software & Mobile Apps',
];

const SUGGESTED_INDUSTRIES = [
  'Logistics & Supply Chain',
  'Real Estate & Property',
  'Hospitality & Tourism',
  'Professional Services & Legal',
  'Healthcare & Medical',
  'Manufacturing & Industrial',
  'Financial Advisory & Fintech',
  'Construction & Engineering',
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [agencyName, setAgencyName] = useState(userProfile.agencyName || '');
  const [primaryService, setPrimaryService] = useState<ServiceType>(userProfile.primaryService || 'Website Design & Development');
  const [targetLocations, setTargetLocations] = useState<string>(userProfile.targetLocations.join(', ') || 'Lagos, Nigeria');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(userProfile.targetIndustries || ['Logistics', 'Real Estate']);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const toggleIndustry = (ind: string) => {
    if (selectedIndustries.includes(ind)) {
      setSelectedIndustries(selectedIndustries.filter(i => i !== ind));
    } else {
      setSelectedIndustries([...selectedIndustries, ind]);
    }
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const locs = targetLocations.split(',').map(s => s.trim()).filter(Boolean);
      await onSaveProfile({
        agencyName,
        primaryService,
        targetLocations: locs.length ? locs : ['Lagos, Nigeria'],
        targetIndustries: selectedIndustries.length ? selectedIndustries : ['Logistics'],
      });
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  /* Step indicator dots — no middle-dot separator, no ALL-CAPS eyebrow */
  const StepIndicator = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
      {[1, 2, 3].map(n => (
        <React.Fragment key={n}>
          <div
            style={{
              width: n <= step ? '20px' : '6px',
              height: '6px',
              borderRadius: '3px',
              background: n === step ? 'var(--amber)' : n < step ? 'var(--teal)' : 'var(--border-moderate)',
              transition: 'width 200ms ease, background-color 200ms ease',
              flexShrink: 0,
            }}
          />
          {n < 3 && (
            <div style={{ height: '1px', flex: 1, background: 'var(--border-subtle)' }} />
          )}
        </React.Fragment>
      ))}
      <span style={{ marginLeft: '8px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
        {step} / 3
      </span>
    </div>
  );

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
          maxWidth: '540px',
          width: '100%',
          padding: '28px',
          position: 'relative',
          margin: 'auto',
        }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <X style={{ width: '18px', height: '18px' }} />
        </button>

        <StepIndicator />

        {/* ── Step 1: Core service ─────────────────────────────────── */}
        {step === 1 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '6px' }}>
              What service do you sell?
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>
              The engine evaluates businesses against the specific technical weaknesses your service fixes.
            </p>

            <div className="space-y-4">
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Agency or studio name
                </label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={e => setAgencyName(e.target.value)}
                  placeholder="e.g. Sterling Digital Partners"
                  className="field-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Primary service
                </label>
                <div className="space-y-1.5" style={{ maxHeight: '240px', overflowY: 'auto' }}>
                  {AVAILABLE_SERVICES.map(srv => {
                    const isSelected = primaryService === srv;
                    return (
                      <button
                        key={srv}
                        type="button"
                        onClick={() => setPrimaryService(srv)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: '4px',
                          border: '1px solid',
                          borderColor: isSelected ? 'var(--amber-border)' : 'var(--border-moderate)',
                          background: isSelected ? 'var(--amber-surface)' : 'transparent',
                          color: isSelected ? 'var(--amber-bright)' : 'var(--text-secondary)',
                          fontWeight: isSelected ? 600 : 400,
                          fontSize: '12px',
                          cursor: 'pointer',
                          transition: 'all 120ms ease',
                        }}
                      >
                        <span>{srv}</span>
                        {isSelected && <Check style={{ width: '13px', height: '13px' }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="button" onClick={() => setStep(2)} className="btn-primary">
                Set target markets
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Geography & industries ──────────────────────── */}
        {step === 2 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Who do you sell to?
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>
              Specify target commercial hubs and the industries where you have domain expertise.
            </p>

            <div className="space-y-4">
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Target locations (comma-separated)
                </label>
                <input
                  type="text"
                  value={targetLocations}
                  onChange={e => setTargetLocations(e.target.value)}
                  placeholder="Lagos, Nigeria, London, UK"
                  className="field-input"
                />
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Example: "Lagos, Nigeria" or "London, United Kingdom"</p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Target industries
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SUGGESTED_INDUSTRIES.map(ind => {
                    const isSelected = selectedIndustries.includes(ind) || selectedIndustries.some(si => ind.toLowerCase().includes(si.toLowerCase()));
                    return (
                      <button
                        key={ind}
                        type="button"
                        onClick={() => toggleIndustry(ind)}
                        style={{
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '9px 12px',
                          borderRadius: '4px',
                          border: '1px solid',
                          borderColor: isSelected ? 'var(--teal-border)' : 'var(--border-moderate)',
                          background: isSelected ? 'var(--teal-surface)' : 'transparent',
                          color: isSelected ? 'var(--teal-bright)' : 'var(--text-secondary)',
                          fontWeight: isSelected ? 600 : 400,
                          fontSize: '12px',
                          cursor: 'pointer',
                          transition: 'all 120ms ease',
                        }}
                      >
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ind}</span>
                        {isSelected && <Check style={{ width: '12px', height: '12px', flexShrink: 0, marginLeft: '4px' }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '24px' }}>
              <button type="button" onClick={() => setStep(1)} className="btn-ghost">
                Back
              </button>
              <button type="button" onClick={() => setStep(3)} className="btn-primary">
                Review & confirm
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Confirmation summary ─────────────────────────── */}
        {step === 3 && (
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Confirm your targeting profile
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>
              These settings become your default when launching campaigns.
            </p>

            <div
              className="panel"
              style={{ overflow: 'hidden', marginBottom: '20px' }}
            >
              {[
                { label: 'Agency', value: agencyName || 'Sterling Digital Partners' },
                { label: 'Service', value: primaryService, accent: true },
                { label: 'Target hubs', value: targetLocations },
                { label: 'Industries', value: selectedIndustries.join(', ') || 'Logistics, Real Estate' },
              ].map((row, i) => (
                <div
                  key={i}
                  className="ledger-row"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', gap: '12px' }}
                >
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', flexShrink: 0 }}>{row.label}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: row.accent ? 'var(--amber-bright)' : 'var(--text-primary)', textAlign: 'right' }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button type="button" onClick={() => setStep(2)} className="btn-ghost">
                Back
              </button>
              <button type="button" onClick={handleSubmit} disabled={isSaving} className="btn-primary">
                <Check style={{ width: '12px', height: '12px' }} />
                {isSaving ? 'Saving…' : 'Save profile'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
