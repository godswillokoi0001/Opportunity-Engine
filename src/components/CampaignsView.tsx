import React from 'react';
import { Plus, Play, MapPin, Briefcase } from 'lucide-react';
import { Campaign } from '../types.js';

interface CampaignsViewProps {
  campaigns: Campaign[];
  onNewCampaign: () => void;
  onRunCampaign: (campId: string) => Promise<void>;
  onSelectCampaign: (camp: Campaign) => void;
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({
  campaigns,
  onNewCampaign,
  onRunCampaign,
  onSelectCampaign,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '16px',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--border-subtle)',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '22px',
              fontWeight: 500,
              color: 'var(--text-primary)',
              marginBottom: '4px',
            }}
          >
            Discovery campaigns
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''} · targeted by service, industry, and location
          </p>
        </div>
        <button className="btn-primary" onClick={onNewCampaign}>
          <Plus style={{ width: '12px', height: '12px' }} />
          New campaign
        </button>
      </div>

      {/* Campaign list */}
      {campaigns.length === 0 ? (
        <div className="panel" style={{ padding: '56px 24px', textAlign: 'center' }}>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '18px',
              color: 'var(--text-secondary)',
              marginBottom: '12px',
            }}
          >
            No campaigns yet
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px', maxWidth: '360px', margin: '0 auto 24px' }}>
            Create your first campaign to tell the engine what service you're selling and which businesses to target.
          </p>
          <button className="btn-primary" onClick={onNewCampaign}>
            <Plus style={{ width: '12px', height: '12px' }} />
            Create campaign
          </button>
        </div>
      ) : (
        <div className="panel" style={{ overflow: 'hidden' }}>
          {campaigns.map((camp, idx) => (
            <div
              key={camp.id}
              className="ledger-row"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '20px',
                padding: '18px 20px',
                alignItems: 'center',
              }}
            >
              <div>
                {/* Name + status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: 'var(--text-muted)',
                    }}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {camp.name}
                  </h3>
                  <span className={`signal-badge ${camp.status === 'active' ? 'teal' : 'amber'}`}>
                    {camp.status}
                  </span>
                </div>

                {/* Service + location + industries */}
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--amber)', fontWeight: 500 }}>
                    {camp.service}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <MapPin style={{ width: '10px', height: '10px' }} />
                    {camp.location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <Briefcase style={{ width: '10px', height: '10px' }} />
                    {camp.industries.join(', ')}
                  </span>
                </div>

                {/* Stats */}
                <div style={{ display: 'flex', gap: '20px' }}>
                  {[
                    { label: 'Discovered', value: camp.discoveredCount },
                    { label: 'Qualified', value: camp.qualifiedCount, accent: true },
                    { label: 'Saved', value: camp.savedCount },
                  ].map(stat => (
                    <div key={stat.label}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginBottom: '1px' }}>
                        {stat.label}
                      </span>
                      <span
                        className="tabular-nums"
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '15px',
                          fontWeight: 500,
                          color: stat.accent ? 'var(--amber-bright)' : 'var(--text-primary)',
                        }}
                      >
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <button
                  className="btn-secondary"
                  onClick={() => onRunCampaign(camp.id)}
                  style={{ fontSize: '12px' }}
                  title="Re-run discovery"
                >
                  <Play style={{ width: '11px', height: '11px' }} />
                  Run
                </button>
                <button
                  className="btn-primary"
                  onClick={() => onSelectCampaign(camp)}
                  style={{ fontSize: '12px' }}
                >
                  Results
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
