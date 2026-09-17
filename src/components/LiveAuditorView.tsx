import React, { useState } from 'react';
import { Globe, Search, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { WebsiteAudit } from '../types.js';

interface LiveAuditorViewProps {
  onAuditUrl: (url: string) => Promise<WebsiteAudit & { url: string; rawHtmlSnippet?: string }>;
}

export const LiveAuditorView: React.FC<LiveAuditorViewProps> = ({ onAuditUrl }) => {
  const [url, setUrl] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [result, setResult] = useState<(WebsiteAudit & { url: string; rawHtmlSnippet?: string }) | null>(null);
  const [error, setError] = useState('');


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

  const scoreColor = (score: number) =>
    score >= 70 ? 'var(--teal-bright)' : score >= 40 ? 'var(--amber-bright)' : 'var(--rose-bright)';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div style={{ paddingBottom: '20px', borderBottom: '1px solid var(--border-subtle)' }}>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '22px',
            fontWeight: 500,
            color: 'var(--text-primary)',
            marginBottom: '6px',
          }}
        >
          Live website auditor
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '480px', lineHeight: 1.6 }}>
          Paste any publicly accessible URL. The engine reads the actual HTML markup to measure technical quality — no browser simulation, no guessing.
        </p>
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: '1 1 320px', position: 'relative' }}>
          <Globe
            style={{
              width: '13px',
              height: '13px',
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="field-input"
            style={{ paddingLeft: '32px', fontSize: '14px', fontFamily: 'var(--font-mono)' }}
            autoComplete="url"
            disabled={isAuditing}
          />
        </div>
        <button
          type="submit"
          className="btn-primary"
          disabled={isAuditing || !url.trim()}
        >
          {isAuditing ? (
            <>
              <Search style={{ width: '12px', height: '12px', animation: 'spin 1s linear infinite' }} />
              Auditing…
            </>
          ) : (
            <>
              <Search style={{ width: '12px', height: '12px' }} />
              Run audit
            </>
          )}
        </button>
      </form>

      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            background: 'var(--rose-surface)',
            border: '1px solid var(--rose-border)',
            borderRadius: '4px',
            fontSize: '13px',
            color: 'var(--rose-bright)',
          }}
        >
          <XCircle style={{ width: '14px', height: '14px', flexShrink: 0 }} />
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-5">
          {/* Score strip */}
          <div className="panel" style={{ overflow: 'hidden' }}>
            <div
              style={{
                padding: '14px 20px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
                background: 'var(--surface-2)',
              }}
            >
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                  {result.url}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Health:</span>
                <span
                  className="tabular-nums"
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '22px',
                    fontWeight: 500,
                    color: scoreColor(result.deterministicHealthScore),
                    lineHeight: 1,
                  }}
                >
                  {result.deterministicHealthScore}
                </span>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>/100</span>
              </div>
            </div>

            {/* 4-metric banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4">
              {[
                {
                  label: 'Mobile viewport',
                  value: result.hasViewport ? 'Present' : 'Missing',
                  mono: false,
                  pass: result.hasViewport,
                },
                {
                  label: 'HTTPS',
                  value: result.isHttps ? 'Secure' : 'Insecure',
                  mono: false,
                  pass: result.isHttps,
                },
                {
                  label: 'Response time',
                  value: `${result.responseTimeMs}ms`,
                  mono: true,
                  pass: result.responseTimeMs < 2000,
                },
                {
                  label: 'CTA buttons',
                  value: String(result.ctaCount),
                  mono: true,
                  pass: result.ctaCount > 0,
                },
              ].map((m, i) => {
                const Icon = m.pass ? CheckCircle2 : AlertTriangle;
                return (
                  <div
                    key={i}
                    style={{
                      padding: '16px 18px',
                      borderRight: i < 3 ? '1px solid var(--border-subtle)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px' }}>
                      <Icon style={{ width: '11px', height: '11px', color: m.pass ? 'var(--teal)' : 'var(--amber)' }} />
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>{m.label}</span>
                    </div>
                    <p
                      className="tabular-nums"
                      style={{
                        fontFamily: m.mono ? 'var(--font-mono)' : 'var(--font-sans)',
                        fontSize: '16px',
                        fontWeight: 600,
                        color: m.pass ? 'var(--teal-bright)' : 'var(--amber-bright)',
                        lineHeight: 1,
                      }}
                    >
                      {m.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed findings ledger */}
          <div className="panel" style={{ overflow: 'hidden' }}>
            <p style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--surface-2)' }}>
              Technical findings
            </p>
            {[
              { label: 'Page title', value: result.pageTitle || '(missing)', mono: true, pass: Boolean(result.pageTitle) },
              { label: 'Meta description', value: result.metaDescription || '(none found)', mono: true, pass: Boolean(result.metaDescription) },
              { label: 'H1 tags', value: `${result.h1Count} found`, mono: false, pass: result.h1Count === 1 },
              { label: 'H2 tags', value: `${result.h2Count} found`, mono: false, pass: result.h2Count > 0 },
              { label: 'Contact page', value: result.hasContactPage ? 'Detected' : 'Not found', mono: false, pass: result.hasContactPage },
              { label: 'Phone link (tel:)', value: result.hasPhoneLink ? 'Present' : 'None', mono: false, pass: result.hasPhoneLink },
              { label: 'OpenGraph tags', value: result.hasOpenGraph ? 'Present' : 'Missing', mono: false, pass: result.hasOpenGraph },
              { label: 'Broken links', value: `${result.brokenLinksFound} found`, mono: false, pass: result.brokenLinksFound === 0 },
              {
                label: 'Technologies detected',
                value: result.detectedTech.length > 0 ? result.detectedTech.join(', ') : 'No fingerprints matched',
                mono: true,
                pass: true,
              },
              {
                label: 'CTA copy found',
                value: result.detectedCtas.length > 0 ? `"${result.detectedCtas.join('", "')}"` : 'None detected',
                mono: true,
                pass: result.detectedCtas.length > 0,
              },
            ].map((row, i) => {
              const Icon = row.pass ? CheckCircle2 : AlertTriangle;
              return (
                <div
                  key={i}
                  className="ledger-row"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 16px', gap: '16px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon style={{ width: '12px', height: '12px', color: row.pass ? 'var(--teal)' : 'var(--amber)', flexShrink: 0 }} />
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>{row.label}</span>
                  </div>
                  <span
                    style={{
                      fontSize: '12px',
                      color: row.pass ? 'var(--text-primary)' : 'var(--amber-bright)',
                      fontFamily: row.mono ? 'var(--font-mono)' : 'var(--font-sans)',
                      textAlign: 'right',
                      maxWidth: '380px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {row.value}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Raw HTML source snapshot */}
          {result.rawHtmlSnippet && (
            <div className="panel" style={{ overflow: 'hidden' }}>
              <p style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--surface-2)' }}>
                Source snapshot (first 600 chars)
              </p>
              <pre
                style={{
                  margin: 0,
                  padding: '16px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                  overflowX: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                }}
              >
                {result.rawHtmlSnippet}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
