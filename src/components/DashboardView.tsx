import React from 'react';
import {
  Globe,
  Activity,
  Plus,
} from 'lucide-react';
import { Business, Campaign, UserProfile } from '../types.js';

interface DashboardViewProps {
  campaigns: Campaign[];
  businesses: Business[];
  savedLeadsCount: number;
  activityLogs: Array<{ id: string; action: string; details: string; timestamp: string }>;
  userProfile: UserProfile;
  onNavigate: (view: 'campaigns' | 'discovery' | 'leads' | 'auditor' | 'settings') => void;
  onSelectBusiness: (biz: Business) => void;
  onNewCampaign: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  campaigns,
  businesses,
  savedLeadsCount,
  activityLogs,
  userProfile,
  onNavigate,
  onSelectBusiness,
  onNewCampaign,
}) => {
  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  const totalDiscovered = businesses.length;
  const qualifiedCount = businesses.filter(b => b.opportunities.length > 0).length;
  const qualifyRate = totalDiscovered > 0 ? Math.round((qualifiedCount / totalDiscovered) * 100) : 0;

  // Top 5 highest-scoring leads
  const topLeads = [...businesses]
    .filter(b => b.opportunities.length > 0)
    .sort((a, b) => (b.opportunities[0]?.score ?? 0) - (a.opportunities[0]?.score ?? 0))
    .slice(0, 5);

  return (
    <div className="space-y-6">

      {/* ─── Workspace header ────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '16px',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--border-subtle)',
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
            {userProfile.agencyName}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {userProfile.primaryService} · {userProfile.targetLocations.join(', ')}
          </p>
        </div>
        <button className="btn-primary" onClick={onNewCampaign}>
          <Plus style={{ width: '12px', height: '12px' }} />
          New campaign
        </button>
      </div>

      {/* ─── Telemetry ribbon — flat, not card-per-metric ────────────── */}
      <div
        className="panel"
        style={{ padding: '0', overflow: 'hidden' }}
      >
        <div
          className="grid grid-cols-2 sm:grid-cols-4"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
          {[
            {
              label: 'Active campaigns',
              value: activeCampaigns.length,
              unit: '',
              action: () => onNavigate('campaigns'),
              actionLabel: 'Manage',
            },
            {
              label: 'Businesses found',
              value: totalDiscovered,
              unit: '',
              action: () => onNavigate('discovery'),
              actionLabel: 'Browse',
            },
            {
              label: 'Qualified leads',
              value: qualifiedCount,
              unit: `${qualifyRate}% rate`,
              action: () => onNavigate('discovery'),
              actionLabel: 'View',
            },
            {
              label: 'In pipeline',
              value: savedLeadsCount,
              unit: 'saved',
              action: () => onNavigate('leads'),
              actionLabel: 'Open',
            },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                padding: '20px 24px',
                borderRight: i < 3 ? '1px solid var(--border-subtle)' : 'none',
              }}
            >
              <p
                style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  fontWeight: 500,
                  marginBottom: '8px',
                  textTransform: 'none',
                  letterSpacing: 0,
                }}
              >
                {stat.label}
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
                <span
                  className="tabular-nums"
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '28px',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </span>
                {stat.unit && (
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{stat.unit}</span>
                )}
              </div>
              <button
                onClick={stat.action}
                style={{
                  fontSize: '11px',
                  color: 'var(--amber)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  fontWeight: 500,
                }}
              >
                {stat.actionLabel}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Main content grid ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Highest-score leads — left 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '17px',
                fontWeight: 500,
                color: 'var(--text-primary)',
              }}
            >
              Highest-probability leads
            </h2>
            <button
              onClick={() => onNavigate('discovery')}
              style={{
                fontSize: '12px',
                color: 'var(--amber)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              All results ({businesses.length})
            </button>
          </div>

          {topLeads.length === 0 ? (
            <div
              className="panel"
              style={{ padding: '48px 24px', textAlign: 'center' }}
            >
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
                No campaigns have run yet.
              </p>
              <button className="btn-primary" onClick={onNewCampaign}>
                <Plus style={{ width: '12px', height: '12px' }} />
                Start your first campaign
              </button>
            </div>
          ) : (
            <div className="panel" style={{ overflow: 'hidden' }}>
              {topLeads.map((biz, idx) => {
                const topOpp = biz.opportunities[0];
                const isSaved = Boolean(biz.savedLead);
                let domainDisplay = 'No website';
                if (biz.websiteUrl) {
                  try { domainDisplay = new URL(biz.websiteUrl).hostname; } catch { domainDisplay = biz.websiteUrl; }
                }

                return (
                  <button
                    key={biz.id}
                    onClick={() => onSelectBusiness(biz)}
                    className="ledger-row"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      gap: '16px',
                      padding: '16px 20px',
                      width: '100%',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '10px',
                            color: 'var(--text-muted)',
                            fontWeight: 400,
                            minWidth: '18px',
                          }}
                        >
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {biz.name}
                        </span>
                        {isSaved && (
                          <span className="signal-badge teal">Saved</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                          {domainDisplay}
                        </span>
                        {topOpp && (
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {topOpp.title}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      {topOpp && (
                        <>
                          <span
                            className="tabular-nums"
                            style={{
                              fontFamily: 'var(--font-serif)',
                              fontSize: '20px',
                              fontWeight: 500,
                              color: topOpp.score >= 80 ? 'var(--amber-bright)' : 'var(--text-secondary)',
                              display: 'block',
                              lineHeight: 1,
                            }}
                          >
                            {topOpp.score}%
                          </span>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                            {topOpp.confidence} confidence
                          </span>
                        </>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">

          {/* Active campaigns */}
          <div className="panel" style={{ overflow: 'hidden' }}>
            <div
              style={{
                padding: '14px 16px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Campaigns
              </h3>
              <button
                onClick={onNewCampaign}
                style={{
                  fontSize: '11px',
                  color: 'var(--amber)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                + New
              </button>
            </div>
            {campaigns.length === 0 ? (
              <div style={{ padding: '20px 16px', textAlign: 'center' }}>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No campaigns yet</p>
              </div>
            ) : (
              campaigns.slice(0, 3).map(camp => (
                <div
                  key={camp.id}
                  className="ledger-row"
                  style={{ padding: '12px 16px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', flex: 1, marginRight: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {camp.name}
                    </span>
                    <span className={`signal-badge ${camp.status === 'active' ? 'teal' : 'amber'}`}>
                      {camp.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {camp.location} · {camp.discoveredCount} found · {camp.qualifiedCount} qualified
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Live auditor quick-access */}
          <div
            className="panel"
            style={{ padding: '16px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Globe style={{ width: '14px', height: '14px', color: 'var(--teal-bright)' }} />
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                Live website auditor
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
              Paste any public URL to get an immediate technical audit — viewport, HTTPS, speed, CTAs, and tech stack.
            </p>
            <button className="btn-secondary" onClick={() => onNavigate('auditor')} style={{ width: '100%', justifyContent: 'center', fontSize: '12px' }}>
              Open auditor
            </button>
          </div>

          {/* Activity log */}
          {activityLogs.length > 0 && (
            <div className="panel" style={{ overflow: 'hidden' }}>
              <div
                style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Activity style={{ width: '12px', height: '12px', color: 'var(--text-muted)' }} />
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  Activity
                </h3>
              </div>
              <div style={{ padding: '8px 0' }}>
                {activityLogs.slice(0, 5).map((log, i) => (
                  <div
                    key={log.id}
                    className="timeline-item"
                    style={{
                      padding: '8px 16px',
                      marginLeft: '0',
                    }}
                  >
                    <div
                      style={{
                        paddingLeft: '16px',
                        borderLeft: '1px solid var(--border-subtle)',
                        marginLeft: '3px',
                      }}
                    >
                      <p style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '2px' }}>
                        {log.action}
                      </p>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '2px' }}>
                        {log.details}
                      </p>
                      <span
                        className="tabular-nums"
                        style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}
                      >
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
