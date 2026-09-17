import React, { useState, useMemo } from 'react';
import {
  Search,
  RefreshCw,
  Bookmark,
  BookmarkCheck,
  Send,
} from 'lucide-react';
import { Business } from '../types.js';

interface DiscoveryViewProps {
  businesses: Business[];
  onSelectBusiness: (biz: Business) => void;
  onSaveLead: (bizId: string) => Promise<void>;
  onRunAudit: (biz: Business) => Promise<void>;
  onOpenOutreach: (biz: Business) => void;
  onRefreshDiscovery: () => Promise<void>;
}

export const DiscoveryView: React.FC<DiscoveryViewProps> = ({
  businesses,
  onSelectBusiness,
  onSaveLead,
  onRunAudit,
  onOpenOutreach,
  onRefreshDiscovery,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [websiteFilter, setWebsiteFilter] = useState<'all' | 'has_website' | 'no_website'>('all');
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'health'>('score');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const industries = useMemo(() => {
    const set = new Set<string>();
    businesses.forEach(b => set.add(b.industry));
    return Array.from(set).sort();
  }, [businesses]);

  const filtered = useMemo(() => {
    return businesses
      .filter(b => {
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          if (
            !b.name.toLowerCase().includes(q) &&
            !b.location.city.toLowerCase().includes(q) &&
            !b.industry.toLowerCase().includes(q)
          ) return false;
        }
        if (selectedIndustry !== 'all' && b.industry !== selectedIndustry) return false;
        if (websiteFilter === 'has_website' && !b.hasWebsite) return false;
        if (websiteFilter === 'no_website' && b.hasWebsite) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'score') return (b.opportunities[0]?.score ?? 0) - (a.opportunities[0]?.score ?? 0);
        if (sortBy === 'health') return (a.audit?.deterministicHealthScore ?? 100) - (b.audit?.deterministicHealthScore ?? 100);
        return a.name.localeCompare(b.name);
      });
  }, [businesses, searchQuery, selectedIndustry, websiteFilter, sortBy]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try { await onRefreshDiscovery(); } finally { setIsRefreshing(false); }
  };

  return (
    <div className="space-y-5">

      {/* ─── Header & filters ─────────────────────────────────────────── */}
      <div className="panel" style={{ padding: '16px 20px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '20px',
                fontWeight: 500,
                color: 'var(--text-primary)',
                marginBottom: '4px',
              }}
            >
              Discovered opportunities
            </h1>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {filtered.length} of {businesses.length} businesses · public commercial records with deterministic audit signals
            </p>
          </div>
          <button
            className="btn-secondary"
            onClick={handleRefresh}
            disabled={isRefreshing}
            style={{ fontSize: '12px' }}
          >
            <RefreshCw
              style={{
                width: '12px',
                height: '12px',
                animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
              }}
            />
            Re-run engine
          </button>
        </div>

        {/* Filter row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          <div style={{ position: 'relative' }}>
            <Search
              style={{
                width: '13px',
                height: '13px',
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search company, city, industry…"
              className="field-input"
              style={{ paddingLeft: '30px' }}
            />
          </div>
          <select
            value={selectedIndustry}
            onChange={e => setSelectedIndustry(e.target.value)}
            className="field-select"
          >
            <option value="all">All industries</option>
            {industries.map(ind => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
          <select
            value={websiteFilter}
            onChange={e => setWebsiteFilter(e.target.value as any)}
            className="field-select"
          >
            <option value="all">Any website status</option>
            <option value="has_website">Has website (upgrade opportunity)</option>
            <option value="no_website">No website (greenfield)</option>
          </select>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="field-select"
          >
            <option value="score">Sort by opportunity score</option>
            <option value="health">Sort by weakest digital presence</option>
            <option value="name">Sort by company name</option>
          </select>
        </div>
      </div>

      {/* ─── Results ledger ───────────────────────────────────────────── */}
      <div className="panel" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid var(--border-moderate)',
                  background: 'var(--surface-2)',
                }}
              >
                {['Company', 'Digital status', 'Contact', 'Opportunity', 'Score', ''].map((col, i) => (
                  <th
                    key={i}
                    style={{
                      padding: '10px 16px',
                      textAlign: i === 4 ? 'center' : i === 5 ? 'right' : 'left',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                      whiteSpace: 'nowrap',
                      letterSpacing: 0,
                      textTransform: 'none',
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}
                  >
                    No results match the current filters.
                  </td>
                </tr>
              ) : (
                filtered.map(biz => {
                  const topOpp = biz.opportunities[0];
                  const isSaved = Boolean(biz.savedLead);
                  const audit = biz.audit;
                  let domainDisplay = '';
                  if (biz.websiteUrl) {
                    try { domainDisplay = new URL(biz.websiteUrl).hostname; } catch { domainDisplay = biz.websiteUrl; }
                  }

                  return (
                    <tr
                      key={biz.id}
                      className="ledger-row"
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Company */}
                      <td style={{ padding: '14px 16px', minWidth: '180px' }}>
                        <button
                          onClick={() => onSelectBusiness(biz)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left',
                            padding: 0,
                          }}
                        >
                          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '3px' }}>
                            {biz.name}
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {biz.industry} · {biz.location.city}
                          </span>
                          {biz.source.externalId && (
                            <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                              {biz.source.externalId}
                            </span>
                          )}
                        </button>
                      </td>

                      {/* Digital status */}
                      <td style={{ padding: '14px 16px', minWidth: '160px' }}>
                        {biz.hasWebsite ? (
                          <div>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '5px' }}>
                              {domainDisplay || 'Website active'}
                            </span>
                            {audit ? (
                              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                <span className={`signal-badge ${audit.hasViewport ? 'teal' : 'amber'}`}>
                                  {audit.hasViewport ? 'Responsive' : 'No viewport'}
                                </span>
                                <span
                                  className={`signal-badge ${audit.deterministicHealthScore >= 70 ? 'teal' : audit.deterministicHealthScore >= 40 ? 'amber' : ''}`}
                                  style={audit.deterministicHealthScore < 40 ? { background: 'var(--rose-surface)', border: '1px solid var(--rose-border)', color: 'var(--rose-bright)' } : {}}
                                >
                                  {audit.deterministicHealthScore}/100
                                </span>
                              </div>
                            ) : (
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>Not yet audited</span>
                            )}
                          </div>
                        ) : (
                          <span className="signal-badge amber">No website</span>
                        )}
                      </td>

                      {/* Contact */}
                      <td style={{ padding: '14px 16px', minWidth: '140px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                          {biz.phone && (
                            <div style={{ fontFamily: 'var(--font-mono)' }}>{biz.phone}</div>
                          )}
                          {biz.email && (
                            <div style={{
                              maxWidth: '140px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}>
                              {biz.email}
                            </div>
                          )}
                          {!biz.phone && !biz.email && (
                            <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Directory only</span>
                          )}
                        </div>
                      </td>

                      {/* Opportunity */}
                      <td style={{ padding: '14px 16px', maxWidth: '240px' }}>
                        {topOpp ? (
                          <div>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '3px' }}>
                              {topOpp.title}
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--amber)', display: 'block', marginBottom: '3px' }}>
                              {topOpp.targetService}
                            </span>
                            <span
                              style={{
                                fontSize: '11px',
                                color: 'var(--text-muted)',
                                display: '-webkit-box',
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {topOpp.triad.observed[0]}
                            </span>
                          </div>
                        ) : (
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>No match on this target</span>
                        )}
                      </td>

                      {/* Score */}
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        {topOpp ? (
                          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span
                              className="tabular-nums"
                              style={{
                                fontFamily: 'var(--font-serif)',
                                fontSize: '18px',
                                fontWeight: 500,
                                color: topOpp.score >= 80 ? 'var(--amber-bright)' : 'var(--text-secondary)',
                                lineHeight: 1,
                              }}
                            >
                              {topOpp.score}%
                            </span>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                              {topOpp.confidence}
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={e => { e.stopPropagation(); onSaveLead(biz.id); }}
                            title={isSaved ? 'Saved to pipeline' : 'Save to pipeline'}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '28px',
                              height: '28px',
                              borderRadius: '3px',
                              border: '1px solid',
                              cursor: 'pointer',
                              background: isSaved ? 'var(--teal-surface)' : 'transparent',
                              borderColor: isSaved ? 'var(--teal-border)' : 'var(--border-moderate)',
                              color: isSaved ? 'var(--teal-bright)' : 'var(--text-muted)',
                              transition: 'all 120ms ease',
                            }}
                          >
                            {isSaved
                              ? <BookmarkCheck style={{ width: '12px', height: '12px' }} />
                              : <Bookmark style={{ width: '12px', height: '12px' }} />
                            }
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); onOpenOutreach(biz); }}
                            title="Draft tailored outreach"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '28px',
                              height: '28px',
                              borderRadius: '3px',
                              border: '1px solid var(--amber-border)',
                              cursor: 'pointer',
                              background: 'var(--amber-surface)',
                              color: 'var(--amber-bright)',
                              transition: 'all 120ms ease',
                            }}
                          >
                            <Send style={{ width: '12px', height: '12px' }} />
                          </button>
                          <button
                            onClick={() => onSelectBusiness(biz)}
                            className="btn-secondary"
                            style={{ fontSize: '11px', padding: '5px 10px' }}
                          >
                            Dossier
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
