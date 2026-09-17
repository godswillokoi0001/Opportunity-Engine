import React from 'react';
import { Plus, Play, MapPin, Briefcase, ArrowRight, Compass, Sparkles, CheckCircle2 } from 'lucide-react';
import { Campaign } from '../types.js';

interface CampaignsViewProps {
  campaigns: Campaign[];
  onNewCampaign: () => void;
  onRunCampaign: (campId: string) => Promise<void>;
  onSelectCampaign: (camp: Campaign) => void;
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({
  campaigns,
  onNewCampaign,
  onRunCampaign,
  onSelectCampaign,
}) => {
  return (
    <div className="space-y-6 w-full min-w-0">
      
      {/* Page Header */}
      <div className="card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Targeting & Discovery Sets</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            Discovery Campaigns
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {campaigns.length} active targeting {campaigns.length === 1 ? 'campaign' : 'campaigns'} configured for commercial lead scanning
          </p>
        </div>

        <button onClick={onNewCampaign} className="btn-primary self-start sm:self-auto cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Campaign List */}
      {campaigns.length === 0 ? (
        <div className="card p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              No campaigns created yet
            </h3>
            <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto mt-1">
              Create your first campaign to define which cities and industries you want the engine to audit.
            </p>
          </div>
          <button onClick={onNewCampaign} className="btn-primary cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Create Campaign</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              className="card p-6 hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Campaign Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">
                      {camp.name}
                    </h3>
                    <span className="badge badge-teal text-xs">
                      {camp.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)] flex-wrap">
                    <span className="font-semibold text-amber-700 dark:text-amber-400">
                      Service: {camp.service}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>{camp.location}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      <span>{camp.industries.join(', ')}</span>
                    </span>
                  </div>

                  {/* Campaign Metrics */}
                  <div className="flex items-center gap-6 pt-2">
                    <div>
                      <span className="text-xs text-[var(--text-muted)] block">Discovered</span>
                      <span className="text-lg font-bold text-[var(--text-primary)]">
                        {camp.discoveredCount}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-[var(--text-muted)] block">Qualified Leads</span>
                      <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                        {camp.qualifiedCount}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-[var(--text-muted)] block">Saved in Pipeline</span>
                      <span className="text-lg font-bold text-teal-600 dark:text-teal-400">
                        {camp.savedCount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => onRunCampaign(camp.id)}
                    className="btn-secondary text-xs cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 text-teal-600" />
                    <span>Re-Run Discovery</span>
                  </button>

                  <button
                    onClick={() => onSelectCampaign(camp)}
                    className="btn-primary text-xs cursor-pointer"
                  >
                    <span>View Opportunities</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
