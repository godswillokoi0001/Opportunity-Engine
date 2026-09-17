import React, { useState } from 'react';
import { Bookmark, Send, MessageSquare, Search } from 'lucide-react';
import { Business, LeadStatus } from '../types.js';

interface SavedLeadsViewProps {
  savedBusinesses: Business[];
  onSelectBusiness: (biz: Business) => void;
  onOpenOutreach: (biz: Business) => void;
  onUpdateLeadStatus: (bizId: string, status: LeadStatus) => Promise<void>;
  onAddNote: (bizId: string, note: string) => Promise<void>;
}

export const SavedLeadsView: React.FC<SavedLeadsViewProps> = ({
  savedBusinesses,
  onSelectBusiness,
  onOpenOutreach,
  onUpdateLeadStatus,
  onAddNote,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [quickNoteMap, setQuickNoteMap] = useState<Record<string, string>>({});

  const filtered = savedBusinesses.filter(biz => {
    if (statusFilter !== 'all' && biz.savedLead?.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return biz.name.toLowerCase().includes(q) || biz.industry.toLowerCase().includes(q);
    }
    return true;
  });

  const statuses: LeadStatus[] = ['new', 'researching', 'contacted', 'replied', 'qualified', 'won', 'not_interested'];

  const statusCounts = statuses.reduce<Record<string, number>>((acc, s) => {
    acc[s] = savedBusinesses.filter(b => b.savedLead?.status === s).length;
    return acc;
  }, {});

  const statusColor: Record<string, { bg: string; border: string; text: string }> = {
    new: { bg: 'var(--surface-2)', border: 'var(--border-moderate)', text: 'var(--text-secondary)' },
    researching: { bg: 'var(--amber-surface)', border: 'var(--amber-border)', text: 'var(--amber-bright)' },
    contacted: { bg: 'var(--teal-surface)', border: 'var(--teal-border)', text: 'var(--teal-bright)' },
    replied: { bg: 'var(--teal-surface)', border: 'var(--teal-border)', text: 'var(--teal-bright)' },
    qualified: { bg: 'var(--amber-surface)', border: 'var(--amber-border)', text: 'var(--amber-bright)' },
    won: { bg: 'var(--teal-surface)', border: 'var(--teal-border)', text: 'var(--teal-bright)' },
    not_interested: { bg: 'var(--surface-2)', border: 'var(--border-subtle)', text: 'var(--text-muted)' },
  };

  const handleQuickNote = async (bizId: string) => {
    const text = quickNoteMap[bizId]?.trim();
    if (!text) return;
    await onAddNote(bizId, text);
    setQuickNoteMap(prev => ({ ...prev, [bizId]: '' }));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div
        style={{
          paddingBottom: '20px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '22px',
            fontWeight: 500,
            color: 'var(--text-primary)',
            marginBottom: '4px',
          }}
        >
          Lead pipeline
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          {savedBusinesses.length} saved lead{savedBusinesses.length !== 1 ? 's' : ''} · track conversation status and notes
        </p>
      </div>

      {/* Stage summary strip */}
      {savedBusinesses.length > 0 && (
        <div className="panel" style={{ overflow: 'hidden' }}>
          <div className="flex flex-wrap">
            {statuses.slice(0, 5).map((s, i) => (
              <button
                key={s}
                onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}
                style={{
                  flex: '1 1 80px',
                  padding: '12px 10px',
                  borderRight: i < 4 ? '1px solid var(--border-subtle)' : 'none',
                  background: statusFilter === s ? 'var(--surface-2)' : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'center',
                  outline: 'none',
                  boxShadow: 'none',
                }}
              >
                <span
                  className="tabular-nums"
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '18px',
                    fontWeight: 500,
                    color: statusCounts[s] > 0 ? 'var(--text-primary)' : 'var(--text-muted)',
                    display: 'block',
                    lineHeight: 1,
                    marginBottom: '4px',
                  }}
                >
                  {statusCounts[s]}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                  {s.replace('_', ' ')}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div style={{ position: 'relative' }}>
          <Search
            style={{ width: '13px', height: '13px', position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search saved leads…"
            className="field-input"
            style={{ paddingLeft: '30px' }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as any)}
          className="field-select"
        >
          <option value="all">All stages</option>
          {statuses.map(s => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      {/* Lead list */}
      {savedBusinesses.length === 0 ? (
        <div className="panel" style={{ padding: '56px 24px', textAlign: 'center' }}>
          <Bookmark style={{ width: '28px', height: '28px', color: 'var(--text-muted)', margin: '0 auto 16px' }} />
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            No leads saved yet
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Bookmark businesses from the Opportunities view to track them here.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="panel" style={{ padding: '40px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No leads match the current filter.</p>
        </div>
      ) : (
        <div className="panel" style={{ overflow: 'hidden' }}>
          {filtered.map((biz, idx) => {
            const topOpp = biz.opportunities[0];
            const lead = biz.savedLead;
            const colStyle = statusColor[lead?.status || 'new'] ?? statusColor.new;

            return (
              <div
                key={biz.id}
                className="ledger-row"
                style={{ padding: '16px 20px' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>

                  {/* Company info */}
                  <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <button
                        onClick={() => onSelectBusiness(biz)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}
                      >
                        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{biz.name}</span>
                      </button>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '2px 7px',
                          borderRadius: '3px',
                          fontSize: '11px',
                          fontWeight: 600,
                          background: colStyle.bg,
                          border: `1px solid ${colStyle.border}`,
                          color: colStyle.text,
                          textTransform: 'capitalize',
                        }}
                      >
                        {lead?.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                      {biz.industry} · {biz.location.city}
                    </p>
                    {topOpp && (
                      <p style={{ fontSize: '12px', color: 'var(--amber)', fontWeight: 500 }}>
                        {topOpp.targetService} · {topOpp.score}%
                      </p>
                    )}
                    {/* Most recent note */}
                    {lead?.notes && lead.notes.length > 0 && (
                      <div style={{ marginTop: '8px', display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                        <MessageSquare style={{ width: '11px', height: '11px', color: 'var(--text-muted)', flexShrink: 0, marginTop: '2px' }} />
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          {lead.notes[lead.notes.length - 1].text}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right: status + actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end', flexShrink: 0 }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        className="btn-primary"
                        onClick={() => onOpenOutreach(biz)}
                        style={{ fontSize: '11px', padding: '6px 10px' }}
                      >
                        <Send style={{ width: '10px', height: '10px' }} />
                        Pitch
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={() => onSelectBusiness(biz)}
                        style={{ fontSize: '11px', padding: '6px 10px' }}
                      >
                        Dossier
                      </button>
                    </div>
                    <select
                      value={lead?.status || 'new'}
                      onChange={e => onUpdateLeadStatus(biz.id, e.target.value as LeadStatus)}
                      className="field-select"
                      style={{ fontSize: '11px', padding: '5px 26px 5px 8px', width: 'auto' }}
                    >
                      {statuses.map(s => (
                        <option key={s} value={s}>{s.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Quick note row */}
                <div style={{ marginTop: '10px', display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    value={quickNoteMap[biz.id] ?? ''}
                    onChange={e => setQuickNoteMap(p => ({ ...p, [biz.id]: e.target.value }))}
                    placeholder="Quick note…"
                    className="field-input"
                    style={{ flex: 1, fontSize: '11px', padding: '5px 10px' }}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleQuickNote(biz.id); } }}
                  />
                  <button
                    className="btn-ghost"
                    onClick={() => handleQuickNote(biz.id)}
                    disabled={!quickNoteMap[biz.id]?.trim()}
                    style={{ fontSize: '11px' }}
                  >
                    Save
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
