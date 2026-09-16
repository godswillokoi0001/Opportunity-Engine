import React from 'react';
import { 
  Layers, 
  Compass, 
  Sparkles, 
  Users, 
  ArrowRight, 
  Activity, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  Plus
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
  const qualifiedOpportunities = businesses.filter(b => b.opportunities.length > 0).length;

  // Recent high-confidence opportunities
  const highConfidenceOpps = businesses
    .filter(b => b.opportunities.length > 0)
    .slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome with Context */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
                Active Agency Workspace
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {userProfile.agencyName}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-2">
              Opportunity Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Targeting: <strong className="text-slate-800">{userProfile.primaryService}</strong> across <strong className="text-slate-800">{userProfile.targetLocations.join(', ')}</strong>.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate('discovery')}
              className="inline-flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-4 py-2.5 rounded-lg border border-slate-300 transition-colors"
            >
              <span>View Discovered ({businesses.length})</span>
            </button>
            <button
              onClick={onNewCampaign}
              className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Launch Campaign</span>
            </button>
          </div>
        </div>
      </div>

      {/* Meaningful Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Campaigns</span>
            <Compass className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900">{activeCampaigns.length}</span>
            <span className="text-xs text-slate-500 ml-2">running</span>
          </div>
          <button
            onClick={() => onNavigate('campaigns')}
            className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Manage campaigns</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Businesses Discovered</span>
            <Globe className="w-4 h-4 text-slate-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900">{totalDiscovered}</span>
            <span className="text-xs text-slate-500 ml-2">records</span>
          </div>
          <button
            onClick={() => onNavigate('discovery')}
            className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Browse dataset</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Qualified Opportunities</span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900">{qualifiedOpportunities}</span>
            <span className="text-xs text-emerald-600 font-semibold ml-2">
              {totalDiscovered > 0 ? `${Math.round((qualifiedOpportunities / totalDiscovered) * 100)}% qualified` : '0%'}
            </span>
          </div>
          <p className="mt-3 text-[11px] text-slate-500 truncate">
            Backed by deterministic signals
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Saved in Pipeline</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900">{savedLeadsCount}</span>
            <span className="text-xs text-slate-500 ml-2">prospects</span>
          </div>
          <button
            onClick={() => onNavigate('leads')}
            className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Open lead pipeline</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Grid: Qualified Opportunities + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: High-Value Opportunities */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Highest-Probability Opportunities</h2>
              <p className="text-xs text-slate-500">Businesses with clear, verifiable reasons to engage</p>
            </div>
            <button
              onClick={() => onNavigate('discovery')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              View all ({businesses.length})
            </button>
          </div>

          <div className="space-y-3">
            {highConfidenceOpps.map((biz) => {
              const topOpp = biz.opportunities[0];
              const isSaved = Boolean(biz.savedLead);
              return (
                <div
                  key={biz.id}
                  onClick={() => onSelectBusiness(biz)}
                  className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                          {biz.name}
                        </span>
                        {isSaved && (
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded">
                            Saved ({biz.savedLead?.status})
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500">
                        {biz.industry} • {biz.location.city}, {biz.location.country}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded">
                        Score: {topOpp?.score || 80}%
                      </span>
                      <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded">
                        {topOpp?.targetService || 'Web Design'}
                      </span>
                    </div>
                  </div>

                  {/* Triad Preview */}
                  {topOpp && (
                    <div className="mt-3 text-xs space-y-1.5">
                      <p className="text-slate-700 font-medium line-clamp-1">
                        <strong className="text-slate-900">Observed:</strong> {topOpp.triad.observed[0]}
                      </p>
                      <p className="text-slate-500 italic text-[11px] line-clamp-2">
                        "{topOpp.triad.aiInterpretation}"
                      </p>
                    </div>
                  )}

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500 font-mono">
                      {biz.hasWebsite ? (biz.websiteUrl ? new URL(biz.websiteUrl).hostname : 'Website present') : 'No owned website'}
                    </span>
                    <span className="text-indigo-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      Inspect Intelligence Report <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Active Campaigns & Activity */}
        <div className="space-y-6">
          {/* Active Campaigns Panel */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Active Campaigns</h3>
              <button
                onClick={onNewCampaign}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
              >
                + New
              </button>
            </div>

            <div className="space-y-3">
              {campaigns.slice(0, 3).map((camp) => (
                <div key={camp.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span className="truncate max-w-[160px]">{camp.name}</span>
                    <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">Active</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-1">{camp.location} • {camp.industries.join(', ')}</p>
                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600">
                    <span>{camp.discoveredCount} Discovered</span>
                    <span className="font-semibold text-indigo-600">{camp.qualifiedCount} Qualified</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit / Live Crawler Quick Action */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-xl p-5 text-white shadow-sm">
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Globe className="w-4 h-4" />
              <span>SSRF-Safe Live Crawler</span>
            </div>
            <h3 className="text-sm font-bold text-white">Instant Website Audit</h3>
            <p className="text-xs text-slate-300 mt-1 mb-4 leading-relaxed">
              Test any public URL against our deterministic crawler to inspect viewports, CTAs, headings, and tech stack signatures.
            </p>
            <button
              onClick={() => onNavigate('auditor')}
              className="w-full bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Open Live Inspector</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-700" />
            </button>
          </div>

          {/* Recent Activity Log */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-slate-500" />
                <span>Recent System Activity</span>
              </h3>
            </div>
            <div className="space-y-3">
              {activityLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="text-xs border-l-2 border-indigo-500 pl-2.5 py-0.5">
                  <p className="font-semibold text-slate-800">{log.action}</p>
                  <p className="text-slate-500 text-[11px] leading-tight">{log.details}</p>
                  <span className="text-[10px] text-slate-400">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
