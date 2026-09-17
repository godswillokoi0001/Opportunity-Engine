import React, { useState } from 'react';
import { Bookmark, Send, MessageSquare, Search, ArrowRight, CheckCircle2, Phone, Mail } from 'lucide-react';
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

  const handleQuickNote = async (bizId: string) => {
    const text = quickNoteMap[bizId]?.trim();
    if (!text) return;
    await onAddNote(bizId, text);
    setQuickNoteMap(prev => ({ ...prev, [bizId]: '' }));
  };

  return (
    <div className="space-y-6 w-full min-w-0">

      {/* Header */}
      <div className="card p-6 sm:p-8 space-y-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-1">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Commercial CRM & Outreach Pipeline</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Saved Leads Pipeline
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {savedBusinesses.length} saved high-intent {savedBusinesses.length === 1 ? 'prospect' : 'prospects'} in your active deal pipeline
          </p>
        </div>

        {/* Stage Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors ${
              statusFilter === 'all'
                ? 'bg-amber-600 text-white'
                : 'bg-[var(--surface-2)] text-[var(--text-secondary)] hover:bg-[var(--surface-3)]'
            }`}
          >
            All Stages ({savedBusinesses.length})
          </button>
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap capitalize transition-colors ${
                statusFilter === s
                  ? 'bg-amber-600 text-white'
                  : 'bg-[var(--surface-2)] text-[var(--text-secondary)] hover:bg-[var(--surface-3)]'
              }`}
            >
              {s.replace('_', ' ')} ({statusCounts[s]})
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Filter saved leads by name or industry..."
          className="field-input pl-10 text-sm"
        />
      </div>

      {/* Lead Cards List */}
      {savedBusinesses.length === 0 ? (
        <div className="card p-12 text-center space-y-3">
          <Bookmark className="w-10 h-10 text-[var(--text-muted)] mx-auto" />
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            Your pipeline is currently empty
          </h3>
          <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto">
            Discover verified companies in the Opportunities tab and bookmark the ones you want to contact.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-8 text-center text-sm text-[var(--text-secondary)]">
          No saved leads match your filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((biz) => {
            const topOpp = biz.opportunities[0];
            const lead = biz.savedLead;

            return (
              <div
                key={biz.id}
                className="card p-6 space-y-4 hover:shadow-md transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Company and Opportunity Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3
                        onClick={() => onSelectBusiness(biz)}
                        className="text-lg font-bold text-[var(--text-primary)] hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        {biz.name}
                      </h3>
                      <span className="badge badge-neutral text-xs">
                        {biz.industry} · {biz.location.city}
                      </span>
                    </div>

                    {/* Contact info */}
                    <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)] flex-wrap">
                      {biz.phone && (
                        <span className="flex items-center gap-1 text-[var(--text-muted)]">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{biz.phone}</span>
                        </span>
                      )}
                      {biz.email && (
                        <span className="flex items-center gap-1 text-[var(--text-muted)]">
                          <Mail className="w-3.5 h-3.5" />
                          <span>{biz.email}</span>
                        </span>
                      )}
                      {topOpp && (
                        <span className="text-amber-600 dark:text-amber-400 font-semibold">
                          Target: {topOpp.targetService} ({topOpp.score}% Match)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stage Dropdown & Action Buttons */}
                  <div className="flex items-center gap-3 shrink-0">
                    <select
                      value={lead?.status || 'new'}
                      onChange={e => onUpdateLeadStatus(biz.id, e.target.value as LeadStatus)}
                      className="field-select text-xs py-2 w-auto capitalize cursor-pointer font-semibold"
                    >
                      {statuses.map(s => (
                        <option key={s} value={s}>
                          Status: {s.replace('_', ' ')}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => onOpenOutreach(biz)}
                      className="btn-primary text-xs cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Draft Pitch</span>
                    </button>

                    <button
                      onClick={() => onSelectBusiness(biz)}
                      className="btn-secondary text-xs cursor-pointer"
                    >
                      <span>Dossier</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                </div>

                {/* Inline Notes Box */}
                <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2">
                  
                  {/* Existing Notes Display */}
                  {lead?.notes && lead.notes.length > 0 && (
                    <div className="space-y-1.5 pb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                        Latest Note:
                      </span>
                      <p className="text-xs text-[var(--text-secondary)] bg-[var(--surface-2)] p-2.5 rounded-lg border border-[var(--border-subtle)]">
                        {lead.notes[lead.notes.length - 1].text}
                        <span className="text-[10px] text-[var(--text-muted)] block mt-1">
                          Added by {lead.notes[lead.notes.length - 1].author} on {new Date(lead.notes[lead.notes.length - 1].createdAt).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                  )}

                  {/* Quick Add Note Bar */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={quickNoteMap[biz.id] ?? ''}
                      onChange={e => setQuickNoteMap(prev => ({ ...prev, [biz.id]: e.target.value }))}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleQuickNote(biz.id);
                        }
                      }}
                      placeholder="Add a quick note or meeting outcome..."
                      className="field-input text-xs py-1.5"
                    />
                    <button
                      onClick={() => handleQuickNote(biz.id)}
                      disabled={!quickNoteMap[biz.id]?.trim()}
                      className="btn-secondary text-xs shrink-0 cursor-pointer"
                    >
                      Save Note
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
