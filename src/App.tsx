import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.js';
import { LandingPage } from './components/LandingPage.js';
import { DashboardView } from './components/DashboardView.js';
import { CampaignsView } from './components/CampaignsView.js';
import { DiscoveryView } from './components/DiscoveryView.js';
import { SavedLeadsView } from './components/SavedLeadsView.js';
import { LiveAuditorView } from './components/LiveAuditorView.js';
import { SettingsView } from './components/SettingsView.js';
import { BusinessProfileView } from './components/BusinessProfileView.js';
import { CampaignModal } from './components/CampaignModal.js';
import { OnboardingModal } from './components/OnboardingModal.js';
import { OutreachModal } from './components/OutreachModal.js';
import { Business, Campaign, LeadStatus, OutreachGeneration, SavedLead, UserProfile, WebsiteAudit } from './types.js';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'campaigns' | 'discovery' | 'leads' | 'auditor' | 'settings'>('dashboard');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'user_1',
    name: 'David O.',
    email: 'david@sterlingdigital.agency',
    agencyName: 'Sterling Digital Partners',
    primaryService: 'Website Redesign & Modernization',
    targetLocations: ['Lagos, Nigeria'],
    targetIndustries: ['Logistics & Supply Chain', 'Real Estate'],
    createdAt: new Date().toISOString(),
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [activityLogs, setActivityLogs] = useState<Array<{ id: string; action: string; details: string; timestamp: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals & Sliders
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [outreachBusiness, setOutreachBusiness] = useState<Business | null>(null);

  // Safe JSON Fetch Helper
  const safeJsonFetch = async <T = any>(url: string, options?: RequestInit): Promise<T | null> => {
    try {
      const res = await fetch(url, options);
      if (!res.ok) return null;
      const text = await res.text();
      if (!text || text.trim().startsWith('<')) {
        return null;
      }
      return JSON.parse(text) as T;
    } catch {
      return null;
    }
  };

  // Initial Data Fetch
  useEffect(() => {
    const initData = async () => {
      try {
        const [profData, campsData, bizData, actData] = await Promise.all([
          safeJsonFetch<UserProfile>('/api/user/profile'),
          safeJsonFetch<{ campaigns: Campaign[] } | Campaign[]>('/api/campaigns'),
          safeJsonFetch<{ businesses: Business[] } | Business[]>('/api/businesses'),
          safeJsonFetch<{ activities: any[] } | any[]>('/api/activity'),
        ]);

        if (profData) {
          setUserProfile(profData);
        }
        if (campsData) {
          const list = Array.isArray(campsData) ? campsData : (campsData.campaigns || []);
          setCampaigns(list);
        }
        if (bizData) {
          const list = Array.isArray(bizData) ? bizData : (bizData.businesses || []);
          setBusinesses(list);
        }
        if (actData) {
          const list = Array.isArray(actData) ? actData : (actData.activities || []);
          setActivityLogs(list);
        }
      } catch (err) {
        console.warn('Initial workspace load notice:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initData();
  }, []);

  // Update Profile
  const handleSaveProfile = async (updated: Partial<UserProfile>) => {
    try {
      const data = await safeJsonFetch<UserProfile>('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (data) {
        setUserProfile(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Run Campaign Discovery
  const handleRunCampaign = async (campId: string) => {
    try {
      const runResult = await safeJsonFetch(`/api/campaigns/${campId}/run`, { method: 'POST' });
      if (runResult) {
        // Refresh businesses & campaigns
        const [campsData, bizData, actData] = await Promise.all([
          safeJsonFetch<{ campaigns: Campaign[] } | Campaign[]>('/api/campaigns'),
          safeJsonFetch<{ businesses: Business[] } | Business[]>('/api/businesses'),
          safeJsonFetch<{ activities: any[] } | any[]>('/api/activity'),
        ]);
        if (campsData) setCampaigns(Array.isArray(campsData) ? campsData : (campsData.campaigns || []));
        if (bizData) setBusinesses(Array.isArray(bizData) ? bizData : (bizData.businesses || []));
        if (actData) setActivityLogs(Array.isArray(actData) ? actData : (actData.activities || []));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Save Lead to Pipeline
  const handleSaveLead = async (bizId: string, tags?: string[]) => {
    try {
      const saved = await safeJsonFetch<{ lead: SavedLead; business?: Business }>('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: bizId,
          status: 'new',
          tags: tags || ['Discovered Lead'],
        }),
      });
      if (saved && saved.lead) {
        setBusinesses(prev => prev.map(b => b.id === bizId ? { ...b, savedLead: saved.lead } : b));
        if (selectedBusiness && selectedBusiness.id === bizId) {
          setSelectedBusiness(prev => prev ? { ...prev, savedLead: saved.lead } : null);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Update Lead Status
  const handleUpdateLeadStatus = async (bizId: string, status: LeadStatus) => {
    const biz = businesses.find(b => b.id === bizId);
    if (!biz || !biz.savedLead) {
      await handleSaveLead(bizId);
    }

    try {
      const updated = await safeJsonFetch<{ lead: SavedLead }>(`/api/leads/${bizId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (updated && updated.lead) {
        setBusinesses(prev => prev.map(b => b.id === bizId ? { ...b, savedLead: updated.lead } : b));
        if (selectedBusiness && selectedBusiness.id === bizId) {
          setSelectedBusiness(prev => prev ? { ...prev, savedLead: updated.lead } : null);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Add Note to Lead
  const handleAddNote = async (bizId: string, text: string) => {
    const biz = businesses.find(b => b.id === bizId);
    if (!biz) return;
    if (!biz.savedLead) {
      await handleSaveLead(bizId);
    }

    try {
      const data = await safeJsonFetch<{ note: any; lead?: SavedLead }>(`/api/leads/${bizId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, author: userProfile.name }),
      });
      if (data && data.lead) {
        setBusinesses(prev => prev.map(b => b.id === bizId ? { ...b, savedLead: data.lead } : b));
        if (selectedBusiness && selectedBusiness.id === bizId) {
          setSelectedBusiness(prev => prev ? { ...prev, savedLead: data.lead } : null);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Run Live Audit on a Business
  const handleRunAuditOnBusiness = async (biz: Business) => {
    if (!biz.websiteUrl) return;
    try {
      const data = await safeJsonFetch<{ audit: WebsiteAudit; business?: Business }>('/api/audit/live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: biz.websiteUrl, businessId: biz.id }),
      });
      if (data && data.audit) {
        const updatedAudit: WebsiteAudit = data.audit;
        setBusinesses(prev => prev.map(b => b.id === biz.id ? { ...b, audit: updatedAudit } : b));
        if (selectedBusiness && selectedBusiness.id === biz.id) {
          setSelectedBusiness(prev => prev ? { ...prev, audit: updatedAudit } : null);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Run Ad-hoc Live Audit
  const handleRunLiveAudit = async (url: string): Promise<WebsiteAudit> => {
    const res = await fetch('/api/audit/live', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Audit request failed');
    }
    const data = await res.json();
    return data.audit;
  };

  // Generate Opportunity Deep Dive
  const handleExplainOpportunity = async (bizId: string, oppId: string) => {
    const res = await fetch('/api/opportunities/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId: bizId, opportunityId: oppId }),
    });
    if (!res.ok) {
      throw new Error('Failed to generate AI explanation');
    }
    const data = await res.json();
    return data.explanation;
  };

  // Generate Outreach Pitch
  const handleGenerateOutreach = async (params: {
    businessId: string;
    opportunityId: string;
    angle: 'problem_solution' | 'value_audit' | 'consultative_inquiry';
    tone?: 'professional' | 'direct' | 'consultative';
  }): Promise<OutreachGeneration> => {
    const res = await fetch('/api/outreach/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      throw new Error('Failed to synthesize outreach draft');
    }
    const data = await res.json();
    return data.outreach;
  };

  // When a new campaign is created
  const handleCampaignCreated = (newCamp: Campaign) => {
    setCampaigns(prev => [newCamp, ...prev]);
    // Run discovery for it immediately
    handleRunCampaign(newCamp.id);
    setCurrentView('discovery');
  };

  const activeCampaign = campaigns.find(c => c.status === 'active') || campaigns[0];
  const savedCount = businesses.filter(b => Boolean(b.savedLead)).length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ground)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-sans)' }}>
      {/* Top Application Bar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        userProfile={userProfile}
        onNewCampaign={() => setIsNewCampaignOpen(true)}
        activeCampaignName={activeCampaign?.name}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentView === 'landing' ? (
          <LandingPage
            onGetStarted={() => {
              setCurrentView('dashboard');
              setIsNewCampaignOpen(true);
            }}
            onExploreDemo={() => {
              setCurrentView('discovery');
            }}
          />
        ) : (
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {currentView === 'dashboard' && (
              <DashboardView
                campaigns={campaigns}
                businesses={businesses}
                savedLeadsCount={savedCount}
                activityLogs={activityLogs}
                userProfile={userProfile}
                onNavigate={setCurrentView}
                onSelectBusiness={setSelectedBusiness}
                onNewCampaign={() => setIsNewCampaignOpen(true)}
              />
            )}

            {currentView === 'campaigns' && (
              <CampaignsView
                campaigns={campaigns}
                onNewCampaign={() => setIsNewCampaignOpen(true)}
                onRunCampaign={handleRunCampaign}
                onSelectCampaign={() => setCurrentView('discovery')}
              />
            )}

            {currentView === 'discovery' && (
              <DiscoveryView
                businesses={businesses}
                onSelectBusiness={setSelectedBusiness}
                onSaveLead={handleSaveLead}
                onRunAudit={handleRunAuditOnBusiness}
                onOpenOutreach={setOutreachBusiness}
                onRefreshDiscovery={async () => {
                  if (activeCampaign) await handleRunCampaign(activeCampaign.id);
                }}
              />
            )}

            {currentView === 'leads' && (
              <SavedLeadsView
                savedBusinesses={businesses.filter(b => Boolean(b.savedLead))}
                onSelectBusiness={setSelectedBusiness}
                onUpdateLeadStatus={handleUpdateLeadStatus}
                onAddNote={handleAddNote}
                onOpenOutreach={setOutreachBusiness}
              />
            )}


            {currentView === 'auditor' && (
              <LiveAuditorView
                onAuditUrl={handleRunLiveAudit}
              />
            )}

            {currentView === 'settings' && (
              <SettingsView
                userProfile={userProfile}
                onSaveProfile={handleSaveProfile}
              />
            )}
          </div>
        )}
      </main>

      {/* Campaign Creation Modal */}
      <CampaignModal
        isOpen={isNewCampaignOpen}
        onClose={() => setIsNewCampaignOpen(false)}
        userProfile={userProfile}
        onCampaignCreated={handleCampaignCreated}
      />

      {/* Onboarding / Targeting Setup Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        userProfile={userProfile}
        onSaveProfile={handleSaveProfile}
      />

      {/* Business Intelligence Profile Dossier */}
      <BusinessProfileView
        business={selectedBusiness}
        onClose={() => setSelectedBusiness(null)}
        onSaveLead={handleSaveLead}
        onUpdateLeadStatus={handleUpdateLeadStatus}
        onAddNote={handleAddNote}
        onRunAudit={handleRunAuditOnBusiness}
        onOpenOutreach={(biz) => {
          setSelectedBusiness(null);
          setOutreachBusiness(biz);
        }}
        onExplainOpportunity={handleExplainOpportunity}
      />

      {/* Evidence-Grounded Outreach Pitch Modal */}
      <OutreachModal
        business={outreachBusiness}
        userProfile={userProfile}
        isOpen={Boolean(outreachBusiness)}
        onClose={() => setOutreachBusiness(null)}
        onGenerateOutreach={handleGenerateOutreach}
      />
    </div>
  );
}
