import React from 'react';
import {
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  Send,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onExploreDemo,
}) => {
  return (
    <div className="min-h-screen">

      {/* ─── Hero Section ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-[var(--border-subtle)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          {/* Announcement Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-8 bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>Smart B2B Lead Intelligence for Digital Agencies</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text-primary)] mb-6 leading-tight">
            Find local businesses with broken websites — and{' '}
            <span className="text-amber-700 dark:text-amber-400 underline decoration-amber-300 dark:decoration-amber-700 underline-offset-4">
              win them with proof
            </span>
            .
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto mb-10 leading-relaxed">
            Stop sending generic cold emails that get marked as spam. Opportunity Engine scans verified businesses in your target city, finds their exact technical flaws (mobile layout bugs, missing contact buttons, slow load times), and writes tailored pitches that actually close clients.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={onGetStarted}
              className="btn-primary w-full sm:w-auto text-base px-8 py-3.5 shadow-md hover:shadow-lg"
            >
              <Zap className="w-5 h-5" />
              <span>Launch a Discovery Campaign</span>
            </button>
            <button
              onClick={onExploreDemo}
              className="btn-secondary w-full sm:w-auto text-base px-7 py-3.5"
            >
              <Search className="w-4 h-4" />
              <span>Browse Sample Leads</span>
            </button>
          </div>

          {/* Trust Value Points */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-[var(--text-muted)] pt-4 border-t border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-700 dark:text-teal-400" />
              <span>Verified Public Business Registers</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span>Automated HTML & Mobile Audits</span>
            </div>
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>AI Evidence-Backed Email Drafts</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Live Evidence Showcase (The "Aha!" Moment) ───────────────────── */}
      <section className="py-16 sm:py-20 bg-[var(--surface-1)] border-b border-[var(--border-subtle)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-3">
              How a Qualified Lead Looks in Your Dashboard
            </h2>
            <p className="text-base text-[var(--text-secondary)]">
              Instead of a meaningless list of phone numbers, every lead comes with a concrete business case ready to present.
            </p>
          </div>

          {/* Interactive Dossier Card */}
          <div className="card overflow-hidden shadow-md border-[var(--border-moderate)]">
            
            {/* Lead Header */}
            <div className="p-6 sm:p-8 bg-[var(--surface-2)] border-b border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="badge badge-teal">Verified Registry Active</span>
                  <span className="text-xs text-[var(--text-muted)] font-mono">RC-1049281 · Lagos Port Corridor</span>
                </div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                  Apex Haulage & Intermodal Logistics
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  Freight forwarding and intermodal cargo · 45 employees · 14 Commercial Ave, Apapa
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-3xl font-bold text-amber-700 dark:text-amber-400">92%</div>
                  <div className="text-xs text-[var(--text-muted)] font-medium">Opportunity Match</div>
                </div>
                <button
                  onClick={onExploreDemo}
                  className="btn-primary ml-2"
                >
                  <span>View in Engine</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* The 3-Layer Proof Framework */}
            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border-subtle)]">
              
              {/* Box 1: Observed Facts */}
              <div className="p-6 sm:p-7 bg-[var(--surface-1)]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                      1. Observed Facts
                    </span>
                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                      What the Code Shows
                    </span>
                  </div>
                </div>
                <ul className="space-y-2.5 text-sm text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Missing <code className="text-xs bg-[var(--surface-2)] px-1.5 py-0.5 rounded font-mono">&lt;meta viewport&gt;</code> (breaks on phones)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Zero quote CTA buttons on homepage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>Contact form buried 3 menu levels deep</span>
                  </li>
                </ul>
              </div>

              {/* Box 2: Inferred Impact */}
              <div className="p-6 sm:p-7 bg-[var(--surface-1)]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-700 dark:text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                      2. Client Friction
                    </span>
                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                      Why It Costs Them Revenue
                    </span>
                  </div>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  Logistics dispatchers and cargo clients browsing from their mobile phones bounce within 5 seconds because the desktop layout is unreadable. They call a competitor instead of waiting for the form to load.
                </p>
              </div>

              {/* Box 3: Strategic Outreach */}
              <div className="p-6 sm:p-7 bg-[var(--surface-1)]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center text-teal-700 dark:text-teal-400">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block">
                      3. Generated Pitch
                    </span>
                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                      The Exact Email to Send
                    </span>
                  </div>
                </div>
                <div className="text-xs italic text-[var(--text-secondary)] p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--border-subtle)] leading-relaxed">
                  "Hi Operations Team at Apex, noticed 65% of Nigerian logistics searches originate on mobile, but your site currently displays at desktop resolution with no mobile quote button. We helped similar cargo firms capture 40% more quotes with a rapid mobile upgrade..."
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ─── 3 Simple Steps Section ─────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-3">
              How It Works in 3 Simple Steps
            </h2>
            <p className="text-base text-[var(--text-secondary)]">
              No manual Googling. No messy spreadsheets. A streamlined pipeline from search to signed contract.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="card p-7 text-left">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 flex items-center justify-center font-bold text-lg mb-5">
                1
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                Set Location & Service
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Choose your target market (e.g. Lagos, London, or Austin) and what you offer: Web Redesign, SEO, CRO, or Branding.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card p-7 text-left">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400 flex items-center justify-center font-bold text-lg mb-5">
                2
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                Instant Technical Audit
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                The engine inspects real business websites for mobile responsiveness, HTTPS security, speed, and conversion friction.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card p-7 text-left">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 flex items-center justify-center font-bold text-lg mb-5">
                3
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                Send Evidence-Backed Pitch
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Generate personalized outreach that references the client's exact digital flaws, making your agency an obvious partner.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Comparison Section: Why It Works ────────────────────────────── */}
      <section className="py-16 bg-[var(--surface-1)] border-t border-[var(--border-subtle)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-3">
              Why Agencies Close Deals with Opportunity Engine
            </h2>
            <p className="text-base text-[var(--text-secondary)]">
              The difference between being ignored and starting a high-value conversation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* The Old Way */}
            <div className="card p-6 bg-rose-50/40 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/50">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold mb-3 text-sm">
                <span>✕ The Generic Way (Ignored)</span>
              </div>
              <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>Scraped spreadsheet of 5,000 businesses with no context</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>"Hi, we make great websites! Let's chat!"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>0.5% reply rate, high unsubscribe & spam complaints</span>
                </li>
              </ul>
            </div>

            {/* Opportunity Engine Way */}
            <div className="card p-6 bg-teal-50/40 border-teal-200 dark:bg-teal-950/20 dark:border-teal-900/50">
              <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold mb-3 text-sm">
                <span>✓ The Opportunity Engine Way (Replies)</span>
              </div>
              <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>Targeted commercial register with verifiable weaknesses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>"We noticed your mobile checkout button is unclickable on iOS"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">•</span>
                  <span>Immediate consultative credibility and high response rates</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Bottom CTA Banner ──────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 border-t border-[var(--border-subtle)] bg-[var(--surface-2)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
            Ready to find clients who genuinely need your work?
          </h2>
          <p className="text-base text-[var(--text-secondary)] max-w-xl mx-auto mb-8">
            Create your first targeted campaign in 60 seconds and start pitching with undeniable evidence.
          </p>
          <button
            onClick={onGetStarted}
            className="btn-primary text-base px-8 py-3.5 shadow-md hover:shadow-lg"
          >
            <Zap className="w-5 h-5" />
            <span>Open Dashboard Now</span>
          </button>
        </div>
      </section>

    </div>
  );
};
