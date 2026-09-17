import React, { useState } from 'react';
import {
  Globe,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Zap,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Gauge,
  MousePointerClick,
  Code2,
} from 'lucide-react';
import { WebsiteAudit } from '../types.js';

interface LiveAuditorViewProps {
  onAuditUrl: (url: string) => Promise<WebsiteAudit & { url: string; rawHtmlSnippet?: string }>;
}

export const LiveAuditorView: React.FC<LiveAuditorViewProps> = ({ onAuditUrl }) => {
  const [url, setUrl] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [result, setResult] = useState<(WebsiteAudit & { url: string; rawHtmlSnippet?: string }) | null>(null);
  const [error, setError] = useState('');

  const SAMPLE_URLS = [
    'https://apexhaulage-lagos.org',
    'https://eko-properties.ng',
    'https://github.com',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setError('');
    setResult(null);
    setIsAuditing(true);
    try {
      const auditUrl = url.startsWith('http') ? url.trim() : `https://${url.trim()}`;
      const data = await onAuditUrl(auditUrl);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Audit failed — check the URL and try again.');
    } finally {
      setIsAuditing(false);
    }
  };

  const handleSampleClick = (sampleUrl: string) => {
    setUrl(sampleUrl);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">

      {/* Header */}
      <div className="card p-6 sm:p-8 space-y-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">
            <Globe className="w-3.5 h-3.5" />
            <span>Deterministic DOM Crawler</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Live Website Technical Auditor
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-1 max-w-2xl leading-relaxed">
            Inspect any public website in real time. The engine executes a server-side sandboxed crawl to verify mobile responsiveness, page speed, CTA conversion hooks, and meta structure.
          </p>
        </div>

        {/* URL Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Globe className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="field-input pl-10 text-sm font-mono"
              autoComplete="url"
              disabled={isAuditing}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isAuditing || !url.trim()}
            className="btn-primary text-sm px-6 py-3 cursor-pointer justify-center"
          >
            {isAuditing ? (
              <>
                <Search className="w-4 h-4 animate-spin" />
                <span>Crawling Website...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Run Technical Audit</span>
              </>
            )}
          </button>
        </form>

        {/* Sample URL Chips */}
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] pt-1 flex-wrap">
          <span>Try quick sample:</span>
          {SAMPLE_URLS.map((sUrl) => (
            <button
              key={sUrl}
              type="button"
              onClick={() => handleSampleClick(sUrl)}
              className="text-amber-600 dark:text-amber-400 hover:underline cursor-pointer bg-[var(--surface-2)] px-2.5 py-1 rounded-md"
            >
              {sUrl.replace('https://', '')}
            </button>
          ))}
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="card p-4 border-rose-200 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 text-sm flex items-center gap-3">
          <XCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="space-y-6">

          {/* Overall Health Score Card */}
          <div className="card p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Audit Target
                </span>
                <h3 className="text-lg font-bold text-[var(--text-primary)] font-mono truncate max-w-lg">
                  {result.url}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                    {result.deterministicHealthScore}/100
                  </div>
                  <div className="text-xs text-[var(--text-muted)] font-medium">Digital Health Score</div>
                </div>
              </div>
            </div>

            {/* 4 Core Signals Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
              
              <div className="card-inner p-4 text-center">
                <Smartphone className="w-5 h-5 mx-auto mb-2 text-amber-600 dark:text-amber-400" />
                <span className="text-xs text-[var(--text-muted)] block mb-1">Mobile Viewport</span>
                <span className={`text-sm font-bold ${result.hasViewport ? 'text-teal-600' : 'text-rose-500'}`}>
                  {result.hasViewport ? '✓ Responsive' : '✕ Missing Viewport'}
                </span>
              </div>

              <div className="card-inner p-4 text-center">
                <ShieldCheck className="w-5 h-5 mx-auto mb-2 text-teal-600 dark:text-teal-400" />
                <span className="text-xs text-[var(--text-muted)] block mb-1">SSL Protocol</span>
                <span className={`text-sm font-bold ${result.isHttps ? 'text-teal-600' : 'text-rose-500'}`}>
                  {result.isHttps ? '✓ HTTPS Secure' : '✕ Insecure HTTP'}
                </span>
              </div>

              <div className="card-inner p-4 text-center">
                <Gauge className="w-5 h-5 mx-auto mb-2 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs text-[var(--text-muted)] block mb-1">Response Time</span>
                <span className="text-sm font-bold text-[var(--text-primary)]">
                  {result.responseTimeMs} ms
                </span>
              </div>

              <div className="card-inner p-4 text-center">
                <MousePointerClick className="w-5 h-5 mx-auto mb-2 text-teal-600 dark:text-teal-400" />
                <span className="text-xs text-[var(--text-muted)] block mb-1">Action Triggers</span>
                <span className="text-sm font-bold text-[var(--text-primary)]">
                  {result.ctaCount} buttons detected
                </span>
              </div>

            </div>
          </div>

          {/* Granular Inspection Findings */}
          <div className="card p-6 space-y-4">
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Granular Technical Checklist
            </h3>

            <div className="divide-y divide-[var(--border-subtle)] text-sm">
              {[
                { label: 'Page Title', value: result.pageTitle || '(Missing <title> tag)', pass: Boolean(result.pageTitle) },
                { label: 'Meta Description', value: result.metaDescription || '(None found)', pass: Boolean(result.metaDescription) },
                { label: 'Heading Structure', value: `${result.h1Count} H1 tags, ${result.h2Count} H2 tags`, pass: result.h1Count === 1 },
                { label: 'Dedicated Contact Page', value: result.hasContactPage ? 'Detected' : 'Not detected', pass: result.hasContactPage },
                { label: 'Click-to-Call Link (tel:)', value: result.hasPhoneLink ? 'Present' : 'Missing', pass: result.hasPhoneLink },
                { label: 'Broken Links on Page', value: `${result.brokenLinksFound} broken links`, pass: result.brokenLinksFound === 0 },
                { label: 'Detected Tech Frameworks', value: result.detectedTech.length > 0 ? result.detectedTech.join(', ') : 'Custom / Not fingerprinted', pass: true },
                { label: 'Call-to-Action Copy', value: result.detectedCtas.length > 0 ? `"${result.detectedCtas.join('", "')}"` : 'None detected', pass: result.detectedCtas.length > 0 },
              ].map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <span className="font-medium text-[var(--text-secondary)]">{item.label}</span>
                  <span className={`font-semibold text-right max-w-sm truncate ${
                    item.pass ? 'text-teal-600 dark:text-teal-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* HTML Source Snapshot */}
          {result.rawHtmlSnippet && (
            <div className="card p-6 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                <Code2 className="w-4 h-4" />
                <span>Captured DOM Snapshot (First 600 characters)</span>
              </div>
              <pre className="p-4 rounded-xl bg-[var(--surface-2)] text-[var(--text-secondary)] font-mono text-xs overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
                {result.rawHtmlSnippet}
              </pre>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
