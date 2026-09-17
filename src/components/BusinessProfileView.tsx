import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  RefreshCw,
  Send,
  Bookmark,
  BookmarkCheck,
  MessageSquare,
} from 'lucide-react';
import { Business, Opportunity, LeadStatus } from '../types.js';

interface BusinessProfileViewProps {
  business: Business | null;
  onClose: () => void;
  onSaveLead: (bizId: string, tags?: string[]) => Promise<void>;
  onUpdateLeadStatus: (bizId: string, status: LeadStatus) => Promise<void>;
  onAddNote: (bizId: string, note: string) => Promise<void>;
  onRunAudit: (biz: Business) => Promise<void>;
  onOpenOutreach: (biz: Business) => void;
  onExplainOpportunity: (bizId: string, oppId: string) => Promise<any>;
}

export const BusinessProfileView: React.FC<BusinessProfileViewProps> = ({
  business,
  onClose,
  onSaveLead,
  onUpdateLeadStatus,
  onAddNote,
  onRunAudit,
  onOpenOutreach,
  onExplainOpportunity,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'audit' | 'opportunities' | 'crm'>('overview');
  const [isAuditing, setIsAuditing] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<any>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  if (!business) return null;

  const topOpp: Opportunity | undefined = business.opportunities[0];
  const audit = business.audit;
  const isSaved = Boolean(business.savedLead);

  const handleAuditClick = async () => {
    setIsAuditing(true);
    try { await onRunAudit(business); } finally { setIsAuditing(false); }
  };

  const handleExplainClick = async () => {
    if (!topOpp) return;
    setIsExplaining(true);
    try {
      const data = await onExplainOpportunity(business.id, topOpp.id);
      setAiExplanation(data);
    } finally { setIsExplaining(false); }
  };

  const handleAddNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    setIsAddingNote(true);
    try {
      await onAddNote(business.id, newNoteText.trim());
      setNewNoteText('');
    } finally { setIsAddingNote(false); }
  };

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'audit', label: `Technical audit${audit ? ` (${audit.deterministicHealthScore}/100)` : ''}` },
    { id: 'opportunities', label: `Opportunities (${business.opportunities.length})` },
    { id: 'crm', label: `Notes${isSaved ? ` (${business.savedLead?.notes.length ?? 0})` : ''}` },
  ];

  let domainDisplay = 'No website';
  if (business.websiteUrl) {
    try { domainDisplay = new URL(business.websiteUrl).hostname; } catch { domainDisplay = business.websiteUrl; }
  }

  return (
    /* ── Modal backdrop ─────────────────────────────────────────────── */
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'flex-end',
        background: 'rgba(0,0,0,0.6)',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* ── Dossier slide-in panel — THE deliberate motion moment ────── */}
      <div
        className="dossier-panel open"
        style={{
          background: 'var(--surface-1)',
          borderLeft: '1px solid var(--border-moderate)',
          width: '100%',
          maxWidth: '760px',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '100vh',
          overflow: 'hidden',
        }}
      >

        {/* ── Dossier header ────────────────────────────────────────── */}
        <div
          style={{
            padding: '20px 24px 0',
            borderBottom: '1px solid var(--border-subtle)',
            flexShrink: 0,
          }}
        >
          {/* Registry tag + close */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="signal-badge teal">
                <ShieldCheck style={{ width: '10px', height: '10px' }} />
                Verified Active
              </span>
              {business.source.externalId && (
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--text-muted)',
                    fontWeight: 400,
                  }}
                >
                  {business.source.externalId}
                </span>
              )}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
                {business.source.license}
              </span>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '4px',
                borderRadius: '3px',
                flexShrink: 0,
              }}
            >
              <X style={{ width: '18px', height: '18px' }} />
            </button>
          </div>

          {/* Company title */}
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '22px',
              fontWeight: 500,
              color: 'var(--text-primary)',
              marginBottom: '6px',
              lineHeight: 1.2,
            }}
          >
            {business.name}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {business.industry}{business.subIndustry ? ` · ${business.subIndustry}` : ''}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <MapPin style={{ width: '11px', height: '11px' }} />
              {business.location.address || `${business.location.city}, ${business.location.country}`}
            </span>
            {business.websiteUrl && (
              <a
                href={business.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--teal-bright)', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}
              >
                {domainDisplay}
                <ExternalLink style={{ width: '10px', height: '10px' }} />
              </a>
            )}
          </div>

          {/* Action row */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <button className="btn-primary" onClick={() => onOpenOutreach(business)}>
              <Send style={{ width: '12px', height: '12px' }} />
              Draft outreach
            </button>
            <button
              className="btn-secondary"
              onClick={() => onSaveLead(business.id)}
              style={{ background: isSaved ? 'var(--teal-surface)' : undefined, borderColor: isSaved ? 'var(--teal-border)' : undefined, color: isSaved ? 'var(--teal-bright)' : undefined }}
            >
              {isSaved
                ? <><BookmarkCheck style={{ width: '12px', height: '12px' }} /> Saved to pipeline</>
                : <><Bookmark style={{ width: '12px', height: '12px' }} /> Save lead</>
              }
            </button>
          </div>

          {/* Tab nav */}
          <div style={{ display: 'flex', gap: '0', borderTop: '1px solid var(--border-subtle)', marginLeft: '-24px', marginRight: '-24px', paddingLeft: '24px' }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '10px 16px',
                  fontSize: '12px',
                  fontWeight: activeTab === tab.id ? 600 : 400,
                  color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
                  background: 'none',
                  border: 'none',
                  borderBottom: `2px solid ${activeTab === tab.id ? 'var(--amber)' : 'transparent'}`,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'color 120ms ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Scrollable body ───────────────────────────────────────── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

          {/* TAB: OVERVIEW ─────────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick-facts grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="panel-elevated" style={{ padding: '16px' }}>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '8px' }}>Contact</p>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.7, fontFamily: 'var(--font-mono)' }}>
                    {business.phone && <div>{business.phone}</div>}
                    {business.email && <div style={{ wordBreak: 'break-all' }}>{business.email}</div>}
                    {!business.phone && !business.email && <div style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', fontStyle: 'italic' }}>No direct contact found</div>}
                  </div>
                </div>
                <div className="panel-elevated" style={{ padding: '16px' }}>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '8px' }}>Digital presence</p>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    <div>Website: <span style={{ color: business.hasWebsite ? 'var(--teal-bright)' : 'var(--amber-bright)' }}>{business.hasWebsite ? 'Active domain' : 'None detected'}</span></div>
                    <div>Mobile: {business.digitalPresence.mobileReadiness}</div>
                    <div>Contact friction: {business.digitalPresence.contactFriction}</div>
                    <div>Social channels: {business.digitalPresence.socialChannelsCount}</div>
                  </div>
                </div>
                <div className="panel-elevated" style={{ padding: '16px', borderLeft: '3px solid var(--amber)' }}>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '8px' }}>Top opportunity</p>
                  {topOpp ? (
                    <div>
                      <span className="tabular-nums" style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', fontWeight: 500, color: 'var(--amber-bright)', display: 'block', lineHeight: 1, marginBottom: '4px' }}>
                        {topOpp.score}%
                      </span>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>{topOpp.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--amber)', marginBottom: '2px' }}>{topOpp.targetService}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{topOpp.confidence} confidence</div>
                    </div>
                  ) : (
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>No matched opportunity</p>
                  )}
                </div>
              </div>

              {/* ─── THE BOLD MOMENT: Tri-Layer Reasoning ────────────────
                  This is the centrepiece of the product, designed to be
                  unmistakably different from any SaaS card grid.          */}
              {topOpp && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>
                        Why approach this business
                      </h2>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Three-layer qualification: code evidence, inferred impact, commercial case
                      </p>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'var(--surface-2)', border: '1px solid var(--border-moderate)', padding: '4px 8px', borderRadius: '3px' }}>
                      {topOpp.confidence} confidence
                    </span>
                  </div>

                  <div
                    className="panel"
                    style={{ overflow: 'hidden' }}
                  >
                    {/* Layer 1: Observed */}
                    <div
                      className="triad-observed"
                      style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-subtle)' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <CheckCircle2 style={{ width: '13px', height: '13px', color: 'var(--text-muted)', flexShrink: 0 }} />
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
                          Observed — what the code shows
                        </span>
                      </div>
                      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {topOpp.triad.observed.map((obs, i) => (
                          <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            <span style={{ color: 'var(--border-strong)', flexShrink: 0, marginTop: '1px' }}>·</span>
                            <span>{obs}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Layer 2: Inferred */}
                    <div
                      className="triad-inferred"
                      style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-subtle)' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <AlertTriangle style={{ width: '13px', height: '13px', color: 'var(--amber)', flexShrink: 0 }} />
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--amber)' }}>
                          Inferred — likely client impact
                        </span>
                      </div>
                      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {topOpp.triad.inferred.map((inf, i) => (
                          <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            <span style={{ color: 'var(--amber-border)', flexShrink: 0, marginTop: '1px' }}>·</span>
                            <span>{inf}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Layer 3: Strategic */}
                    <div
                      className="triad-strategic"
                      style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-subtle)' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <TrendingUp style={{ width: '13px', height: '13px', color: 'var(--teal-bright)', flexShrink: 0 }} />
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--teal-bright)' }}>
                          Strategic rationale — your pitch angle
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>
                        "{topOpp.triad.aiInterpretation}"
                      </p>
                    </div>

                    {/* Recommended action */}
                    <div
                      style={{
                        padding: '14px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        flexWrap: 'wrap',
                        background: 'var(--surface-2)',
                      }}
                    >
                      <div>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>Recommended pitch</p>
                        <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{topOpp.recommendedAction}</p>
                      </div>
                      <button className="btn-primary" onClick={() => onOpenOutreach(business)} style={{ flexShrink: 0 }}>
                        <Send style={{ width: '12px', height: '12px' }} />
                        Generate pitch
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: TECHNICAL AUDIT ──────────────────────────────────── */}
          {activeTab === 'audit' && (
            <div className="space-y-5">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    Technical audit
                  </h2>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Deterministic DOM crawl — no browser simulation, SSRF-protected
                  </p>
                </div>
                {business.hasWebsite && (
                  <button className="btn-secondary" onClick={handleAuditClick} disabled={isAuditing} style={{ fontSize: '12px' }}>
                    <RefreshCw style={{ width: '12px', height: '12px', animation: isAuditing ? 'spin 1s linear infinite' : 'none' }} />
                    {isAuditing ? 'Crawling…' : 'Re-crawl now'}
                  </button>
                )}
              </div>

              {audit ? (
                <>
                  {/* Score strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Health score', value: `${audit.deterministicHealthScore}`, sub: '/100 deterministic' },
                      { label: 'Mobile viewport', value: audit.hasViewport ? 'Present' : 'Missing!', sub: '<meta name="viewport">', critical: !audit.hasViewport },
                      { label: 'Response time', value: `${audit.responseTimeMs}ms`, sub: 'HTTP round-trip' },
                      { label: 'CTA buttons', value: `${audit.ctaCount}`, sub: 'Conversion triggers' },
                    ].map((m, i) => (
                      <div
                        key={i}
                        className="panel-elevated"
                        style={{
                          padding: '14px 16px',
                          borderLeft: m.critical ? '3px solid var(--amber)' : '3px solid var(--border-subtle)',
                        }}
                      >
                        <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 500 }}>{m.label}</p>
                        <p className="tabular-nums" style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '20px',
                          fontWeight: 500,
                          color: m.critical ? 'var(--amber-bright)' : 'var(--text-primary)',
                          lineHeight: 1,
                          marginBottom: '4px',
                        }}>{m.value}</p>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>{m.sub}</p>
                      </div>
                    ))}
                  </div>

                  {/* Detailed findings */}
                  <div className="panel" style={{ overflow: 'hidden' }}>
                    <p style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--surface-2)' }}>
                      Finding breakdown
                    </p>
                    <div>
                      {[
                        { label: 'HTTPS / SSL', value: audit.isHttps ? 'Valid HTTPS' : 'Insecure HTTP', pass: audit.isHttps },
                        { label: 'Page title', value: audit.pageTitle || 'Missing <title> tag', mono: true, pass: Boolean(audit.pageTitle) },
                        { label: 'Meta description', value: audit.metaDescription || 'None found', mono: true, pass: Boolean(audit.metaDescription) },
                        { label: 'Heading hierarchy', value: `${audit.h1Count} H1, ${audit.h2Count} H2`, pass: audit.h1Count === 1 },
                        { label: 'Contact page', value: audit.hasContactPage ? 'Found' : 'Not detected', pass: audit.hasContactPage },
                        { label: 'Phone link', value: audit.hasPhoneLink ? 'Found' : 'Not detected', pass: audit.hasPhoneLink },
                        { label: 'OpenGraph tags', value: audit.hasOpenGraph ? 'Present' : 'Missing (no social preview)', pass: audit.hasOpenGraph },
                        { label: 'Broken links', value: `${audit.brokenLinksFound} found`, pass: audit.brokenLinksFound === 0 },
                        { label: 'Technologies', value: audit.detectedTech.length > 0 ? audit.detectedTech.join(', ') : 'None detected / custom', mono: true, pass: true },
                        { label: 'CTAs detected', value: audit.detectedCtas.length > 0 ? `"${audit.detectedCtas.join('", "')}"` : 'None', mono: true, pass: audit.detectedCtas.length > 0 },
                      ].map((row, i) => (
                        <div
                          key={i}
                          className="ledger-row"
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 16px', gap: '12px' }}
                        >
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>{row.label}</span>
                          <span
                            style={{
                              fontSize: '12px',
                              color: row.pass ? 'var(--teal-bright)' : 'var(--amber-bright)',
                              fontFamily: row.mono ? 'var(--font-mono)' : 'var(--font-sans)',
                              textAlign: 'right',
                              maxWidth: '300px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {row.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="panel" style={{ padding: '40px 24px', textAlign: 'center' }}>
                  {!business.hasWebsite ? (
                    <>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>No website to audit</p>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '360px', margin: '0 auto' }}>
                        This business has no owned web presence — a greenfield website build is the direct opportunity.
                      </p>
                    </>
                  ) : (
                    <>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>Audit not yet run</p>
                      <button className="btn-primary" onClick={handleAuditClick} disabled={isAuditing} style={{ margin: '0 auto' }}>
                        Run audit now
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB: OPPORTUNITIES ─────────────────────────────────────── */}
          {activeTab === 'opportunities' && (
            <div className="space-y-6">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 500, color: 'var(--text-primary)' }}>
                  Commercial opportunity analysis
                </h2>
                <button
                  className="btn-secondary"
                  onClick={handleExplainClick}
                  disabled={isExplaining}
                  style={{ fontSize: '12px' }}
                >
                  <Sparkles style={{ width: '12px', height: '12px', animation: isExplaining ? 'spin 1s linear infinite' : 'none' }} />
                  {isExplaining ? 'Synthesising with Gemini…' : 'Generate AI briefing'}
                </button>
              </div>

              {aiExplanation && (
                <div
                  className="panel"
                  style={{ padding: '20px', borderLeft: '3px solid var(--teal)' }}
                >
                  <p style={{ fontSize: '11px', color: 'var(--teal-bright)', fontWeight: 600, marginBottom: '12px' }}>
                    AI commercial brief — Buyer: {aiExplanation.buyerPersona}
                  </p>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '12px', lineHeight: 1.5 }}>
                    {aiExplanation.executiveSummary}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>Why buy now</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{aiExplanation.whyBuyNow}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>Pitch angle</p>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{aiExplanation.recommendedPitchAngle}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {business.opportunities.map(opp => (
                  <div key={opp.id} className="panel" style={{ overflow: 'hidden' }}>
                    <div
                      style={{
                        padding: '16px 20px',
                        borderBottom: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        flexWrap: 'wrap',
                        background: 'var(--surface-2)',
                      }}
                    >
                      <div>
                        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '3px' }}>{opp.title}</h3>
                        <p style={{ fontSize: '12px', color: 'var(--amber)' }}>{opp.targetService}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          className="tabular-nums"
                          style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 500, color: 'var(--amber-bright)' }}
                        >
                          {opp.score}%
                        </span>
                        <span className={`signal-badge ${opp.confidence === 'high' ? 'teal' : 'amber'}`}>
                          {opp.confidence}
                        </span>
                      </div>
                    </div>

                    {/* Evidence table */}
                    <div>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr 1fr',
                          padding: '10px 16px',
                          borderBottom: '1px solid var(--border-subtle)',
                          background: 'var(--surface-2)',
                        }}
                      >
                        {['Signal', 'Finding', 'Benchmark'].map(h => (
                          <span key={h} style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)' }}>{h}</span>
                        ))}
                      </div>
                      {opp.evidence.map((ev, i) => (
                        <div
                          key={i}
                          className="ledger-row"
                          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '11px 16px', gap: '8px' }}
                        >
                          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{ev.metric}</span>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{ev.finding}</span>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{ev.benchmark}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CRM / NOTES ──────────────────────────────────────── */}
          {activeTab === 'crm' && (
            <div className="space-y-5">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    Pipeline notes
                  </h2>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Track conversation stages and record call outcomes
                  </p>
                </div>
                {isSaved && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Stage:</span>
                    <select
                      value={business.savedLead?.status || 'new'}
                      onChange={e => onUpdateLeadStatus(business.id, e.target.value as LeadStatus)}
                      className="field-select"
                      style={{ width: 'auto', fontSize: '12px' }}
                    >
                      {['new', 'researching', 'contacted', 'replied', 'qualified', 'won', 'not_interested'].map(s => (
                        <option key={s} value={s}>{s.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Add note */}
              <form onSubmit={handleAddNoteSubmit} className="space-y-2">
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Add a note
                </label>
                <textarea
                  rows={3}
                  value={newNoteText}
                  onChange={e => setNewNoteText(e.target.value)}
                  placeholder="Call outcome, contact name, follow-up date…"
                  className="field-input"
                  style={{ resize: 'vertical' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isAddingNote || !newNoteText.trim()}
                    style={{ fontSize: '12px' }}
                  >
                    Save note
                  </button>
                </div>
              </form>

              {/* Notes timeline */}
              {business.savedLead?.notes && business.savedLead.notes.length > 0 ? (
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px' }}>
                    History ({business.savedLead.notes.length})
                  </p>
                  <div className="space-y-3">
                    {business.savedLead.notes.map(note => (
                      <div
                        key={note.id}
                        className="panel-elevated"
                        style={{ padding: '12px 14px' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>{note.author}</span>
                          <span className="tabular-nums" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
                            {new Date(note.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.55 }}>{note.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic' }}>
                  <MessageSquare style={{ width: '14px', height: '14px' }} />
                  No notes yet
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
