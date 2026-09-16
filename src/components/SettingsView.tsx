import React, { useState } from 'react';
import { 
  Sliders, 
  User, 
  Building2, 
  ShieldCheck, 
  Database, 
  Cpu, 
  CreditCard, 
  Check, 
  Save,
  Info
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

      await onSaveProfile({
        name,
        email,
        agencyName,
        primaryService,
        targetLocations: locs,
        targetIndustries: inds,
      });

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center space-x-2 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-1">
          <Sliders className="w-4 h-4" />
          <span>Agency Configuration</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Account, Targeting & Provider Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure default qualification criteria, swappable data providers, and monetization parameters
        </p>

        <form onSubmit={handleSave} className="mt-6 space-y-6">
          {/* Section 1: User & Agency Info */}
          <div className="border-b border-slate-200 pb-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-slate-500" />
              <span>Agency & Operator Identity</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Operator Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Agency / Studio Name
                </label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Primary Commercial Craft
                </label>
                <select
                  value={primaryService}
                  onChange={(e) => setPrimaryService(e.target.value as ServiceType)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {AVAILABLE_SERVICES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Default Targeting */}
          <div className="border-b border-slate-200 pb-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-slate-500" />
              <span>Default Opportunity Targeting Profile</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Default Target Locations (Comma-separated)
                </label>
                <input
                  type="text"
                  value={targetLocations}
                  onChange={(e) => setTargetLocations(e.target.value)}
                  placeholder="Lagos, Nigeria, London, UK"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Default Target Industries (Comma-separated)
                </label>
                <input
                  type="text"
                  value={targetIndustries}
                  onChange={(e) => setTargetIndustries(e.target.value)}
                  placeholder="Logistics, Real Estate, Hospitality"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Profile */}
          <div className="flex items-center justify-end space-x-3">
            {isSaved && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" /> Profile Saved Successfully
              </span>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Update Targeting Profile'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Provider Abstraction & Data Legal Architecture */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <Database className="w-4 h-4 text-slate-500" />
          <span>Swappable Data Providers & Legal Licensing</span>
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Opportunity Engine utilizes a strict provider abstraction interface (`IDataProvider`) to query permitted public commercial sources without reliance on scraping or private keys.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-1.5">
            <div className="flex items-center justify-between">
              <strong className="text-slate-900">Verified Public Commercial Registry</strong>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Active</span>
            </div>
            <p className="text-slate-500 text-[11px]">
              High-fidelity public registers for commercial hubs (Lagos, London, Austin).
            </p>
            <span className="text-[10px] text-slate-400 block font-mono">License: Public Registry / Public Domain</span>
          </div>

          <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-1.5">
            <div className="flex items-center justify-between">
              <strong className="text-slate-900">OpenStreetMap Open Geodata</strong>
              <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded">Active</span>
            </div>
            <p className="text-slate-500 text-[11px]">
              Global commercial POIs via Overpass API queries under Open Database License (ODbL).
            </p>
            <span className="text-[10px] text-slate-400 block font-mono">License: ODbL 1.0 (Attribution Compliant)</span>
          </div>
        </div>
      </div>

      {/* Paystack Monetization Architecture */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-slate-500" />
            <span>Commercial Monetization & Paystack Integration Architecture</span>
          </h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
            Enterprise Ready
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Paystack powers frictionless transactions across African and international B2B markets via cards, Nigerian bank transfers, USSD, and mobile money. The architecture decouples payment authorization from webhook fulfillment:
        </p>

        <div className="p-4 rounded-lg bg-slate-900 text-slate-200 text-xs font-mono space-y-2">
          <p className="text-indigo-400">// Recommended Paystack Integration Pattern:</p>
          <p>1. Client initiates checkout: <span className="text-emerald-400">POST /api/paystack/initialize</span></p>
          <p>2. Server creates transaction via Paystack REST API with user metadata</p>
          <p>3. Client completes authorization via Paystack inline popup or redirect</p>
          <p>4. Paystack securely triggers webhook: <span className="text-emerald-400">POST /api/paystack/webhook</span> with HMAC SHA512 signature</p>
          <p>5. Server validates signature with secret key, updates plan quota, and issues credits</p>
        </div>
      </div>
    </div>
  );
};
