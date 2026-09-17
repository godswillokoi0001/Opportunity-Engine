import React, { useState, useMemo } from 'react';
import {
  Search,
  RefreshCw,
  Bookmark,
  BookmarkCheck,
  Send,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Filter,
  CheckCircle2,
  XCircle,
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
    <div className="space-y-6 w-full min-w-0">

      {/* ─── Search & Filters Card (Spacious) ────────────────────────────── */}
      <div className="card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              Discovered Commercial Opportunities
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">
              Showing {filtered.length} of {businesses.length} verified companies with detected digital weaknesses
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn-secondary text-xs self-start sm:self-auto cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Scanning...' : 'Re-run Discovery Engine'}</span>
          </button>
        </div>

        {/* Filter Bar Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search company, city, industry..."
              className="field-input pl-10 text-sm"
            />
          </div>

          {/* Industry Filter */}
          <div>
            <select
              value={selectedIndustry}
              onChange={e => setSelectedIndustry(e.target.value)}
              className="field-select text-sm"
            >
              <option value="all">All Industries ({industries.length})</option>
              {industries.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          {/* Website Status Filter */}
          <div>
            <select
              value={websiteFilter}
              onChange={e => setWebsiteFilter(e.target.value as any)}
              className="field-select text-sm"
            >
              <option value="all">All Website Statuses</option>
              <option value="has_website">Has Website (Needs Redesign)</option>
              <option value="no_website">No Website (Greenfield Build)</option>
            </select>
          </div>

          {/* Sorting */}
          <div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="field-select text-sm"
            >
              <option value="score">Highest Match Score</option>
              <option value="health">Weakest Digital Presence First</option>
              <option value="name">Company Name (A–Z)</option>
            </select>
          </div>

        </div>
      </div>

      {/* ─── Business Results List (Spacious & Clean Cards) ───────────────── */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            No businesses match your filters
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Try broadening your search query or selecting "All Industries".
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(biz => {
            const topOpp = biz.opportunities[0];
            const audit = biz.audit;
            const isSaved = Boolean(biz.savedLead);
            let domain = '';
            if (biz.websiteUrl) {
              try { domain = new URL(biz.websiteUrl).hostname; } catch { domain = biz.websiteUrl; }
            }

            return (
              <div
                key={biz.id}
                onClick={() => onSelectBusiness(biz)}
                className="card card-interactive p-6 group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

                  {/* Left Column: Company & Primary Opportunity */}
                  <div className="space-y-2.5 flex-1">
                    
                    {/* Header Row */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                        {biz.name}
                      </h2>
                      <span className="badge badge-neutral text-xs">
                        {biz.industry}
                      </span>
                      {biz.location.city && (
                        <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{biz.location.city}</span>
                        </span>
                      )}
                      {isSaved && (
                        <span className="badge badge-teal text-xs">Saved</span>
                      )}
                    </div>

                    {/* Contact & Web Footprint */}
                    <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)] flex-wrap">
                      {domain ? (
                        <a
                          href={biz.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="flex items-center gap-1 text-teal-700 dark:text-teal-400 hover:underline font-mono"
                        >
                          <span>{domain}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="badge badge-amber text-[11px]">No Web Domain</span>
                      )}

                      {biz.phone && (
                        <span className="flex items-center gap-1 text-[var(--text-muted)]">
                          <Phone className="w-3 h-3" />
                          <span>{biz.phone}</span>
                        </span>
                      )}

                      {biz.email && (
                        <span className="flex items-center gap-1 text-[var(--text-muted)] truncate max-w-[200px]">
                          <Mail className="w-3 h-3" />
                          <span>{biz.email}</span>
                        </span>
                      )}
                    </div>

                    {/* Detected Flaws / Opportunity Tags */}
                    {topOpp && (
                      <div className="pt-2 flex items-start gap-2 text-xs">
                        <span className="text-amber-700 dark:text-amber-400 font-bold shrink-0">
                          Why they need help:
                        </span>
                        <span className="text-[var(--text-secondary)]">
                          <strong className="text-[var(--text-primary)]">{topOpp.title}</strong>
                          {' — '}
                          {topOpp.triad.observed[0] || topOpp.valueProposition}
                        </span>
                      </div>
                    )}

                    {/* Technical Audit Signals (if audited) */}
                    {audit && (
                      <div className="flex items-center gap-2 pt-1 flex-wrap text-xs">
                        <span className={`badge ${audit.hasViewport ? 'badge-teal' : 'badge-rose'}`}>
                          {audit.hasViewport ? '✓ Responsive' : '✕ No Mobile Viewport'}
                        </span>
                        <span className={`badge ${audit.isHttps ? 'badge-teal' : 'badge-amber'}`}>
                          {audit.isHttps ? '✓ HTTPS Secure' : '✕ Insecure HTTP'}
                        </span>
                        <span className="badge badge-neutral">
                          Health: {audit.deterministicHealthScore}/100
                        </span>
                        {audit.ctaCount === 0 && (
                          <span className="badge badge-rose">
                            ✕ 0 Call-to-Action Buttons
                          </span>
                        )}
                      </div>
                    )}

                  </div>

                  {/* Right Column: Score & Action Buttons */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-[var(--border-subtle)]">
                    
                    {topOpp && (
                      <div className="text-left lg:text-right">
                        <div className="text-3xl font-bold text-amber-700 dark:text-amber-400">
                          {topOpp.score}%
                        </div>
                        <div className="text-xs text-[var(--text-muted)] font-medium">
                          Opportunity Match
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onSaveLead(biz.id);
                        }}
                        title={isSaved ? "Saved to Pipeline" : "Save Lead"}
                        className={`btn-secondary text-xs px-2.5 py-2 ${
                          isSaved ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border-teal-200' : ''
                        }`}
                      >
                        {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onOpenOutreach(biz);
                        }}
                        className="btn-primary text-xs px-3.5 py-2"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Draft Pitch</span>
                      </button>

                      <button
                        onClick={() => onSelectBusiness(biz)}
                        className="btn-secondary text-xs px-3.5 py-2"
                      >
                        <span>Dossier</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

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
