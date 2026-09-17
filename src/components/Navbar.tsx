import React, { useState } from 'react';
import {
  LayoutDashboard,
  Compass,
  Sparkles,
  Users,
  Globe,
  Sliders,
  Plus,
  Sun,
  Moon,
  TrendingUp,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { UserProfile } from '../types.js';

interface NavbarProps {
  currentView: 'landing' | 'dashboard' | 'campaigns' | 'discovery' | 'leads' | 'auditor' | 'settings';
  setCurrentView: (view: 'landing' | 'dashboard' | 'campaigns' | 'discovery' | 'leads' | 'auditor' | 'settings') => void;
  userProfile: UserProfile;
  onNewCampaign: () => void;
  activeCampaignName?: string;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  userProfile,
  onNewCampaign,
  activeCampaignName,
  theme,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'campaigns', label: 'Campaigns', icon: Compass },
    { id: 'discovery', label: 'Opportunities', icon: Sparkles },
    { id: 'leads', label: 'Pipeline', icon: Users },
    { id: 'auditor', label: 'Live Auditor', icon: Globe },
  ] as const;

  const initials = userProfile.name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('');

  const handleNavClick = (viewId: typeof navItems[number]['id']) => {
    setCurrentView(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header
      style={{
        background: 'var(--surface-1)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
      className="sticky top-0 z-40 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">

          {/* ── 1. Brand Logo ── */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setCurrentView('landing');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2.5 text-left group focus-visible:outline-none cursor-pointer"
            >
              <div
                style={{
                  background: 'var(--amber)',
                  color: '#ffffff',
                }}
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0"
              >
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span
                  style={{ color: 'var(--text-primary)' }}
                  className="font-bold text-base tracking-tight leading-tight whitespace-nowrap"
                >
                  Opportunity Engine
                </span>
                <span
                  style={{ color: 'var(--text-muted)' }}
                  className="text-[11px] leading-tight hidden sm:block whitespace-nowrap"
                >
                  Commercial Intelligence
                </span>
              </div>
            </button>

            {/* Active campaign chip: only on very wide screens so it NEVER causes overflow */}
            {activeCampaignName && currentView !== 'landing' && (
              <div
                style={{
                  background: 'var(--surface-2)',
                  borderColor: 'var(--border-subtle)',
                }}
                className="hidden 2xl:flex items-center gap-2 px-3 py-1 rounded-full border text-xs ml-2"
              >
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse shrink-0" />
                <span style={{ color: 'var(--text-muted)' }}>Campaign:</span>
                <span
                  style={{ color: 'var(--text-primary)' }}
                  className="font-semibold max-w-[130px] truncate"
                >
                  {activeCampaignName}
                </span>
              </div>
            )}
          </div>

          {/* ── 2. Desktop Navigation Bar (Responsive Breaths) ── */}
          <nav className="hidden lg:flex items-center gap-1 shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60'
                      : 'hover:bg-[var(--surface-2)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-700 dark:text-amber-400' : 'text-[var(--text-muted)]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Tablet Icon-Only Nav (Between md and lg: prevents collision) */}
          <nav className="hidden md:flex lg:hidden items-center gap-1 shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  title={item.label}
                  className={`p-2 rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300'
                      : 'hover:bg-[var(--surface-2)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-700 dark:text-amber-400' : 'text-[var(--text-muted)]'}`} />
                </button>
              );
            })}
          </nav>

          {/* ── 3. Right Rail: Theme Toggle, New Campaign, Profile, Mobile Menu Button ── */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={onToggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle theme"
              className="w-9 h-9 rounded-lg flex items-center justify-center border transition-all cursor-pointer hover:bg-[var(--surface-2)] shrink-0"
              style={{
                borderColor: 'var(--border-moderate)',
                color: 'var(--text-secondary)',
              }}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* New Campaign Button */}
            <button
              onClick={onNewCampaign}
              className="btn-primary text-xs sm:text-sm px-3 sm:px-4 py-2 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Campaign</span>
              <span className="sm:hidden">New</span>
            </button>

            {/* Profile Avatar Button */}
            <button
              onClick={() => {
                setCurrentView('settings');
                setMobileMenuOpen(false);
              }}
              title={`Agency Settings (${userProfile.name})`}
              className="hidden sm:flex items-center gap-2 p-1 rounded-lg transition-colors hover:bg-[var(--surface-2)] cursor-pointer shrink-0"
            >
              <div
                style={{
                  background: 'var(--surface-2)',
                  borderColor: 'var(--border-moderate)',
                  color: 'var(--text-primary)',
                }}
                className="w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs shrink-0"
              >
                {initials}
              </div>
            </button>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Open mobile menu"
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center border transition-colors cursor-pointer hover:bg-[var(--surface-2)] shrink-0"
              style={{
                borderColor: 'var(--border-moderate)',
                color: 'var(--text-secondary)',
              }}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

          </div>

        </div>
      </div>

      {/* ── 4. Mobile Dropdown Menu (Clean, Non-Floating Drawer) ── */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'var(--surface-1)',
            borderTop: '1px solid var(--border-subtle)',
          }}
          className="md:hidden border-b shadow-lg transition-all"
        >
          <div className="px-4 py-3 space-y-1">
            
            {/* Active campaign indicator if present */}
            {activeCampaignName && currentView !== 'landing' && (
              <div className="px-3 py-2 rounded-lg bg-[var(--surface-2)] text-xs flex items-center justify-between mb-2">
                <span className="text-[var(--text-muted)]">Active Campaign:</span>
                <span className="font-semibold text-[var(--text-primary)] truncate max-w-[180px]">
                  {activeCampaignName}
                </span>
              </div>
            )}

            {/* Navigation links */}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-700 dark:text-amber-400' : 'text-[var(--text-muted)]'}`} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--text-muted)] opacity-60" />
                </button>
              );
            })}

            <div className="pt-2 border-t border-[var(--border-subtle)] mt-2">
              <button
                onClick={() => {
                  setCurrentView('settings');
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  currentView === 'settings'
                    ? 'bg-amber-50 text-amber-900 font-bold dark:bg-amber-950/40 dark:text-amber-300'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sliders className="w-4 h-4 text-[var(--text-muted)]" />
                  <span>Agency Settings & Profile</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                  <span>{userProfile.agencyName}</span>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </div>
              </button>
            </div>

          </div>
        </div>
      )}

    </header>
  );
};
