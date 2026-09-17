import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Users,
  Globe,
  Plus,
  ArrowRight,
  TrendingUp,
  BookmarkCheck,
  Send,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
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
  const [quickAuditUrl, setQuickAuditUrl] = useState('');

  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  const totalDiscovered = businesses.length;
  const qualifiedBusinesses = businesses.filter(b => b.opportunities.length > 0);
  const qualifiedCount = qualifiedBusinesses.length;
  const qualifyRate = totalDiscovered > 0 ? Math.round((qualifiedCount / totalDiscovered) * 100) : 0;

  // Top highest-scoring qualified leads
  const topLeads = [...qualifiedBusinesses]
    .sort((a, b) => (b.opportunities[0]?.score ?? 0) - (a.opportunities[0]?.score ?? 0))
    .slice(0, 5);

  const handleQuickAuditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickAuditUrl.trim()) {
      onNavigate('auditor');
    }
  };

  return (
    <div className="space-y-8 w-full min-w-0">

      {/* ─── 1. Agency Welcome Banner (Spacious & Responsive) ─────────────── */}
      <div className="card p-6 sm:p-8 bg-gradient-to-r from-[var(--surface-1)] to-[var(--surface-2)] w-full min-w-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60">
              <Sparkles className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
              <span>Commercial Agency Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
              Welcome back, {userProfile.name}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] break-words max-w-2xl leading-relaxed">
              <span className="font-semibold text-[var(--text-primary)]">{userProfile.agencyName}</span>
              {' · '}
              <span>Focus: {userProfile.primaryService}</span>
              {' in '}
              <span className="text-[var(--text-muted)]">{userProfile.targetLocations.join(', ')}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              onClick={() => onNavigate('auditor')}
              className="btn-secondary text-sm px-4 py-2.5 cursor-pointer"
            >
              <Globe className="w-4 h-4 text-teal-700 dark:text-teal-400" />
              <span>Live Website Auditor</span>
            </button>
            <button
              onClick={onNewCampaign}
              className="btn-primary text-sm px-5 py-2.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Campaign</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── 2. Key Metrics Grid (Spacious 2x2 on Tablet, 4-col on Desktop) ─ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 w-full min-w-0">
        
        {/* Metric 1 */}
        <div className="card p-6 flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-[var(--text-secondary)]">Active Campaigns</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-1.5">
              {activeCampaigns.length}
            </div>
            <button
              onClick={() => onNavigate('campaigns')}
              className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Manage all campaigns</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="card p-6 flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-[var(--text-secondary)]">Scanned Businesses</span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-1.5">
              {totalDiscovered}
            </div>
            <button
              onClick={() => onNavigate('discovery')}
              className="text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Browse scanned register</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="card p-6 flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-[var(--text-secondary)]">Qualified Opportunities</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)]">
                {qualifiedCount}
              </span>
              <span className="text-xs font-semibold text-[var(--text-muted)]">
                ({qualifyRate}% qualification rate)
              </span>
            </div>
            <button
              onClick={() => onNavigate('discovery')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View high-intent leads</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="card p-6 flex flex-col justify-between hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-[var(--text-secondary)]">Pipeline Leads Saved</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-1.5">
              {savedLeadsCount}
            </div>
            <button
              onClick={() => onNavigate('leads')}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View deal pipeline</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

      {/* ─── 3. Main Dashboard Grid (Spacious & Responsive) ───────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 w-full min-w-0">

        {/* ── Left / Main: High-Probability Opportunities ── */}
        <div className="xl:col-span-2 space-y-5 min-w-0">
          
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                Top Qualified Opportunities
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                Businesses with verified code defects ready for evidence-based outreach
              </p>
            </div>
            <button
              onClick={() => onNavigate('discovery')}
              className="btn-secondary text-xs px-3.5 py-1.5 cursor-pointer"
            >
              <span>View All Leads ({businesses.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {topLeads.length === 0 ? (
            <div className="card p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 mx-auto flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                No campaigns launched yet
              </h3>
              <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto">
                Start your first campaign to scan businesses in your city and discover clients with broken sites.
              </p>
              <button onClick={onNewCampaign} className="btn-primary cursor-pointer">
                <Plus className="w-4 h-4" />
                <span>Launch First Campaign</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4 w-full min-w-0">
              {topLeads.map((biz) => {
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
                    className="card p-6 hover:shadow-md transition-all cursor-pointer group space-y-4 w-full min-w-0"
                  >
                    {/* Top Row: Title, Badges & Match Score */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 w-full min-w-0">
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors truncate">
                            {biz.name}
                          </h3>
                          <span className="badge badge-neutral text-xs">
                            {biz.industry}
                          </span>
                          <span className="text-xs text-[var(--text-muted)]">
                            {biz.location.city}
                          </span>
                          {isSaved && (
                            <span className="badge badge-teal text-xs">Saved in Pipeline</span>
                          )}
                        </div>

                        {domain ? (
                          <span className="inline-flex items-center gap-1 font-mono text-xs text-teal-700 dark:text-teal-400">
                            <span>{domain}</span>
                            <ExternalLink className="w-3 h-3" />
                          </span>
                        ) : (
                          <span className="badge badge-rose text-xs">No Website Domain</span>
                        )}
                      </div>

                      {topOpp && (
                        <div className="flex items-center sm:flex-col sm:items-end gap-1.5 shrink-0">
                          <span className="text-2xl sm:text-3xl font-bold text-amber-700 dark:text-amber-400">
                            {topOpp.score}%
                          </span>
                          <span className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                            Match Score
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Middle: Opportunity Detail Box */}
                    {topOpp && (
                      <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border-subtle)] space-y-1.5 w-full min-w-0">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>Detected Flaw: {topOpp.title}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] break-words leading-relaxed">
                          {topOpp.triad.observed[0] || topOpp.valueProposition}
                        </p>
                      </div>
                    )}

                    {/* Bottom Row: Technical Tags & Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-[var(--border-subtle)]">
                      
                      {/* Technical Badges */}
                      {audit ? (
                        <div className="flex items-center gap-2 flex-wrap text-xs">
                          <span className={`badge ${audit.hasViewport ? 'badge-teal' : 'badge-rose'}`}>
                            {audit.hasViewport ? '✓ Responsive' : '✕ No Mobile Viewport'}
                          </span>
                          <span className={`badge ${audit.isHttps ? 'badge-teal' : 'badge-amber'}`}>
                            {audit.isHttps ? '✓ HTTPS' : '✕ Insecure'}
                          </span>
                          <span className="badge badge-neutral">
                            Health: {audit.deterministicHealthScore}/100
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-[var(--text-muted)]">
                          Public verified register entry
                        </span>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectBusiness(biz);
                          }}
                          className="btn-secondary text-xs px-3.5 py-1.5"
                        >
                          <span>Open Dossier</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* ── Right Column: Tools & Overview ── */}
        <div className="space-y-6 min-w-0">

          {/* Quick Live Auditor Tool */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  Live Website Auditor
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Inspect any business URL in real-time
                </p>
              </div>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Have a prospect in mind? Enter their URL to run an instant server-side crawl (speed, mobile viewport, CTA count).
            </p>

            <form onSubmit={handleQuickAuditSubmit} className="space-y-2.5">
              <input
                type="url"
                value={quickAuditUrl}
                onChange={(e) => setQuickAuditUrl(e.target.value)}
                placeholder="https://example.com"
                className="field-input text-xs font-mono"
              />
              <button
                type="submit"
                className="btn-primary w-full text-xs py-2.5 justify-center cursor-pointer"
              >
                <span>Audit Site</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Active Campaigns Card */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                Active Campaigns
              </h3>
              <button
                onClick={onNewCampaign}
                className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
              >
                + Create
              </button>
            </div>

            {campaigns.length === 0 ? (
              <p className="text-xs text-[var(--text-muted)] italic">No campaigns active</p>
            ) : (
              <div className="space-y-3">
                {campaigns.slice(0, 3).map((camp) => (
                  <div
                    key={camp.id}
                    onClick={() => onNavigate('discovery')}
                    className="p-3.5 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--surface-3)] transition-colors cursor-pointer space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-[var(--text-primary)] truncate">
                        {camp.name}
                      </h4>
                      <span className="badge badge-teal text-[10px] shrink-0">Active</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      {camp.location} · {camp.discoveredCount} scanned
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity Timeline */}
          {activityLogs.length > 0 && (
            <div className="card p-6 space-y-4">
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                Recent Engine Activity
              </h3>
              <div className="space-y-3 text-xs">
                {activityLogs.slice(0, 4).map((log) => (
                  <div key={log.id} className="flex items-start gap-2.5 pb-2.5 border-b border-[var(--border-subtle)] last:border-0 last:pb-0">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-[var(--text-primary)] truncate">
                        {log.action}
                      </p>
                      <p className="text-[var(--text-muted)] text-[11px] break-words">
                        {log.details}
                      </p>
                      <span className="text-[10px] text-[var(--text-muted)] block mt-0.5">
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
