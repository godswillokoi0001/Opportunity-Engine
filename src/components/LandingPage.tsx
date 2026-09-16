import React from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Search, 
  Cpu, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  TrendingUp,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { ServiceType } from '../types.js';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onExploreDemo,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Category Tag */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold mb-6">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Verifiable B2B Opportunity Intelligence</span>
          </div>

          {/* Primary Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-950 max-w-4xl mx-auto leading-[1.12]">
            Find businesses that have a <span className="text-indigo-600 underline decoration-indigo-200 decoration-4 underline-offset-8">reason to buy</span> what you sell.
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Tell us what you sell and who you target. The engine crawls public signals, executes deterministic digital audits, and explains exactly why each business needs your services before you reach out.
          </p>

          {/* CTAs */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-6 py-3.5 rounded-lg shadow-sm transition-all hover:shadow"
            >
              <span>Launch a Discovery Campaign</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExploreDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm px-6 py-3.5 rounded-lg border border-slate-300 transition-colors"
            >
              <span>Explore Live Lagos Sample Report</span>
            </button>
          </div>

          {/* Realistic Value Comparison Teaser */}
          <div className="mt-14 max-w-4xl mx-auto text-left bg-slate-900 rounded-xl border border-slate-800 p-5 sm:p-6 text-slate-100 shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">Live Engine Qualification Sample</span>
                <h3 className="text-lg font-bold text-white mt-0.5">Target: Website Redesign for Lagos Logistics Enterprise</h3>
              </div>
              <div className="mt-2 md:mt-0 flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-medium">Verified Active Company</span>
                <span className="px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800 text-xs font-medium">92% Qualification Score</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-800/60 p-3.5 rounded-lg border border-slate-700/60">
                <p className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  1. Observed Fact (Code)
                </p>
                <p className="text-slate-400 leading-relaxed">
                  Missing viewport meta tag; page renders in desktop fallback; 0 quote CTAs; contact path is 3 clicks deep.
                </p>
              </div>

              <div className="bg-slate-800/60 p-3.5 rounded-lg border border-slate-700/60">
                <p className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  2. Inferred Impact
                </p>
                <p className="text-slate-400 leading-relaxed">
                  Mobile freight managers browsing from smartphones bounce immediately due to unreadable layout and friction.
                </p>
              </div>

              <div className="bg-slate-800/60 p-3.5 rounded-lg border border-slate-700/60">
                <p className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  3. Strategic Pitch Angle
                </p>
                <p className="text-slate-400 leading-relaxed">
                  "Streamline your mobile freight quote flow to capture the 65% of regional logistics inquiries originating on smartphones."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Realistic Workflow Section */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
              The 4-Step Opportunity Qualification Engine
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600">
              Stop blasting blind generic cold emails to unverified lists. Every step produces transparent, verifiable evidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs relative">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-sm mb-4 border border-indigo-100">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Define What You Sell</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Specify your commercial craft (e.g. Website Redesign, SEO, CRO, Branding) and geographic/industry targeting.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs relative">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-sm mb-4 border border-indigo-100">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Discover Legitimate Data</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Swappable provider abstraction queries open geodata, verified commercial registries, and directories without scraping private data.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs relative">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-sm mb-4 border border-indigo-100">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Deterministic Audit</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                SSRF-safe crawler audits HTML source for viewport responsiveness, CTAs, contact forms, headings, and tech stack signatures.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs relative">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-sm mb-4 border border-indigo-100">
                04
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Explainable Outreach</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                AI synthesizes structured evidence into compelling, personalized business conversations referencing actual findings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Differentiation Callout */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              What Sets Opportunity Engine Apart From Directories & Scrapers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
              <div className="flex items-start space-x-3">
                <span className="text-rose-500 font-bold">✕</span>
                <span><strong>Not a Google Maps dump:</strong> No useless spreadsheets with 5,000 businesses that have no verified buying reason.</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Explainable Qualification:</strong> Tri-layer framework separating Observed facts, Inferred deductions, and Strategic rationale.</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-rose-500 font-bold">✕</span>
                <span><strong>Not generic AI spam:</strong> No fabricated generic "Hope you're having a wonderful week" template blasts.</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Deterministic Auditing First:</strong> Code measures performance, mobile viewports, and conversion pathways before AI reasoning.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Ready to find clients who actually need your services?
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Build your first campaign in 60 seconds with verified commercial data and transparent intelligence.
          </p>
          <div className="mt-7">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-6 py-3 rounded-lg shadow-sm transition-colors"
            >
              <span>Launch Dashboard & Start Campaign</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
