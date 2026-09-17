import React, { useState } from 'react';
import {
  Sliders,
  Building2,
  Database,
  CreditCard,
  Check,
  Save,
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

  const fieldLabel = (text: string) => (
    <label
      style={{
        display: 'block',
        fontSize: '11px',
        fontWeight: 600,
        color: 'var(--text-secondary)',
        marginBottom: '6px',
        textTransform: 'none',
        letterSpacing: 0,
      }}
    >
      {text}
    </label>
  );

  return (
    <div className="space-y-6" style={{ maxWidth: '760px', margin: '0 auto' }}>

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div style={{ paddingBottom: '20px', borderBottom: '1px solid var(--border-subtle)' }}>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '22px',
            fontWeight: 500,
            color: 'var(--text-primary)',
            marginBottom: '4px',
          }}
        >
          Account & targeting
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Configure your operator identity, default targeting profile, and review data provider licensing.
        </p>
      </div>

      {/* ── Profile form ─────────────────────────────────────────────────── */}
      <div className="panel" style={{ padding: '24px' }}>
        <h2
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '20px',
          }}
        >
          <Building2 style={{ width: '14px', height: '14px', color: 'var(--text-muted)' }} />
          Operator & agency identity
        </h2>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              {fieldLabel('Your name')}
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="field-input" />
            </div>
            <div>
              {fieldLabel('Agency / studio name')}
              <input type="text" value={agencyName} onChange={e => setAgencyName(e.target.value)} className="field-input" />
            </div>
            <div>
              {fieldLabel('Contact email')}
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="field-input" />
            </div>
            <div>
              {fieldLabel('Primary commercial service')}
              <select value={primaryService} onChange={e => setPrimaryService(e.target.value as ServiceType)} className="field-select">
                {AVAILABLE_SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div
            style={{
              paddingTop: '20px',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sliders style={{ width: '12px', height: '12px', color: 'var(--text-muted)' }} />
              Default discovery targets
            </h3>
            <div className="space-y-4">
              <div>
                {fieldLabel('Target locations (comma-separated)')}
                <input
                  type="text"
                  value={targetLocations}
                  onChange={e => setTargetLocations(e.target.value)}
                  placeholder="Lagos, London, Austin"
                  className="field-input"
                />
              </div>
              <div>
                {fieldLabel('Target industries (comma-separated)')}
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

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', paddingTop: '4px' }}>
            {isSaved && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--teal-bright)', fontWeight: 500 }}>
                <Check style={{ width: '13px', height: '13px' }} />
                Profile saved
              </span>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary"
            >
              <Save style={{ width: '12px', height: '12px' }} />
              {isSaving ? 'Saving…' : 'Save profile'}
            </button>
          </div>
        </form>
      </div>

      {/* ── Data providers ───────────────────────────────────────────────── */}
      <div className="panel" style={{ padding: '24px' }}>
        <h2
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '8px',
          }}
        >
          <Database style={{ width: '14px', height: '14px', color: 'var(--text-muted)' }} />
          Swappable data providers
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.6, maxWidth: '540px' }}>
          Opportunity Engine uses a strict <code style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', background: 'var(--surface-2)', padding: '1px 4px', borderRadius: '2px', color: 'var(--text-primary)' }}>IDataProvider</code> interface. All sources are public, licensed, and require no scraping or private keys.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              name: 'Verified Public Commercial Registry',
              description: 'High-fidelity curated registers for Lagos, London, and Austin commercial hubs.',
              license: 'Public Registry / Public Domain',
            },
            {
              name: 'OpenStreetMap Open Geodata',
              description: 'Commercial POIs via Overpass API under the Open Database License.',
              license: 'ODbL 1.0 — Attribution Compliant',
            },
          ].map(provider => (
            <div
              key={provider.name}
              className="panel-elevated"
              style={{ padding: '14px 16px' }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                  {provider.name}
                </h3>
                <span className="signal-badge teal" style={{ flexShrink: 0 }}>Active</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '8px' }}>
                {provider.description}
              </p>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
                {provider.license}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Paystack architecture ────────────────────────────────────────── */}
      <div className="panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
          <h2
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            <CreditCard style={{ width: '14px', height: '14px', color: 'var(--text-muted)' }} />
            Paystack monetization
          </h2>
          <span className="signal-badge amber">Africa-optimised payments</span>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6, maxWidth: '540px' }}>
          Paystack powers frictionless B2B transactions via cards, Nigerian bank transfers, USSD, and mobile money. Payment authorization is fully decoupled from webhook fulfillment via HMAC-validated callbacks.
        </p>

        {/* Integration pattern — this IS code, so JetBrains Mono is appropriate */}
        <div
          style={{
            background: 'var(--ground)',
            border: '1px solid var(--border-moderate)',
            borderRadius: '4px',
            padding: '16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            lineHeight: 1.7,
            color: 'var(--text-secondary)',
            overflowX: 'auto',
          }}
        >
          <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>// Paystack integration pattern</div>
          <div><span style={{ color: 'var(--text-muted)' }}>1.</span> Client initiates checkout: <span style={{ color: 'var(--teal-bright)' }}>POST /api/paystack/initialize</span></div>
          <div><span style={{ color: 'var(--text-muted)' }}>2.</span> Server creates transaction via Paystack REST API with user metadata</div>
          <div><span style={{ color: 'var(--text-muted)' }}>3.</span> Client completes via Paystack inline popup or hosted redirect</div>
          <div><span style={{ color: 'var(--text-muted)' }}>4.</span> Paystack triggers webhook: <span style={{ color: 'var(--teal-bright)' }}>POST /api/paystack/webhook</span> + HMAC SHA512 signature</div>
          <div><span style={{ color: 'var(--text-muted)' }}>5.</span> Server validates signature → updates plan quota → issues credits</div>
        </div>
      </div>

    </div>
  );
};
