import React, { useState } from 'react';
import { X, Compass, MapPin, Briefcase, AlertCircle, Sparkles, Database } from 'lucide-react';
import { ServiceType, UserProfile } from '../types.js';

interface CampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onCampaignCreated: (campaign: any) => void;
}

const SERVICES_LIST: ServiceType[] = [
  'Website Design & Development',
  'Website Redesign & Modernization',
  'SEO & Search Visibility',
  'Conversion Rate Optimization (CRO)',
  'Branding & Creative Identity',
  'Social Media & Content Strategy',
  'B2B Lead Generation',
  'Custom Software & Mobile Apps',
];

export const CampaignModal: React.FC<CampaignModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onCampaignCreated,
}) => {
  const [name, setName] = useState('');
  const [service, setService] = useState<ServiceType>(userProfile.primaryService || 'Website Redesign & Modernization');
  const [location, setLocation] = useState(userProfile.targetLocations[0] || 'Lagos, Nigeria');
  const [industryInput, setIndustryInput] = useState(userProfile.targetIndustries.join(', ') || 'Logistics, Real Estate');
  const [websiteRequirement, setWebsiteRequirement] = useState<'any' | 'must_have_website' | 'no_website_only'>('any');
  const [providerId, setProviderId] = useState<string>('curated_commercial_registry');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAutoName = () => {
    const primaryInd = industryInput.split(',')[0]?.trim() || 'Businesses';
    const city = location.split(',')[0]?.trim() || 'Regional';
    setName(`${city} ${primaryInd} · ${service.split('&')[0].trim()}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const finalName = name.trim() || `${location.split(',')[0]} ${industryInput.split(',')[0]} Discovery`;
    const industries = industryInput.split(',').map(s => s.trim()).filter(Boolean);
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: finalName,
          service,
          location,
          industries,
          criteria: { websiteRequirement, companySize: 'all' },
          providerId
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to create campaign');
      }
      const data = await res.json();
      onCampaignCreated(data.campaign);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error launching campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="card w-full max-w-xl p-6 sm:p-8 relative my-8 shadow-2xl space-y-6 animate-scale-up"
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
            <Compass className="w-3.5 h-3.5" />
            <span>Targeting Setup</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
            Launch a Discovery Campaign
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">
            Specify the service you offer and target market. The engine will discover real businesses, execute deterministic code audits, and qualify opportunities.
          </p>
        </div>

        {error && (
          <div className="card p-3 border-rose-200 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Service to Sell */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              What Service Are You Pitching?
            </label>
            <select
              value={service}
              onChange={e => setService(e.target.value as ServiceType)}
              className="field-select"
            >
              {SERVICES_LIST.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Location & Industries */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Target Location (City / Hub)
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Lagos, Nigeria"
                  className="field-input pl-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Target Industries
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={industryInput}
                  onChange={e => setIndustryInput(e.target.value)}
                  placeholder="Logistics, Real Estate"
                  className="field-input pl-9 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Website Presence Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Website Presence Filter
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'any', label: 'Any Status' },
                { id: 'must_have_website', label: 'Has Website (Needs Upgrade)' },
                { id: 'no_website_only', label: 'No Website (Greenfield)' },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setWebsiteRequirement(item.id as any)}
                  className={`p-2.5 rounded-lg text-xs font-semibold border text-center transition-all cursor-pointer ${
                    websiteRequirement === item.id
                      ? 'border-amber-600 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300'
                      : 'border-[var(--border-moderate)] hover:bg-[var(--surface-2)] text-[var(--text-secondary)]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Data Provider Choice */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
              Data Discovery Provider
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: 'curated_commercial_registry',
                  title: 'Verified Commercial Registries',
                  desc: 'High-fidelity official registers (Lagos, London, Austin).'
                },
                {
                  id: 'osm_open_data',
                  title: 'OpenStreetMap Open Geodata',
                  desc: 'Global POIs and commercial geocoded records under ODbL.'
                },
              ].map(p => {
                const isSelected = providerId === p.id;
                return (
                  <label
                    key={p.id}
                    className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/40 dark:bg-amber-950/20'
                        : 'border-[var(--border-moderate)] hover:bg-[var(--surface-2)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="provider"
                      value={p.id}
                      checked={isSelected}
                      onChange={() => setProviderId(p.id)}
                      className="mt-0.5 accent-amber-600"
                    />
                    <div>
                      <p className="text-xs font-bold text-[var(--text-primary)]">{p.title}</p>
                      <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{p.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Campaign Name */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Campaign Name
              </label>
              <button
                type="button"
                onClick={handleAutoName}
                className="text-xs text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
              >
                Auto-generate name
              </button>
            </div>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Lagos Logistics Web Modernization Q4"
              className="field-input text-xs"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary text-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Scanning Registries...' : 'Launch Campaign'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
