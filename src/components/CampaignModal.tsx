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

const BACKDROP_STYLE: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(0,0,0,0.65)',
  padding: '16px',
  overflowY: 'auto',
};

const MODAL_STYLE: React.CSSProperties = {
  background: 'var(--surface-1)',
  border: '1px solid var(--border-moderate)',
  borderRadius: '6px',
  maxWidth: '560px',
  width: '100%',
  padding: '28px',
  position: 'relative',
  margin: 'auto',
};

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
        body: JSON.stringify({ name: finalName, service, location, industries, criteria: { websiteRequirement, companySize: 'all' }, providerId }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed to create campaign'); }
      const data = await res.json();
      onCampaignCreated(data.campaign);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error launching campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldLabel = (text: string) => (
    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
      {text}
    </label>
  );

  return (
    <div style={BACKDROP_STYLE} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={MODAL_STYLE}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
        >
          <X style={{ width: '18px', height: '18px' }} />
        </button>

        {/* Header — no ALL-CAPS eyebrow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Compass style={{ width: '14px', height: '14px', color: 'var(--amber)' }} />
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--amber)' }}>New campaign</span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '6px' }}>
          Define your discovery target
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
          Specify what you're selling and who needs it. The engine discovers real businesses, measures their digital weaknesses, and surfaces qualified leads.
        </p>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', marginBottom: '20px', background: 'var(--rose-surface)', border: '1px solid var(--rose-border)', borderRadius: '4px', fontSize: '12px', color: 'var(--rose-bright)' }}>
            <AlertCircle style={{ width: '13px', height: '13px', flexShrink: 0 }} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Service */}
          <div>
            {fieldLabel('Service you\'re selling')}
            <select value={service} onChange={e => setService(e.target.value as ServiceType)} className="field-select">
              {SERVICES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Location & Industries */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              {fieldLabel('Target location')}
              <div style={{ position: 'relative' }}>
                <MapPin style={{ width: '12px', height: '12px', color: 'var(--text-muted)', position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input type="text" required value={location} onChange={e => setLocation(e.target.value)} placeholder="Lagos, Nigeria" className="field-input" style={{ paddingLeft: '28px' }} />
              </div>
            </div>
            <div>
              {fieldLabel('Target industries')}
              <div style={{ position: 'relative' }}>
                <Briefcase style={{ width: '12px', height: '12px', color: 'var(--text-muted)', position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input type="text" required value={industryInput} onChange={e => setIndustryInput(e.target.value)} placeholder="Logistics, Real Estate" className="field-input" style={{ paddingLeft: '28px' }} />
              </div>
            </div>
          </div>

          {/* Website requirement */}
          <div>
            {fieldLabel('Website presence filter')}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'any', label: 'Any status' },
                { id: 'must_have_website', label: 'Has website' },
                { id: 'no_website_only', label: 'No website' },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setWebsiteRequirement(item.id as any)}
                  style={{
                    fontSize: '12px',
                    fontWeight: websiteRequirement === item.id ? 600 : 400,
                    padding: '8px 10px',
                    borderRadius: '4px',
                    border: '1px solid',
                    borderColor: websiteRequirement === item.id ? 'var(--amber)' : 'var(--border-moderate)',
                    background: websiteRequirement === item.id ? 'var(--amber-surface)' : 'transparent',
                    color: websiteRequirement === item.id ? 'var(--amber-bright)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 120ms ease',
                    textAlign: 'center',
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Provider */}
          <div>
            {fieldLabel('Data source')}
            <div className="space-y-2">
              {[
                { id: 'curated_commercial_registry', title: 'Verified public commercial registries', desc: 'Lagos, London, Austin · Public Registry / Public Domain', icon: Database },
                { id: 'osm_open_data', title: 'OpenStreetMap open geodata', desc: 'Global commercial POIs · ODbL 1.0 attribution compliant', icon: Compass },
              ].map(p => {
                const Icon = p.icon;
                const isSelected = providerId === p.id;
                return (
                  <label
                    key={p.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      padding: '12px 14px',
                      borderRadius: '4px',
                      border: '1px solid',
                      borderColor: isSelected ? 'var(--amber-border)' : 'var(--border-moderate)',
                      background: isSelected ? 'var(--amber-surface)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 120ms ease',
                    }}
                  >
                    <input
                      type="radio"
                      name="provider"
                      value={p.id}
                      checked={isSelected}
                      onChange={() => setProviderId(p.id)}
                      style={{ marginTop: '2px', accentColor: 'var(--amber)' }}
                    />
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: isSelected ? 'var(--amber-bright)' : 'var(--text-primary)', marginBottom: '2px' }}>{p.title}</p>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>{p.desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Campaign name */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Campaign name (optional)</label>
              <button type="button" onClick={handleAutoName} style={{ fontSize: '11px', color: 'var(--amber)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
                Generate name
              </button>
            </div>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Lagos Logistics Web Modernization Q4" className="field-input" />
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', paddingTop: '8px' }}>
            <button type="button" onClick={onClose} className="btn-ghost" style={{ fontSize: '13px' }}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              <Sparkles style={{ width: '12px', height: '12px' }} />
              {isSubmitting ? 'Running discovery…' : 'Launch campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
