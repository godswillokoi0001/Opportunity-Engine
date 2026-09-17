import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Send,
  Bookmark,
  BookmarkCheck,
  RefreshCw,
  Sparkles,
  Phone,
  Mail,
  ArrowRight,
  TrendingUp,
  Globe,
  Layers,
  FileText,
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

  let domainDisplay = 'No website';
  if (business.websiteUrl) {
    try { domainDisplay = new URL(business.websiteUrl).hostname; } catch { domainDisplay = business.websiteUrl; }
  }

  const TABS = [
    { id: 'overview', label: 'Overview & Opportunity' },
    { id: 'audit', label: `Technical Audit ${audit ? `(${audit.deterministicHealthScore}/100)` : ''}` },
    { id: 'opportunities', label: `All Services (${business.opportunities.length})` },
    { id: 'crm', label: `Pipeline Notes ${isSaved ? `(${business.savedLead?.notes.length ?? 0})` : ''}` },
  ] as const;

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-end bg-slate-900/50 backdrop-blur-xs transition-opacity"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* ── Slide-in Drawer (Spacious & Modern) ─────────────────────────── */}
      <div
        className="dossier-panel open w-full max-w-2xl bg-[var(--surface-1)] border-l border-[var(--border-subtle)] flex flex-col h-full shadow-2xl overflow-hidden"
      >

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="p-6 sm:p-7 border-b border-[var(--border-subtle)] bg-[var(--surface-1)] shrink-0 space-y-4">
          
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="badge badge-teal">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Active Business</span>
              </span>
              {business.source.externalId && (
                <span className="text-xs font-mono text-[var(--text-muted)]">
                  {business.source.externalId}
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] leading-tight">
              {business.name}
            </h1>
            <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)] mt-1.5 flex-wrap">
              <span>{business.industry}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span>{business.location.address || `${business.location.city}, ${business.location.country}`}</span>
              </span>
              {business.websiteUrl && (
                <>
                  <span>•</span>
                  <a
                    href={business.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-teal-600 dark:text-teal-400 hover:underline font-mono"
                  >
                    <span>{domainDisplay}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Quick Action Bar */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => onOpenOutreach(business)}
              className="btn-primary text-sm shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>Draft Pitch Email</span>
            </button>

            <button
              onClick={() => onSaveLead(business.id)}
              className={`btn-secondary text-sm ${
                isSaved ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border-teal-200' : ''
              }`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-4 h-4" />
                  <span>Saved to Pipeline</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>Save Lead</span>
                </>
              )}
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-subtle)] overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-2 pt-1 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-amber-700 text-amber-700 font-bold dark:border-amber-400 dark:text-amber-400'
                    : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>

        {/* ── Scrollable Body Content (Spacious) ─────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-6">

          {/* ── TAB: OVERVIEW & OPPORTUNITY ─────────────────────────────── */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Quick Contact & Presence Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="card p-5 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Contact Channels
                  </h4>
                  <div className="space-y-1 text-sm text-[var(--text-primary)]">
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>{business.phone || 'Phone not listed'}</span>
                    </p>
                    <p className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>{business.email || 'Email not listed'}</span>
                    </p>
                  </div>
                </div>

                <div className="card p-5 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Digital Health Summary
                  </h4>
                  <div className="text-sm space-y-1">
                    <p className="text-[var(--text-secondary)]">
                      Website: <strong className={business.hasWebsite ? 'text-teal-600 dark:text-teal-400' : 'text-rose-600'}>
                        {business.hasWebsite ? 'Active Domain' : 'No Website'}
                      </strong>
                    </p>
                    <p className="text-[var(--text-secondary)]">
                      Mobile Layout: <strong className="capitalize text-[var(--text-primary)]">{business.digitalPresence.mobileReadiness}</strong>
                    </p>
                  </div>
                </div>

              </div>

              {/* The Core Opportunity Box */}
              {topOpp && (
                <div className="card overflow-hidden border-amber-200 dark:border-amber-900/60 shadow-md">
                  
                  <div className="p-5 sm:p-6 bg-amber-50/50 dark:bg-amber-950/20 border-b border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between gap-4">
                    <div>
                      <span className="badge badge-amber text-xs mb-1">
                        Primary Opportunity Identified
                      </span>
                      <h3 className="text-lg font-bold text-[var(--text-primary)]">
                        {topOpp.title}
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)]">
                        Target Service: <strong className="text-amber-700 dark:text-amber-400">{topOpp.targetService}</strong>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-3xl font-bold text-amber-700 dark:text-amber-400">
                        {topOpp.score}%
                      </div>
                      <div className="text-xs text-[var(--text-muted)] font-medium">Match Probability</div>
                    </div>
                  </div>

                  {/* 3-Layer Explanation Blocks */}
                  <div className="divide-y divide-[var(--border-subtle)]">
                    
                    {/* Observed Facts */}
                    <div className="p-5 sm:p-6 space-y-2 bg-[var(--surface-1)]">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        <span>1. What We Found in Their Code</span>
                      </div>
                      <ul className="space-y-1.5 text-sm text-[var(--text-secondary)] pt-1">
                        {topOpp.triad.observed.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-amber-600 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Client Friction */}
                    <div className="p-5 sm:p-6 space-y-2 bg-[var(--surface-1)]">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                        <AlertTriangle className="w-4 h-4" />
                        <span>2. Why This Hurts Their Business</span>
                      </div>
                      <ul className="space-y-1.5 text-sm text-[var(--text-secondary)] pt-1">
                        {topOpp.triad.inferred.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-rose-500 font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Pitch Strategy */}
                    <div className="p-5 sm:p-6 space-y-2 bg-[var(--surface-1)]">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                        <TrendingUp className="w-4 h-4" />
                        <span>3. Your Winning Pitch Angle</span>
                      </div>
                      <p className="text-sm italic text-[var(--text-secondary)] pt-1 leading-relaxed bg-[var(--surface-2)] p-3 rounded-lg border border-[var(--border-subtle)]">
                        "{topOpp.triad.aiInterpretation}"
                      </p>
                    </div>

                  </div>

                  <div className="p-4 bg-[var(--surface-2)] border-t border-[var(--border-subtle)] flex items-center justify-end">
                    <button
                      onClick={() => onOpenOutreach(business)}
                      className="btn-primary text-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Draft Outreach Email for This Lead</span>
                    </button>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* ── TAB: TECHNICAL AUDIT ────────────────────────────────────── */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">
                    Website Audit Findings
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Deterministic code crawl inspecting real HTML tags
                  </p>
                </div>

                {business.hasWebsite && (
                  <button
                    onClick={handleAuditClick}
                    disabled={isAuditing}
                    className="btn-secondary text-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
                    <span>{isAuditing ? 'Auditing...' : 'Re-crawl Site'}</span>
                  </button>
                )}
              </div>

              {audit ? (
                <div className="space-y-4">
                  {/* Health Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="card p-4 text-center">
                      <span className="text-xs text-[var(--text-muted)] block mb-1">Health Score</span>
                      <span className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                        {audit.deterministicHealthScore}/100
                      </span>
                    </div>
                    <div className="card p-4 text-center">
                      <span className="text-xs text-[var(--text-muted)] block mb-1">Mobile Viewport</span>
                      <span className={`text-sm font-bold ${audit.hasViewport ? 'text-teal-600' : 'text-rose-500'}`}>
                        {audit.hasViewport ? '✓ Responsive' : '✕ Missing'}
                      </span>
                    </div>
                    <div className="card p-4 text-center">
                      <span className="text-xs text-[var(--text-muted)] block mb-1">Page Speed</span>
                      <span className="text-sm font-bold text-[var(--text-primary)]">
                        {audit.responseTimeMs} ms
                      </span>
                    </div>
                    <div className="card p-4 text-center">
                      <span className="text-xs text-[var(--text-muted)] block mb-1">Call-to-Actions</span>
                      <span className="text-sm font-bold text-[var(--text-primary)]">
                        {audit.ctaCount} buttons
                      </span>
                    </div>
                  </div>

                  {/* Checklist Table */}
                  <div className="card divide-y divide-[var(--border-subtle)] overflow-hidden">
                    {[
                      { label: 'HTTPS Protocol', value: audit.isHttps ? 'Secure HTTPS' : 'Insecure HTTP', pass: audit.isHttps },
                      { label: 'Page Title', value: audit.pageTitle || 'Missing title', pass: Boolean(audit.pageTitle) },
                      { label: 'Meta Description', value: audit.metaDescription || 'None found', pass: Boolean(audit.metaDescription) },
                      { label: 'Heading Structure', value: `${audit.h1Count} H1, ${audit.h2Count} H2`, pass: audit.h1Count === 1 },
                      { label: 'Contact Page Detected', value: audit.hasContactPage ? 'Yes' : 'No', pass: audit.hasContactPage },
                      { label: 'Click-to-Call Link', value: audit.hasPhoneLink ? 'Yes' : 'No', pass: audit.hasPhoneLink },
                      { label: 'Detected Technologies', value: audit.detectedTech.join(', ') || 'Custom stack', pass: true },
                    ].map((row, idx) => (
                      <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                        <span className="font-semibold text-[var(--text-secondary)]">{row.label}</span>
                        <span className={`font-medium ${row.pass ? 'text-teal-600 dark:text-teal-400' : 'text-rose-500'}`}>
                          {row.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="card p-8 text-center">
                  <p className="text-sm text-[var(--text-secondary)] mb-4">
                    {business.hasWebsite ? 'This business website has not been audited yet.' : 'No website domain detected for this business.'}
                  </p>
                  {business.hasWebsite && (
                    <button onClick={handleAuditClick} disabled={isAuditing} className="btn-primary">
                      <span>Audit Website Now</span>
                    </button>
                  )}
                </div>
              )}

            </div>
          )}

          {/* ── TAB: ALL OPPORTUNITIES ───────────────────────────────────── */}
          {activeTab === 'opportunities' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  Detected Service Opportunities
                </h3>
                <button
                  onClick={handleExplainClick}
                  disabled={isExplaining}
                  className="btn-secondary text-xs"
                >
                  <Sparkles className={`w-3.5 h-3.5 text-amber-600 ${isExplaining ? 'animate-spin' : ''}`} />
                  <span>{isExplaining ? 'Analyzing with AI...' : 'Generate AI Brief'}</span>
                </button>
              </div>

              {/* AI Briefing if generated */}
              {aiExplanation && (
                <div className="card p-5 bg-teal-50/50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900/50 space-y-2">
                  <span className="badge badge-teal text-xs">AI Commercial Analysis</span>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">
                    Target Buyer Persona: {aiExplanation.buyerPersona}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {aiExplanation.executiveSummary}
                  </p>
                  <div className="pt-2 text-xs">
                    <strong className="text-teal-700 dark:text-teal-300">Why buy now: </strong>
                    <span className="text-[var(--text-secondary)]">{aiExplanation.whyBuyNow}</span>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {business.opportunities.map(opp => (
                  <div key={opp.id} className="card p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-[var(--text-primary)]">
                        {opp.title}
                      </h4>
                      <span className="badge badge-amber text-xs font-bold">
                        {opp.score}% Match
                      </span>
                    </div>
                    <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold">
                      Service: {opp.targetService}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {opp.valueProposition}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB: CRM & NOTES ────────────────────────────────────────── */}
          {activeTab === 'crm' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  Pipeline Stage & Notes
                </h3>
                {isSaved && (
                  <select
                    value={business.savedLead?.status || 'new'}
                    onChange={e => onUpdateLeadStatus(business.id, e.target.value as LeadStatus)}
                    className="field-select text-xs py-1.5 w-auto"
                  >
                    <option value="new">New Lead</option>
                    <option value="researching">Researching</option>
                    <option value="contacted">Contacted</option>
                    <option value="replied">Replied</option>
                    <option value="qualified">Qualified</option>
                    <option value="won">Closed Won</option>
                    <option value="not_interested">Not Interested</option>
                  </select>
                )}
              </div>

              {/* Add Note Input */}
              <form onSubmit={handleAddNoteSubmit} className="space-y-2">
                <textarea
                  rows={3}
                  value={newNoteText}
                  onChange={e => setNewNoteText(e.target.value)}
                  placeholder="Add note (call outcome, decision maker name, follow-up date)..."
                  className="field-input text-xs"
                />
                <button
                  type="submit"
                  disabled={isAddingNote || !newNoteText.trim()}
                  className="btn-primary text-xs ml-auto block"
                >
                  <span>{isAddingNote ? 'Saving...' : 'Add Note'}</span>
                </button>
              </form>

              {/* Notes Timeline */}
              {business.savedLead?.notes && business.savedLead.notes.length > 0 ? (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Note History
                  </h4>
                  {business.savedLead.notes.map(note => (
                    <div key={note.id} className="card p-3.5 space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                        <span className="font-semibold text-[var(--text-primary)]">{note.author}</span>
                        <span>{new Date(note.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)]">{note.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[var(--text-muted)] italic text-center py-4">
                  No notes recorded yet.
                </p>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
