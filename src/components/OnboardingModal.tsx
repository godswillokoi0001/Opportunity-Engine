import React, { useState } from 'react';
import { X, Check, ArrowRight, Building2, MapPin, Briefcase, Sparkles } from 'lucide-react';
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="card w-full max-w-lg p-6 sm:p-8 relative my-8 shadow-2xl space-y-6"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Indicator */}
        <div className="flex items-center gap-3">
          {[1, 2, 3].map(n => (
            <div key={n} className="flex-1 flex items-center gap-2">
              <div
                className={`h-2 rounded-full flex-1 transition-all ${
                  step >= n ? 'bg-amber-600' : 'bg-[var(--surface-3)]'
                }`}
              />
            </div>
          ))}
          <span className="text-xs font-bold text-[var(--text-muted)]">
            Step {step} of 3
          </span>
        </div>

        {/* Step 1: Agency Name & Service */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                What service does your agency sell?
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Opportunity Engine will evaluate target businesses against the exact weaknesses your service fixes.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Your Agency / Studio Name
                </label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={e => setAgencyName(e.target.value)}
                  placeholder="e.g. Sterling Digital Partners"
                  className="field-input"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Primary Offering
                </label>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {AVAILABLE_SERVICES.map(srv => {
                    const isSelected = primaryService === srv;
                    return (
                      <button
                        key={srv}
                        type="button"
                        onClick={() => setPrimaryService(srv)}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-bold'
                            : 'border-[var(--border-moderate)] hover:bg-[var(--surface-2)] text-[var(--text-secondary)]'
                        }`}
                      >
                        <span>{srv}</span>
                        {isSelected && <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-primary"
              >
                <span>Continue to Target Markets</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Geography & Industries */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                Where are your target clients located?
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Choose the commercial hubs and verticals where you have domain authority.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Target Cities / Hubs (Comma-separated)
                </label>
                <input
                  type="text"
                  value={targetLocations}
                  onChange={e => setTargetLocations(e.target.value)}
                  placeholder="e.g. Lagos, Nigeria, London, UK"
                  className="field-input text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Target Industries
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SUGGESTED_INDUSTRIES.map(ind => {
                    const isSelected = selectedIndustries.includes(ind) || selectedIndustries.some(si => ind.toLowerCase().includes(si.toLowerCase()));
                    return (
                      <button
                        key={ind}
                        type="button"
                        onClick={() => toggleIndustry(ind)}
                        className={`p-2.5 rounded-lg border text-left text-xs font-medium flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-300 font-bold'
                            : 'border-[var(--border-moderate)] hover:bg-[var(--surface-2)] text-[var(--text-secondary)]'
                        }`}
                      >
                        <span className="truncate">{ind}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-ghost text-xs"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-primary"
              >
                <span>Review & Finish</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Finish */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                Confirm your agency setup
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                These settings will serve as your default discovery filters.
              </p>
            </div>

            <div className="card-inner p-5 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Agency Name:</span>
                <span className="font-semibold text-[var(--text-primary)]">{agencyName || 'Sterling Digital Partners'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Core Service:</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">{primaryService}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Target Hubs:</span>
                <span className="font-semibold text-[var(--text-primary)]">{targetLocations}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[var(--text-muted)]">Industries:</span>
                <span className="font-semibold text-[var(--text-primary)] truncate max-w-[200px]">
                  {selectedIndustries.join(', ') || 'Logistics, Real Estate'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-ghost text-xs"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSaving}
                className="btn-primary"
              >
                <Check className="w-4 h-4" />
                <span>{isSaving ? 'Saving Profile...' : 'Save & Enter Dashboard'}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
