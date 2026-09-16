import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Send, 
  Phone, 
  Mail, 
  ChevronRight, 
  ExternalLink, 
  MessageSquare,
  Tag,
  Plus,
  Clock,
  Filter
} from 'lucide-react';
import { Business, LeadStatus, SavedLead } from '../types.js';

interface SavedLeadsViewProps {
  businesses: Business[];
  onSelectBusiness: (biz: Business) => void;
  onUpdateStatus: (bizId: string, status: LeadStatus) => Promise<void>;
  onAddNote: (bizId: string, text: string) => Promise<void>;
  onOpenOutreach: (biz: Business) => void;
}

const STATUS_COLUMNS: Array<{ id: LeadStatus; label: string; color: string }> = [
  { id: 'new', label: 'New', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'researching', label: 'Researching', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'contacted', label: 'Contacted', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'replied', label: 'Replied', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'qualified', label: 'Qualified', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'won', label: 'Won Deal', color: 'bg-emerald-600 text-white border-emerald-700' },
];

export const SavedLeadsView: React.FC<SavedLeadsViewProps> = ({
  businesses,
  onSelectBusiness,
  onUpdateStatus,
  onAddNote,
  onOpenOutreach,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedLeadForNote, setSelectedLeadForNote] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState('');

  // Collect all saved leads
  const savedBusinesses = businesses.filter(b => Boolean(b.savedLead));

  const filtered = savedBusinesses.filter(b => {
    if (!b.savedLead) return false;
    if (filterStatus !== 'all' && b.savedLead.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return b.name.toLowerCase().includes(q) || b.industry.toLowerCase().includes(q) || b.location.city.toLowerCase().includes(q);
    }
    return true;
  });

  const handleNoteSubmit = async (bizId: string) => {
    if (!noteInput.trim()) return;
    await onAddNote(bizId, noteInput.trim());
    setNoteInput('');
    setSelectedLeadForNote(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Prospect & Deal Pipeline
              </h1>
              <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {savedBusinesses.length} Saved Prospects
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Manage qualification progress, client communications, internal agency notes, and deal velocity
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved prospects..."
              className="w-full text-xs pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full text-xs py-2 px-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Pipeline Stages ({savedBusinesses.length})</option>
              {STATUS_COLUMNS.map(col => (
                <option key={col.id} value={col.id}>{col.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Leads List / Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
            <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-800">No saved leads match your filter</p>
            <p className="text-xs text-slate-400 mt-1">
              Browse the Discovered Opportunities list and click "Save Lead" to add prospects to this pipeline.
            </p>
          </div>
        ) : (
          filtered.map((biz) => {
            const lead = biz.savedLead!;
            const topOpp = biz.opportunities[0];

            return (
              <div
                key={biz.id}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-200 transition-all shadow-xs space-y-3"
              >
                {/* Top Row: Info & Status Selector */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onSelectBusiness(biz)}
                        className="font-bold text-slate-900 text-base hover:text-indigo-600 transition-colors text-left"
                      >
                        {biz.name}
                      </button>
                      <span className="text-xs text-slate-500">• {biz.industry} ({biz.location.city})</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      {lead.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stage Dropdown & Actions */}
                  <div className="flex items-center space-x-2.5">
                    <select
                      value={lead.status}
                      onChange={(e) => onUpdateStatus(biz.id, e.target.value as LeadStatus)}
                      className="text-xs font-semibold py-1.5 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {STATUS_COLUMNS.map(col => (
                        <option key={col.id} value={col.id}>{col.label}</option>
                      ))}
                      <option value="not_interested">Not Interested</option>
                    </select>

                    <button
                      onClick={() => onOpenOutreach(biz)}
                      className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Outreach</span>
                    </button>

                    <button
                      onClick={() => onSelectBusiness(biz)}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 px-2.5 py-1.5 rounded-lg hover:bg-slate-50"
                    >
                      Report
                    </button>
                  </div>
                </div>

                {/* Middle Row: Target Opportunity Summary */}
                {topOpp && (
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Qualified Opportunity:</span>
                      <span className="font-semibold text-slate-800">{topOpp.title}</span>
                      <span className="text-slate-500 text-[11px] block mt-0.5">{topOpp.triad.observed[0]}</span>
                    </div>
                    <span className="text-xs font-black text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded shrink-0">
                      Score: {topOpp.score}%
                    </span>
                  </div>
                )}

                {/* Bottom Row: Notes & Quick Note Input */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      Agency Notes ({lead.notes.length})
                    </span>
                    <button
                      onClick={() => setSelectedLeadForNote(selectedLeadForNote === biz.id ? null : biz.id)}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      {selectedLeadForNote === biz.id ? 'Cancel' : '+ Add Note'}
                    </button>
                  </div>

                  {/* Inline Add Note */}
                  {selectedLeadForNote === biz.id && (
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        placeholder="Add quick interaction or call update..."
                        className="flex-1 text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <button
                        onClick={() => handleNoteSubmit(biz.id)}
                        className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
                      >
                        Save
                      </button>
                    </div>
                  )}

                  {/* Latest Note preview */}
                  {lead.notes.length > 0 && (
                    <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded border border-slate-100">
                      <strong className="text-slate-800">{lead.notes[0].author}:</strong> "{lead.notes[0].text}"
                      <span className="text-[10px] text-slate-400 ml-2">
                        ({new Date(lead.notes[0].createdAt).toLocaleDateString()})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
