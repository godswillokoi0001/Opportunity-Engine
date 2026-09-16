import React, { useState } from 'react';
import { X, Check, ArrowRight, Building2, MapPin, Briefcase, Target, Shield } from 'lucide-react';
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
  'Construction & Engineering'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 text-left relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Indicator */}
        <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">
          <span>Step {step} of 3</span>
          <span>•</span>
          <span>Targeting Profile Setup</span>
        </div>

        {/* Step 1: Core Service */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-slate-900">What service do you sell?</h2>
            <p className="text-sm text-slate-600 mt-1 mb-6">
              Opportunity Engine uses your primary craft to evaluate businesses against specific weaknesses they have a reason to fix.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Agency / Studio / Consultant Name
                </label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  placeholder="e.g. Sterling Digital Partners"
                  className="w-full text-sm border border-slate-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Primary Offering
                </label>
                <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
                  {AVAILABLE_SERVICES.map((srv) => (
                    <button
                      key={srv}
                      type="button"
                      onClick={() => setPrimaryService(srv)}
                      className={`text-left text-xs font-medium px-3.5 py-2.5 rounded-lg border transition-all flex items-center justify-between ${
                        primaryService === srv
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-semibold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{srv}</span>
                      {primaryService === srv && <Check className="w-4 h-4 text-indigo-600" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors"
              >
                <span>Continue to Target Markets</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Geography & Industries */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-slate-900">Who do you sell to?</h2>
            <p className="text-sm text-slate-600 mt-1 mb-6">
              Specify your target commercial hubs and the industries where you have the highest domain expertise.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Target Locations (Comma-separated cities or regions)
                </label>
                <input
                  type="text"
                  value={targetLocations}
                  onChange={(e) => setTargetLocations(e.target.value)}
                  placeholder="e.g. Lagos, Nigeria, London, UK, Austin, TX"
                  className="w-full text-sm border border-slate-300 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Example: "Lagos, Nigeria" or "London, United Kingdom"
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Target Industries
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {SUGGESTED_INDUSTRIES.map((ind) => {
                    const isSelected = selectedIndustries.includes(ind) || selectedIndustries.some(si => ind.toLowerCase().includes(si.toLowerCase()));
                    return (
                      <button
                        key={ind}
                        type="button"
                        onClick={() => toggleIndustry(ind)}
                        className={`text-left text-xs px-3 py-2 rounded-lg border transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-semibold'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{ind}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors"
              >
                <span>Review & Finish</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold text-slate-900">Confirm Targeting Profile</h2>
            <p className="text-sm text-slate-600 mt-1 mb-5">
              These settings form your default discovery filter whenever you launch campaigns.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Agency Profile:</span>
                <span className="text-slate-900 font-semibold">{agencyName || 'Sterling Digital Partners'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Service Sold:</span>
                <span className="text-indigo-700 font-semibold">{primaryService}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Target Hubs:</span>
                <span className="text-slate-900 font-semibold">{targetLocations}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Industries:</span>
                <span className="text-slate-900 font-semibold truncate max-w-[240px]">
                  {selectedIndustries.join(', ') || 'Logistics, Real Estate'}
                </span>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSaving}
                className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold px-6 py-2.5 rounded-lg transition-colors"
              >
                {isSaving ? (
                  <span>Saving Profile...</span>
                ) : (
                  <>
                    <span>Save Profile & Proceed</span>
                    <Check className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
