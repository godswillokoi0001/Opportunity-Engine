import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onExploreDemo,
}) => {
  return (
    <div style={{ background: 'var(--ground)', color: 'var(--text-primary)', minHeight: '100vh' }}>

      {/* ─── Hero ──────────────────────────────────────────────────────── */}
      <section
        style={{
          borderBottom: '1px solid var(--border-subtle)',
          padding: '80px 24px 72px',
        }}
      >
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>

          {/* Category context — no tracked ALL-CAPS eyebrow, no middle dots */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '28px',
              padding: '4px 10px',
              background: 'var(--teal-surface)',
              border: '1px solid var(--teal-border)',
              borderRadius: '3px',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--teal-bright)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            <ShieldCheck style={{ width: '12px', height: '12px' }} />
            Verifiable B2B Opportunity Intelligence
          </div>

          {/* Primary headline — no single-word recoloring, no underline decoration.
              The headline is doing real work: it names the mechanism, not just the outcome. */}
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 500,
              lineHeight: 1.12,
              color: 'var(--text-primary)',
              margin: '0 0 20px',
              maxWidth: '680px',
            }}
          >
            Find the businesses whose digital presence is costing them customers.
          </h1>

          <p
            style={{
              fontSize: '16px',
              lineHeight: 1.65,
              color: 'var(--text-secondary)',
              maxWidth: '540px',
              margin: '0 0 36px',
            }}
          >
            You tell us what you sell and who to target. The engine inspects real business websites, measures the specific technical failures on each one, and hands you a verifiable case for why they should hire you — before you make contact.
          </p>

          {/* CTAs — no trailing arrows, plain labels that describe the action */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="btn-primary" onClick={onGetStarted}>
              Launch a discovery campaign
            </button>
            <button className="btn-secondary" onClick={onExploreDemo}>
              Browse live sample results
            </button>
          </div>
        </div>
      </section>

      {/* ─── Live Evidence Sample ───────────────────────────────────────── 
          This is the bold/memorable centrepiece — a real-looking dossier
          excerpt that proves the product works rather than describing it.
          Everything else on the page is quieter than this block.           */}
      <section
        style={{
          padding: '64px 24px',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--text-muted)',
              marginBottom: '24px',
              fontFamily: 'var(--font-sans)',
              letterSpacing: '0',
            }}
          >
            Sample qualification output — Lagos logistics sector
          </p>

          {/* Dossier excerpt */}
          <div
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border-moderate)',
              borderRadius: '6px',
              overflow: 'hidden',
            }}
          >
            {/* Dossier header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--text-muted)',
                    marginBottom: '4px',
                    fontWeight: 400,
                  }}
                >
                  RC-1049281 · Verified Active
                </p>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '18px',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}
                >
                  Apex Haulage & Intermodal Logistics
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className="signal-badge teal">Verified Active</span>
                <span className="signal-badge amber">92% Opportunity Score</span>
              </div>
            </div>

            {/* Three-column tri-layer evidence grid */}
            <div
              className="grid grid-cols-1 md:grid-cols-3"
              style={{ borderBottom: '1px solid var(--border-subtle)' }}
            >
              {/* Observed */}
              <div
                className="triad-observed"
                style={{
                  padding: '20px',
                  borderRight: '1px solid var(--border-subtle)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '10px',
                  }}
                >
                  <CheckCircle2 style={{ width: '13px', height: '13px', color: 'var(--text-muted)' }} />
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    Observed (code facts)
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  Missing <code style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-primary)', background: 'var(--surface-2)', padding: '1px 4px', borderRadius: '2px' }}>&lt;meta name="viewport"&gt;</code>. Renders at 980px desktop fallback on mobile. Zero CTA buttons. Contact buried 3 clicks deep.
                </p>
              </div>

              {/* Inferred */}
              <div
                className="triad-inferred"
                style={{
                  padding: '20px',
                  borderRight: '1px solid var(--border-subtle)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '10px',
                  }}
                >
                  <AlertTriangle style={{ width: '13px', height: '13px', color: 'var(--amber)' }} />
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--amber)',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    Inferred (client impact)
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  Mobile freight managers browsing from phones bounce immediately on the broken layout before reaching a quote form or phone number.
                </p>
              </div>

              {/* Strategic */}
              <div
                className="triad-strategic"
                style={{ padding: '20px' }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '10px',
                  }}
                >
                  <TrendingUp style={{ width: '13px', height: '13px', color: 'var(--teal-bright)' }} />
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--teal-bright)',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    Pitch rationale
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                  "65% of regional freight inquiries originate on mobile. A mobile-first redesign with a direct quote CTA captures bookings you're currently losing to better-optimised competitors."
                </p>
              </div>
            </div>

            {/* Footer action strip */}
            <div
              style={{
                padding: '12px 20px',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '8px',
              }}
            >
              <button className="btn-primary" onClick={onGetStarted} style={{ fontSize: '12px', padding: '7px 14px' }}>
                Launch your first campaign
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How it works ───────────────────────────────────────────────── 
          Sequential numbering is earned — these steps are genuinely ordered. */}
      <section style={{ padding: '64px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '24px',
              fontWeight: 500,
              color: 'var(--text-primary)',
              marginBottom: '8px',
            }}
          >
            How a campaign runs
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '460px', lineHeight: 1.6 }}>
            Each step hands verifiable output to the next. Nothing is assumed. No cold-spray lists.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                n: '1',
                title: 'Define your target',
                body: 'Tell the engine what you sell (website redesign, SEO, CRO, branding) and which industry and city to search.',
              },
              {
                n: '2',
                title: 'Discover real businesses',
                body: 'The engine queries open public commercial registers and licensed geodata — no scraping, no recycled lists.',
              },
              {
                n: '3',
                title: 'Audit each website',
                body: 'The safe, sandboxed crawler reads actual HTML: viewport tags, HTTPS, heading structure, CTAs, response speed.',
              },
              {
                n: '4',
                title: 'Get a qualifying case',
                body: 'You receive code-proven findings, their likely business impact, and a targeted pitch angle grounded in that evidence.',
              },
            ].map(step => (
              <div
                key={step.n}
                style={{
                  paddingTop: '20px',
                  borderTop: '2px solid var(--border-moderate)',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--amber)',
                    marginBottom: '12px',
                  }}
                >
                  {step.n}
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '16px',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    marginBottom: '8px',
                    lineHeight: 1.3,
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Differentiation ─────────────────────────────────────────────── */}
      <section style={{ padding: '64px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '24px',
              fontWeight: 500,
              color: 'var(--text-primary)',
              marginBottom: '32px',
            }}
          >
            Not a directory. Not a scraper.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-5">
            {[
              { pro: false, text: 'A Google Maps dump with 5,000 entries and no evidence any of them need your services.' },
              { pro: true, text: 'Every opportunity has code-measured technical failures attached — mobile breakage, missing CTAs, insecure connections, dead contact paths.' },
              { pro: false, text: 'Generic "Hope you\'re doing well" cold email templates that could apply to any business on earth.' },
              { pro: true, text: 'Pitch copy that references specific things the auditor found on that company\'s actual website.' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span
                  style={{
                    marginTop: '2px',
                    fontWeight: 700,
                    fontSize: '13px',
                    color: item.pro ? 'var(--teal-bright)' : 'var(--text-muted)',
                    flexShrink: 0,
                    width: '14px',
                  }}
                >
                  {item.pro ? '✓' : '✕'}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer CTA ──────────────────────────────────────────────────── */}
      <section
        style={{
          padding: '56px 24px',
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--surface-1)',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '28px',
              fontWeight: 500,
              color: 'var(--text-primary)',
              marginBottom: '12px',
            }}
          >
            Ready to find clients who need you?
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '28px', maxWidth: '420px', lineHeight: 1.6 }}>
            Your first campaign takes 60 seconds to configure. The engine handles the discovery, auditing, and qualification.
          </p>
          <button className="btn-primary" onClick={onGetStarted}>
            Launch dashboard
          </button>
        </div>
      </section>

    </div>
  );
};
