import React, { useState } from 'react';
import {
  Sliders,
  Building2,
  Database,
  CreditCard,
  Check,
  Save,
  Globe,
  ShieldCheck,
} from 'lucide-react';
import { ServiceType, UserProfile } from '../types.js';

interface SettingsViewProps {
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

export const SettingsView: React.FC<SettingsViewProps> = ({
  userProfile,
  onSaveProfile,
}) => {
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [agencyName, setAgencyName] = useState(userProfile.agencyName);
  const [primaryService, setPrimaryService] = useState<ServiceType>(userProfile.primaryService);
  const [targetLocations, setTargetLocations] = useState(userProfile.targetLocations.join(', '));
  const [targetIndustries, setTargetIndustries] = useState(userProfile.targetIndustries.join(', '));
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const locs = targetLocations.split(',').map(s => s.trim()).filter(Boolean);
      const inds = targetIndustries.split(',').map(s => s.trim()).filter(Boolean);
      await onSaveProfile({ name, email, agencyName, primaryService, targetLocations: locs, targetIndustries: inds });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">

      {/* Header */}
      <div className="card p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
          <Sliders className="w-3.5 h-3.5" />
          <span>Agency Configuration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
          Account & Targeting Settings
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Configure default qualification criteria, operator identity, and provider parameters
        </p>
      </div>

      {/* Agency Identity & Targeting Form */}
      <div className="card p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 text-base font-bold text-[var(--text-primary)] pb-4 border-b border-[var(--border-subtle)]">
          <Building2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <span>Agency & Operator Profile</span>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Operator Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="field-input"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Agency / Studio Name
              </label>
              <input
                type="text"
                value={agencyName}
                onChange={e => setAgencyName(e.target.value)}
                className="field-input"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Contact Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="field-input"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                Primary Commercial Service
              </label>
              <select
                value={primaryService}
                onChange={e => setPrimaryService(e.target.value as ServiceType)}
                className="field-select"
              >
                {AVAILABLE_SERVICES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border-subtle)] space-y-5">
            <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
              <Globe className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Default Discovery Markets</span>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Target Locations (Comma-separated cities)
                </label>
                <input
                  type="text"
                  value={targetLocations}
                  onChange={e => setTargetLocations(e.target.value)}
                  placeholder="Lagos, Nigeria, London, UK, Austin, TX"
                  className="field-input"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Target Industries (Comma-separated)
                </label>
                <input
                  type="text"
                  value={targetIndustries}
                  onChange={e => setTargetIndustries(e.target.value)}
                  placeholder="Logistics, Real Estate, Hospitality"
                  className="field-input"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            {isSaved && (
              <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1">
                <Check className="w-4 h-4" /> Profile Updated Successfully
              </span>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>

        </form>
      </div>

      {/* Data Providers & Licensing Information */}
      <div className="card p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-base font-bold text-[var(--text-primary)]">
          <Database className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <span>Swappable Data Providers & Legal Licensing</span>
        </div>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          Opportunity Engine queries permitted public commercial registers without reliance on private scrapers or black-hat data lists.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          
          <div className="card-inner p-5 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[var(--text-primary)]">
                Verified Public Commercial Registry
              </h4>
              <span className="badge badge-teal text-[10px]">Active</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Curated official registries for key commercial hubs (Lagos, London, Austin).
            </p>
            <span className="text-[11px] font-mono text-[var(--text-muted)] block">
              License: Public Domain / Open Registry
            </span>
          </div>

          <div className="card-inner p-5 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[var(--text-primary)]">
                OpenStreetMap & Overpass API
              </h4>
              <span className="badge badge-teal text-[10px]">Active</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Global commercial POIs and geospatial attributes.
            </p>
            <span className="text-[11px] font-mono text-[var(--text-muted)] block">
              License: ODbL 1.0 (Attribution Compliant)
            </span>
          </div>

        </div>
      </div>

      {/* Paystack Monetization Architecture */}
      <div className="card p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-base font-bold text-[var(--text-primary)]">
            <CreditCard className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span>Paystack Monetization Architecture</span>
          </div>
          <span className="badge badge-amber text-xs font-bold">
            Africa Ready
          </span>
        </div>

        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          Paystack handles multi-currency transactions across African and international B2B markets via cards, Nigerian bank transfers, and mobile money.
        </p>

        <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-secondary)] space-y-1.5 leading-relaxed">
          <p className="text-amber-600 dark:text-amber-400 font-bold">// Webhook & Quota Fulfillment Flow:</p>
          <p>1. Client initiates plan upgrade: <span className="text-teal-600 dark:text-teal-400">POST /api/paystack/initialize</span></p>
          <p>2. Client completes payment authorization via Paystack hosted popup</p>
          <p>3. Paystack securely fires webhook: <span className="text-teal-600 dark:text-teal-400">POST /api/paystack/webhook</span> with HMAC SHA512</p>
          <p>4. Server validates signature with secret key, updates plan quota, and unlocks search credits</p>
        </div>
      </div>

    </div>
  );
};
