import React, { useState } from 'react';
import { X, Sparkles, Compass, MapPin, Briefcase, Database, AlertCircle, ArrowRight } from 'lucide-react';
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

  // Auto-generate a smart campaign name based on inputs
  const handleAutoName = () => {
    const primaryInd = industryInput.split(',')[0]?.trim() || 'Businesses';
    const city = location.split(',')[0]?.trim() || 'Regional';
    setName(`${city} ${primaryInd} ${service.split('&')[0].trim()}`);
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
          criteria: {
            websiteRequirement,
            companySize: 'all',
          },
          providerId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create campaign');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 text-left relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">
          <Compass className="w-4 h-4" />
          <span>New Opportunity Campaign</span>
        </div>

        <h2 className="text-xl font-bold text-slate-900">Define Discovery Target</h2>
        <p className="text-xs text-slate-600 mt-1 mb-6">
          Specify what you are selling and who needs it. The engine will discover real businesses, extract digital signals, and qualify opportunities.
        </p>

        {error && (
          <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Service Sold */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              What Service Are You Selling?
            </label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value as ServiceType)}
              className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {SERVICES_LIST.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Location & Industries */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Location (City / Region)
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Lagos, Nigeria"
                  className="w-full text-xs pl-8 pr-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Industries
              </label>
              <div className="relative">
                <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={industryInput}
                  onChange={(e) => setIndustryInput(e.target.value)}
                  placeholder="Logistics, Real Estate"
                  className="w-full text-xs pl-8 pr-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Website Requirement Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Website Presence Criteria
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'any', label: 'Any Status' },
                { id: 'must_have_website', label: 'Has Website (Audit Required)' },
                { id: 'no_website_only', label: 'No Website (Needs Portal)' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setWebsiteRequirement(item.id as any)}
                  className={`text-[11px] font-medium py-2 px-2.5 rounded-lg border text-center transition-all ${
                    websiteRequirement === item.id
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-semibold'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Swappable Data Provider Choice */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Data Discovery Provider (Swappable Abstraction)
            </label>
            <div className="space-y-1.5">
              {[
                { 
                  id: 'curated_commercial_registry', 
                  title: 'Verified Commercial Registries', 
                  desc: 'High-fidelity public enterprise registers in key commercial hubs (Lagos, London, Austin).'
                },
                { 
                  id: 'osm_open_data', 
                  title: 'OpenStreetMap & Open Geodata', 
                  desc: 'Global open POI and geocoded commercial data under Open Database License (ODbL).'
                },
              ].map((p) => (
                <label
                  key={p.id}
                  className={`flex items-start p-2.5 rounded-lg border cursor-pointer text-left transition-colors ${
                    providerId === p.id ? 'border-indigo-600 bg-indigo-50/40' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="provider"
                    value={p.id}
                    checked={providerId === p.id}
                    onChange={() => setProviderId(p.id)}
                    className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="ml-2.5">
                    <p className="text-xs font-bold text-slate-800">{p.title}</p>
                    <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{p.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Campaign Name (Optional or Auto) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Campaign Name
              </label>
              <button
                type="button"
                onClick={handleAutoName}
                className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800"
              >
                Auto-generate name
              </button>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Lagos Logistics Web Modernization Q4"
              className="w-full text-xs px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-3 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-3 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-xs"
            >
              {isSubmitting ? (
                <span>Executing Discovery & Audit...</span>
              ) : (
                <>
                  <span>Launch Campaign</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
