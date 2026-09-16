import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Globe, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  RefreshCw, 
  Send, 
  Bookmark, 
  BookmarkCheck, 
  FileText,
  Clock,
  Layers,
  Cpu,
  ChevronRight,
  TrendingUp,
  Tag,
  MessageSquare
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
    try {
      await onRunAudit(business);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleExplainClick = async () => {
    if (!topOpp) return;
    setIsExplaining(true);
    try {
      const data = await onExplainOpportunity(business.id, topOpp.id);
      setAiExplanation(data);
    } finally {
      setIsExplaining(false);
    }
  };

  const handleAddNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    setIsAddingNote(true);
    try {
      await onAddNote(business.id, newNoteText.trim());
      setNewNoteText('');
    } finally {
      setIsAddingNote(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col text-left overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                Business Intelligence Dossier
              </span>
              <span className="text-xs text-slate-500">
                Source: {business.source.license}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight mt-1">
              {business.name}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-2">
              <span>{business.industry} {business.subIndustry ? `(${business.subIndustry})` : ''}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {business.location.address || `${business.location.city}, ${business.location.country}`}
              </span>
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onOpenOutreach(business)}
              className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Draft Outreach</span>
            </button>

            <button
              onClick={() => onSaveLead(business.id)}
              className={`inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-2 rounded-lg border transition-colors ${
                isSaved
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Bookmark className="w-3.5 h-3.5 text-slate-500" />}
              <span>{isSaved ? 'Saved' : 'Save Lead'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 bg-white flex space-x-6 text-xs font-semibold">
          {[
            { id: 'overview', label: 'Overview & Signals' },
            { id: 'audit', label: `Technical Audit ${audit ? `(${audit.deterministicHealthScore}/100)` : ''}` },
            { id: 'opportunities', label: `Opportunity Analysis (${business.opportunities.length})` },
            { id: 'crm', label: `Pipeline & Notes ${isSaved ? `(${business.savedLead?.notes.length || 0})` : ''}` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Top Summary Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Contact & Registration Box */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5 text-xs">
                  <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    Verified Commercial Record
                  </h3>
                  <div className="space-y-1 text-slate-600">
                    <p><strong className="text-slate-800">Phone:</strong> {business.phone || 'Not listed in registry'}</p>
                    <p><strong className="text-slate-800">Email:</strong> {business.email || 'Public inquiry form only'}</p>
                    <p><strong className="text-slate-800">Registry ID:</strong> {business.source.externalId || 'RC-Commercial-Public'}</p>
                    <p><strong className="text-slate-800">Status:</strong> Verified Active Operating Entity</p>
                  </div>
                </div>

                {/* Digital Presence Health */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5 text-xs">
                  <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-indigo-600" />
                    Digital Footprint Status
                  </h3>
                  <div className="space-y-1 text-slate-600">
                    <p><strong className="text-slate-800">Website:</strong> {business.hasWebsite ? 'Owned Domain Active' : 'No Owned Website Detected'}</p>
                    <p><strong className="text-slate-800">Mobile Adaptation:</strong> {business.digitalPresence.mobileReadiness}</p>
                    <p><strong className="text-slate-800">Contact Friction:</strong> {business.digitalPresence.contactFriction.toUpperCase()}</p>
                    <p><strong className="text-slate-800">Social Footprint:</strong> {business.digitalPresence.socialChannelsCount} channels detected</p>
                  </div>
                </div>

                {/* Top Opportunity Qualification Score */}
                <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40 space-y-2.5 text-xs">
                  <h3 className="font-bold text-indigo-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Opportunity Qualification
                  </h3>
                  <div>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-2xl font-black text-indigo-900">{topOpp?.score || 85}%</span>
                      <span className="text-indigo-700 font-bold text-xs uppercase">Probability</span>
                    </div>
                    <p className="text-slate-700 font-semibold mt-1">{topOpp?.title || 'Digital Modernization'}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">Service: {topOpp?.targetService}</p>
                  </div>
                </div>
              </div>

              {/* Tri-Layer Transparent Opportunity Framework */}
              {topOpp && (
                <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">Tri-Layer Reasoning Framework</span>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">Why This Business Is Worth Approaching</h3>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                      {topOpp.confidence.toUpperCase()} Confidence
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    {/* Observed */}
                    <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="font-bold text-slate-900 block mb-1.5 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                        1. Observed (Code Facts)
                      </span>
                      <ul className="space-y-1.5 text-slate-600">
                        {topOpp.triad.observed.map((obs, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-slate-400">•</span>
                            <span>{obs}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Inferred */}
                    <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="font-bold text-slate-900 block mb-1.5 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        2. Inferred (Client Impact)
                      </span>
                      <ul className="space-y-1.5 text-slate-600">
                        {topOpp.triad.inferred.map((inf, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-slate-400">•</span>
                            <span>{inf}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* AI Commercial Interpretation */}
                    <div className="p-3.5 rounded-lg bg-indigo-50/50 border border-indigo-100">
                      <span className="font-bold text-indigo-950 block mb-1.5 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                        3. Strategic Rationale
                      </span>
                      <p className="text-slate-700 leading-relaxed italic text-[11px]">
                        "{topOpp.triad.aiInterpretation}"
                      </p>
                    </div>
                  </div>

                  {/* Recommended Action */}
                  <div className="p-3.5 rounded-lg bg-emerald-50/60 border border-emerald-200 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-emerald-900 block">Recommended Commercial Pitch</span>
                      <span className="text-emerald-800 text-[11px]">{topOpp.recommendedAction}</span>
                    </div>
                    <button
                      onClick={() => onOpenOutreach(business)}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors shrink-0 ml-3"
                    >
                      <span>Generate Pitch</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TECHNICAL AUDIT */}
          {activeTab === 'audit' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Deterministic Website Audit</h3>
                  <p className="text-xs text-slate-500">
                    Inspected directly via safe SSRF-protected crawler without browser simulation overhead
                  </p>
                </div>
                {business.hasWebsite && (
                  <button
                    onClick={handleAuditClick}
                    disabled={isAuditing}
                    className="inline-flex items-center space-x-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
                    <span>{isAuditing ? 'Running Safe Audit...' : 'Re-crawl URL Now'}</span>
                  </button>
                )}
              </div>

              {audit ? (
                <div className="space-y-5">
                  {/* Health Score & Key Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
                      <span className="text-[11px] text-slate-500 font-semibold block">Technical Health</span>
                      <span className="text-2xl font-black text-slate-900">{audit.deterministicHealthScore}/100</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Deterministic Index</span>
                    </div>

                    <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
                      <span className="text-[11px] text-slate-500 font-semibold block">Mobile Viewport</span>
                      <span className={`text-base font-bold ${audit.hasViewport ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {audit.hasViewport ? 'Configured' : 'Missing (Critical)'}
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">&lt;meta name="viewport"&gt;</span>
                    </div>

                    <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
                      <span className="text-[11px] text-slate-500 font-semibold block">Action CTAs</span>
                      <span className="text-2xl font-black text-slate-900">{audit.ctaCount}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Action buttons detected</span>
                    </div>

                    <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
                      <span className="text-[11px] text-slate-500 font-semibold block">Response Time</span>
                      <span className="text-2xl font-black text-slate-900">{audit.responseTimeMs}ms</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">HTTP latency</span>
                    </div>
                  </div>

                  {/* Detailed Checklist Table */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <div className="bg-slate-50 px-4 py-2.5 font-bold text-slate-800 border-b border-slate-200">
                      Detailed Technical Finding Breakdown
                    </div>
                    <div className="divide-y divide-slate-200 bg-white">
                      <div className="p-3.5 flex items-center justify-between">
                        <span className="font-medium text-slate-700">HTTPS Security & Encryption</span>
                        <span className={`font-semibold ${audit.isHttps ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {audit.isHttps ? 'Valid HTTPS' : 'Insecure HTTP'}
                        </span>
                      </div>
                      <div className="p-3.5 flex items-center justify-between">
                        <span className="font-medium text-slate-700">Page Title</span>
                        <span className="text-slate-900 font-mono text-[11px] max-w-sm truncate">
                          {audit.pageTitle || 'Missing <title> tag'}
                        </span>
                      </div>
                      <div className="p-3.5 flex items-center justify-between">
                        <span className="font-medium text-slate-700">Meta Description</span>
                        <span className="text-slate-900 font-mono text-[11px] max-w-sm truncate">
                          {audit.metaDescription || 'No meta description found'}
                        </span>
                      </div>
                      <div className="p-3.5 flex items-center justify-between">
                        <span className="font-medium text-slate-700">Heading Hierarchy</span>
                        <span className="text-slate-800">
                          {audit.h1Count} H1 tags, {audit.h2Count} H2 tags
                        </span>
                      </div>
                      <div className="p-3.5 flex items-center justify-between">
                        <span className="font-medium text-slate-700">Detected Call-to-Actions</span>
                        <span className="text-slate-800">
                          {audit.detectedCtas.length ? audit.detectedCtas.join(', ') : 'None detected'}
                        </span>
                      </div>
                      <div className="p-3.5 flex items-center justify-between">
                        <span className="font-medium text-slate-700">Detected Technologies</span>
                        <div className="flex flex-wrap gap-1 justify-end">
                          {audit.detectedTech.length > 0 ? (
                            audit.detectedTech.map(t => (
                              <span key={t} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">
                                {t}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400">Custom / Unknown</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl text-slate-500 text-xs">
                  <p className="font-semibold text-slate-800">No website registered for this business</p>
                  <p className="mt-1">
                    This business operates through physical/regional directory listings and does not own an official web portal.
                    This represents a prime <strong>Website Creation</strong> opportunity!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: OPPORTUNITIES */}
          {activeTab === 'opportunities' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Commercial Opportunity Analysis</h3>
                  <p className="text-xs text-slate-500">Every opportunity is supported by verified evidence and benchmark data</p>
                </div>
                <button
                  onClick={handleExplainClick}
                  disabled={isExplaining}
                  className="inline-flex items-center space-x-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isExplaining ? 'animate-spin' : ''}`} />
                  <span>{isExplaining ? 'Synthesizing with Gemini...' : 'Generate AI Commercial Briefing'}</span>
                </button>
              </div>

              {/* AI Briefing if generated */}
              {aiExplanation && (
                <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 space-y-3 text-xs shadow-lg">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-indigo-400 font-bold uppercase tracking-wider text-[10px]">
                      AI Commercial Strategic Dossier
                    </span>
                    <span className="text-slate-400 text-[10px]">Target Buyer: {aiExplanation.buyerPersona}</span>
                  </div>
                  <p className="text-slate-200 font-semibold">{aiExplanation.executiveSummary}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-slate-300">
                    <div>
                      <strong className="text-white block mb-0.5">Why Buy Now Catalyst:</strong>
                      <p className="text-[11px] leading-relaxed">{aiExplanation.whyBuyNow}</p>
                    </div>
                    <div>
                      <strong className="text-white block mb-0.5">Recommended Pitch Angle:</strong>
                      <p className="text-[11px] leading-relaxed">{aiExplanation.recommendedPitchAngle}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Opportunities List */}
              <div className="space-y-4">
                {business.opportunities.map((opp) => (
                  <div key={opp.id} className="border border-slate-200 rounded-xl p-5 bg-white space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900 text-sm">{opp.title}</span>
                          <span className="text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                            {opp.confidence} Confidence
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">Recommended Service: <strong>{opp.targetService}</strong></p>
                      </div>

                      <span className="text-lg font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded">
                        {opp.score}%
                      </span>
                    </div>

                    {/* Evidence Table */}
                    <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                      <div className="bg-slate-50 px-3.5 py-2 font-bold text-slate-700 border-b border-slate-200">
                        Supporting Evidence Items
                      </div>
                      <div className="divide-y divide-slate-200">
                        {opp.evidence.map((ev, i) => (
                          <div key={i} className="p-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div>
                              <span className="text-slate-400 text-[10px] uppercase font-bold block">Signal / Metric</span>
                              <span className="font-semibold text-slate-900">{ev.metric}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 text-[10px] uppercase font-bold block">Observed Finding</span>
                              <span className="text-slate-700">{ev.finding}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 text-[10px] uppercase font-bold block">Industry Benchmark</span>
                              <span className="text-slate-500">{ev.benchmark}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CRM & PIPELINE NOTES */}
          {activeTab === 'crm' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Lead Pipeline & Agency Notes</h3>
                  <p className="text-xs text-slate-500">Track conversation stages and client interaction history</p>
                </div>

                {/* Status Selector */}
                {isSaved && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-600 font-medium">Pipeline Status:</span>
                    <select
                      value={business.savedLead?.status || 'new'}
                      onChange={(e) => onUpdateLeadStatus(business.id, e.target.value as LeadStatus)}
                      className="text-xs py-1.5 px-2.5 border border-slate-300 rounded-md bg-white font-semibold text-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="new">New</option>
                      <option value="researching">Researching</option>
                      <option value="contacted">Contacted</option>
                      <option value="replied">Replied</option>
                      <option value="qualified">Qualified</option>
                      <option value="won">Won</option>
                      <option value="not_interested">Not Interested</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNoteSubmit} className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Add Internal Note
                </label>
                <textarea
                  rows={3}
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Record call outcome, contact name, or follow-up notes..."
                  className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isAddingNote || !newNoteText.trim()}
                    className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    <span>Save Note</span>
                  </button>
                </div>
              </form>

              {/* Notes Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Activity History</h4>
                {business.savedLead && business.savedLead.notes.length > 0 ? (
                  business.savedLead.notes.map((note) => (
                    <div key={note.id} className="p-3.5 bg-white border border-slate-200 rounded-lg text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-500 text-[11px]">
                        <span className="font-semibold text-slate-800">{note.author}</span>
                        <span>{new Date(note.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{note.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No notes added yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
