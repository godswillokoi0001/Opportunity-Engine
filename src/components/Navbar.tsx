import React from 'react';
import { 
  Compass, 
  Layers, 
  Users, 
  Globe, 
  Sliders, 
  Plus, 
  Sparkles,
  ShieldCheck,
  ChevronRight
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
    { id: 'leads', label: 'Saved Leads', icon: Users },
    { id: 'auditor', label: 'Live Auditor', icon: Globe },
    { id: 'settings', label: 'Settings', icon: Sliders },
  ] as const;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setCurrentView('landing')}
              className="flex items-center space-x-2.5 focus:outline-none group text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-lg tracking-tight group-hover:bg-indigo-600 transition-colors shadow-sm">
                OE
              </div>
              <div>
                <span className="font-semibold text-slate-900 tracking-tight text-base block leading-tight">
                  Opportunity Engine
                </span>
                <span className="text-[11px] font-medium text-slate-500 block leading-tight tracking-wider uppercase">
                  B2B Intelligence
                </span>
              </div>
            </button>

            {/* Breadcrumb / Active Context Indicator */}
            {activeCampaignName && currentView !== 'landing' && (
              <div className="hidden lg:flex items-center space-x-2 text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
                <span className="text-slate-400">Campaign:</span>
                <span className="text-slate-700 font-semibold truncate max-w-[200px]">{activeCampaignName}</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </div>
            )}
          </div>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onNewCampaign}
              className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-md transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Campaign</span>
            </button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            {/* Agency/User Badge */}
            <button
              onClick={() => setCurrentView('settings')}
              className="flex items-center space-x-2.5 p-1.5 rounded-md hover:bg-slate-50 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
                {userProfile.name.charAt(0)}
              </div>
              <div className="hidden xl:block">
                <p className="text-xs font-semibold text-slate-800 leading-none">{userProfile.name}</p>
                <p className="text-[11px] text-slate-500 leading-none mt-1 truncate max-w-[120px]">{userProfile.agencyName}</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden border-t border-slate-200 bg-slate-50 px-2 py-1.5 flex items-center justify-around overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center py-1 px-2 text-[11px] font-medium rounded ${
                isActive ? 'text-indigo-600 font-semibold' : 'text-slate-500'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
