import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Globe, 
  Phone, 
  Mail, 
  Sparkles, 
  Bookmark, 
  BookmarkCheck, 
  ChevronRight, 
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Send
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
  const [selectedOpportunityType, setSelectedOpportunityType] = useState('all');
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'health'>('score');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Derive unique industries
  const industries = useMemo(() => {
    const set = new Set<string>();
    businesses.forEach(b => set.add(b.industry));
    return Array.from(set);
  }, [businesses]);

  // Derive unique opportunity types
  const oppTypes = useMemo(() => {
    const set = new Set<string>();
    businesses.forEach(b => {
      b.opportunities.forEach(o => set.add(o.title));
    });
    return Array.from(set);
  }, [businesses]);

  // Filtered and sorted records
  const filtered = useMemo(() => {
    return businesses.filter(b => {
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = b.name.toLowerCase().includes(q);
        const matchCity = b.location.city.toLowerCase().includes(q);
        const matchInd = b.industry.toLowerCase().includes(q);
        if (!matchName && !matchCity && !matchInd) return false;
      }

      // Industry
      if (selectedIndustry !== 'all' && b.industry !== selectedIndustry) {
        return false;
      }

      // Website status
      if (websiteFilter === 'has_website' && !b.hasWebsite) return false;
      if (websiteFilter === 'no_website' && b.hasWebsite) return false;

      // Opportunity type
      if (selectedOpportunityType !== 'all') {
        const hasType = b.opportunities.some(o => o.title === selectedOpportunityType);
        if (!hasType) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'score') {
        const scoreA = a.opportunities[0]?.score || 0;
        const scoreB = b.opportunities[0]?.score || 0;
        return scoreB - scoreA;
      }
      if (sortBy === 'health') {
        const hA = a.audit?.deterministicHealthScore || 0;
        const hB = b.audit?.deterministicHealthScore || 0;
        return hA - hB; // Lowest health score first (highest opportunity)
      }
      return a.name.localeCompare(b.name);
    });
  }, [businesses, searchQuery, selectedIndustry, websiteFilter, selectedOpportunityType, sortBy]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefreshDiscovery();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Discovered Business Opportunities
              </h1>
              <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-100">
                {filtered.length} of {businesses.length} records
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Public commercial records with deterministic signals and explainable buying reasons
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Re-run Engine</span>
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-4">
          {/* Search Query */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company, city, industry..."
              className="w-full text-xs pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Industry Filter */}
          <div>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full text-xs py-2 px-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Industries ({industries.length})</option>
              {industries.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          {/* Website Filter */}
          <div>
            <select
              value={websiteFilter}
              onChange={(e) => setWebsiteFilter(e.target.value as any)}
              className="w-full text-xs py-2 px-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Website Statuses</option>
              <option value="has_website">Has Website (Needs Upgrade)</option>
              <option value="no_website">No Website (Needs Greenfield Site)</option>
            </select>
          </div>

          {/* Opportunity Type */}
          <div>
            <select
              value={selectedOpportunityType}
              onChange={(e) => setSelectedOpportunityType(e.target.value)}
              className="w-full text-xs py-2 px-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Opportunity Types</option>
              {oppTypes.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full text-xs py-2 px-2.5 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 font-medium"
            >
              <option value="score">Sort: Opportunity Score (High to Low)</option>
              <option value="health">Sort: Most Fragile Presence (Low Health)</option>
              <option value="name">Sort: Company Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Business & Location</th>
                <th className="py-3 px-4">Digital Footprint</th>
                <th className="py-3 px-4">Contact Pathways</th>
                <th className="py-3 px-4">Qualified Opportunity</th>
                <th className="py-3 px-4 text-center">Score</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <p className="text-sm font-semibold text-slate-700">No businesses match the current filter</p>
                    <p className="text-xs text-slate-400 mt-1">Try resetting the industry or website filters</p>
                  </td>
                </tr>
              ) : (
                filtered.map((biz) => {
                  const topOpp = biz.opportunities[0];
                  const isSaved = Boolean(biz.savedLead);
                  const audit = biz.audit;

                  return (
                    <tr 
                      key={biz.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Business & Location */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => onSelectBusiness(biz)}
                          className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-left block"
                        >
                          {biz.name}
                        </button>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                          <span>{biz.industry}</span>
                          <span>•</span>
                          <span>{biz.location.city}, {biz.location.country}</span>
                        </div>
                        {biz.source.externalId && (
                          <span className="text-[10px] font-mono text-slate-400 mt-0.5 block">
                            Reg: {biz.source.externalId}
                          </span>
                        )}
                      </td>

                      {/* Digital Footprint */}
                      <td className="py-3.5 px-4">
                        {biz.hasWebsite ? (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              <span className="font-mono text-[11px] text-slate-700 truncate max-w-[150px]">
                                {biz.websiteUrl ? new URL(biz.websiteUrl).hostname : 'Website Live'}
                              </span>
                            </div>
                            {audit && (
                              <div className="flex items-center space-x-1 text-[10px]">
                                <span className={`px-1.5 py-0.2 rounded font-semibold ${
                                  audit.hasViewport ? 'bg-slate-100 text-slate-600' : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}>
                                  {audit.hasViewport ? 'Responsive' : 'Desktop Only'}
                                </span>
                                <span className="text-slate-400">|</span>
                                <span className="text-slate-500">
                                  Health: {audit.deterministicHealthScore}/100
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            No Owned Website
                          </span>
                        )}
                      </td>

                      {/* Contact Pathways */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 text-[11px] text-slate-600">
                          {biz.phone && (
                            <div className="flex items-center space-x-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span className="font-mono">{biz.phone}</span>
                            </div>
                          )}
                          {biz.email && (
                            <div className="flex items-center space-x-1">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span className="truncate max-w-[140px]">{biz.email}</span>
                            </div>
                          )}
                          {!biz.phone && !biz.email && (
                            <span className="text-slate-400 italic text-[10px]">Public directory only</span>
                          )}
                        </div>
                      </td>

                      {/* Qualified Opportunity */}
                      <td className="py-3.5 px-4 max-w-xs">
                        {topOpp ? (
                          <div>
                            <span className="font-bold text-slate-800 block text-xs">
                              {topOpp.title}
                            </span>
                            <span className="text-[11px] text-indigo-600 font-semibold block mt-0.5">
                              {topOpp.targetService}
                            </span>
                            <span className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {topOpp.triad.observed[0]}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No direct opportunity rule matched</span>
                        )}
                      </td>

                      {/* Score */}
                      <td className="py-3.5 px-4 text-center">
                        {topOpp ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="font-extrabold text-sm text-slate-900">
                              {topOpp.score}%
                            </span>
                            <span className={`text-[9px] font-bold uppercase tracking-wider ${
                              topOpp.confidence === 'high' ? 'text-emerald-600' : 'text-slate-500'
                            }`}>
                              {topOpp.confidence} Conf.
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {/* Save Lead */}
                          <button
                            onClick={() => onSaveLead(biz.id)}
                            title={isSaved ? 'Already saved in pipeline' : 'Save to Pipeline'}
                            className={`p-1.5 rounded border transition-colors ${
                              isSaved 
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                                : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                            }`}
                          >
                            {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                          </button>

                          {/* Quick Outreach */}
                          <button
                            onClick={() => onOpenOutreach(biz)}
                            title="Generate Tailored Outreach"
                            className="p-1.5 rounded border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100 text-indigo-700 transition-colors"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>

                          {/* View Full Report */}
                          <button
                            onClick={() => onSelectBusiness(biz)}
                            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-[11px] transition-colors"
                          >
                            <span>Report</span>
                            <ChevronRight className="w-3 h-3" />
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
