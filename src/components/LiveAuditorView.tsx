import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  ArrowRight, 
  Smartphone, 
  Clock, 
  Cpu, 
  ExternalLink,
  Code,
  Sparkles
} from 'lucide-react';
import { WebsiteAudit } from '../types.js';

interface LiveAuditorViewProps {
  onRunLiveAudit: (url: string) => Promise<WebsiteAudit>;
}

export const LiveAuditorView: React.FC<LiveAuditorViewProps> = ({
  onRunLiveAudit,
}) => {
  const [urlInput, setUrlInput] = useState('https://lagosforwarding.com.ng');
  const [isAuditing, setIsAuditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<WebsiteAudit | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setError(null);
    setIsAuditing(true);
    try {
      const result = await onRunLiveAudit(urlInput.trim());
      setAuditResult(result);
    } catch (err: any) {
      setError(err.message || 'Audit failed. Check that the URL is public and accessible.');
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Safe Crawler Explanation */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div className="flex items-center space-x-2 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>SSRF-Safe Deterministic Inspector</span>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Live Website Diagnostic & Signal Engine
        </h1>
        <p className="text-xs text-slate-600 mt-1 max-w-2xl">
          Enter any public business URL to execute an immediate deterministic audit. The crawler validates DNS resolution against private network ranges (SSRF-protected), sets strict size and timeout boundaries, and extracts raw DOM signals.
        </p>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="e.g. https://lagosforwarding.com.ng or https://example.com"
              className="w-full text-xs font-mono pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={isAuditing}
            className="inline-flex items-center justify-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
            <span>{isAuditing ? 'Auditing DOM...' : 'Run Live Safe Audit'}</span>
          </button>
        </form>

        {/* Sample Quick Links */}
        <div className="mt-3 flex items-center space-x-2 text-[11px] text-slate-500">
          <span className="font-semibold">Test with active samples:</span>
          {[
            'https://lagosforwarding.com.ng',
            'https://apexhaulage.ng',
            'https://nigeriarealties.com',
            'https://ikejamedical.ng'
          ].map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => setUrlInput(sample)}
              className="font-mono text-indigo-600 hover:underline"
            >
              {sample.replace('https://', '')}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Audit Output */}
      {auditResult && (
        <div className="space-y-6">
          {/* Top Score Matrix */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Health Score</span>
              <span className="text-3xl font-black text-slate-900 mt-1 block">
                {auditResult.deterministicHealthScore}/100
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Deterministic signal composite</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Mobile Optimization</span>
              <span className={`text-xl font-bold mt-1 block ${auditResult.hasViewport ? 'text-emerald-600' : 'text-rose-600'}`}>
                {auditResult.hasViewport ? 'Configured' : 'Missing Viewport!'}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                {auditResult.hasViewport ? 'Scales to screen' : 'Forces 980px desktop view'}
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Latency / Speed</span>
              <span className="text-3xl font-black text-slate-900 mt-1 block">
                {auditResult.responseTimeMs}ms
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Direct network round-trip</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Detected CTAs</span>
              <span className="text-3xl font-black text-slate-900 mt-1 block">
                {auditResult.ctaCount}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Direct conversion triggers</span>
            </div>
          </div>

          {/* Technical Diagnostics Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: SEO & Structural DOM signals */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                DOM & Search Accessibility
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 block font-medium">Page Title ({auditResult.pageTitle?.length || 0} chars)</span>
                  <p className="font-mono text-slate-900 bg-slate-50 p-2 rounded border border-slate-200 mt-0.5">
                    {auditResult.pageTitle || '<title> tag missing'}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500 block font-medium">Meta Description ({auditResult.metaDescription?.length || 0} chars)</span>
                  <p className="font-mono text-slate-900 bg-slate-50 p-2 rounded border border-slate-200 mt-0.5">
                    {auditResult.metaDescription || 'No meta description configured'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-500 font-semibold block">H1 Headings</span>
                    <span className="text-lg font-bold text-slate-800">{auditResult.h1Count}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{auditResult.h1Count === 1 ? 'Optimal (1 H1)' : 'Suboptimal hierarchy'}</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-500 font-semibold block">H2 Subheadings</span>
                    <span className="text-lg font-bold text-slate-800">{auditResult.h2Count}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Section markers</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Security, Social & Tech Stack */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Security & Tech Stack Signatures
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-medium text-slate-700">SSL Certificate / HTTPS</span>
                  <span className={`font-semibold ${auditResult.isHttps ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {auditResult.isHttps ? 'Encrypted (HTTPS)' : 'Insecure (HTTP)'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="font-medium text-slate-700">OpenGraph Social Preview Tags</span>
                  <span className={`font-semibold ${auditResult.hasOpenGraph ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {auditResult.hasOpenGraph ? 'Present (og:title, og:image)' : 'Missing Social Cards'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block font-medium mb-1.5">Detected Technologies</span>
                  <div className="flex flex-wrap gap-1.5">
                    {auditResult.detectedTech.length > 0 ? (
                      auditResult.detectedTech.map(t => (
                        <span key={t} className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-800 font-mono text-[11px]">
                          {t}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 italic">No generic CMS signatures detected (Static or Custom)</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block font-medium mb-1.5">Detected Action CTAs</span>
                  <div className="flex flex-wrap gap-1.5">
                    {auditResult.detectedCtas.length > 0 ? (
                      auditResult.detectedCtas.map((c, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100 text-indigo-800 font-medium text-[10px]">
                          "{c}"
                        </span>
                      ))
                    ) : (
                      <span className="text-rose-600 font-medium text-[11px]">Zero call-to-action buttons found on landing view</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
