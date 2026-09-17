import React from 'react';
import {
  Layers,
  Compass,
  Sparkles,
  Users,
  Globe,
  Sliders,
  Plus,
} from 'lucide-react';
import { UserProfile } from '../types.js';

interface NavbarProps {
  currentView: 'landing' | 'dashboard' | 'campaigns' | 'discovery' | 'leads' | 'auditor' | 'settings';
  setCurrentView: (view: 'landing' | 'dashboard' | 'campaigns' | 'discovery' | 'leads' | 'auditor' | 'settings') => void;
  userProfile: UserProfile;
  onNewCampaign: () => void;
  activeCampaignName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  userProfile,
  onNewCampaign,
  activeCampaignName,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layers },
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

  return (
    <header
      style={{
        background: 'var(--surface-1)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
      className="sticky top-0 z-30"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">

          {/* Wordmark */}
          <button
            onClick={() => setCurrentView('landing')}
            className="flex items-center gap-2.5 focus-visible:outline-none group"
            style={{ textDecoration: 'none' }}
          >
            {/* Monogram glyph — amber on ground, not a rounded SaaS logo */}
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 500,
                color: 'var(--amber)',
                background: 'var(--amber-surface)',
                border: '1px solid var(--amber-border)',
                borderRadius: '3px',
                padding: '4px 7px',
                letterSpacing: '0.04em',
              }}
            >
              OE
            </span>
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '15px',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  display: 'block',
                  lineHeight: 1.2,
                }}
              >
                Opportunity Engine
              </span>
            </div>
          </button>

          {/* Active campaign context — no middle dots, no chevron decoration */}
          {activeCampaignName && currentView !== 'landing' && (
            <div
              className="hidden lg:flex items-center gap-2"
              style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                paddingLeft: '12px',
                borderLeft: '1px solid var(--border-subtle)',
                marginLeft: '12px',
              }}
            >
              <span style={{ color: 'var(--text-muted)' }}>Active:</span>
              <span
                style={{
                  color: 'var(--text-secondary)',
                  fontWeight: 500,
                  maxWidth: '200px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {activeCampaignName}
              </span>
              {/* Live pulse — the only decorative element, and it encodes real state */}
              <span
                style={{
                  display: 'inline-block',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--teal)',
                }}
              />
            </div>
          )}

          {/* Center nav */}
          <nav className="hidden md:flex items-center gap-0.5" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className="flex items-center gap-1.5"
                  style={{
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    background: isActive ? 'var(--surface-2)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'color 120ms ease, background-color 120ms ease',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                      (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }
                  }}
                >
                  <Icon
                    style={{
                      width: '14px',
                      height: '14px',
                      color: isActive ? 'var(--amber)' : 'var(--text-muted)',
                    }}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right rail */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onNewCampaign}
              className="btn-primary"
              style={{ fontSize: '12px', padding: '7px 14px' }}
            >
              <Plus style={{ width: '12px', height: '12px' }} />
              New Campaign
            </button>

            <div
              style={{
                width: '1px',
                height: '20px',
                background: 'var(--border-subtle)',
              }}
              className="hidden sm:block"
            />

            {/* User identity — no avatar rings, no rounded-full SaaS template */}
            <button
              onClick={() => setCurrentView('settings')}
              className="flex items-center gap-2 btn-ghost"
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '3px',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-moderate)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  flexShrink: 0,
                }}
              >
                {initials}
              </span>
              <div className="hidden xl:block text-left">
                <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                  {userProfile.name}
                </p>
                <p
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    lineHeight: 1.2,
                    maxWidth: '120px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {userProfile.agencyName}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav — icons with labels */}
      <div
        className="md:hidden flex items-center justify-around overflow-x-auto px-2 py-1.5"
        style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--ground)' }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className="flex flex-col items-center py-1 px-2"
              style={{
                fontSize: '10px',
                fontWeight: 500,
                color: isActive ? 'var(--amber)' : 'var(--text-muted)',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                gap: '3px',
              }}
            >
              <Icon style={{ width: '14px', height: '14px' }} />
              <span>{item.label}</span>
            </button>
          );
        })}
        <button
          onClick={() => setCurrentView('settings')}
          className="flex flex-col items-center py-1 px-2"
          style={{
            fontSize: '10px',
            fontWeight: 500,
            color: currentView === 'settings' ? 'var(--amber)' : 'var(--text-muted)',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            gap: '3px',
          }}
        >
          <Sliders style={{ width: '14px', height: '14px' }} />
          <span>Settings</span>
        </button>
      </div>
    </header>
  );
};
