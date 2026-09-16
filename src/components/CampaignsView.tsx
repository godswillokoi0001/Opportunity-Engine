import React from 'react';
import { 
  Compass, 
  Plus, 
  Play, 
  ChevronRight, 
  Sparkles, 
  MapPin, 
  Briefcase, 
  Globe, 
  Calendar,
  CheckCircle2
} from 'lucide-react';
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
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Compass className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Opportunity Campaigns
            </h1>
            <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-100">
              {campaigns.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Segmented commercial discovery operations targeting specific industries, regions, and service offerings
          </p>
        </div>

        <button
          onClick={onNewCampaign}
          className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Campaign</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className="bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-xs transition-all space-y-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-slate-900 text-base">{camp.name}</h3>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    camp.status === 'active' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {camp.status}
                  </span>
                </div>
                <p className="text-xs font-medium text-indigo-600 mt-0.5">{camp.service}</p>
              </div>

              <span className="text-[10px] text-slate-400 font-mono">
                {new Date(camp.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200/70">
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span><strong>Target Location:</strong> {camp.location}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span><strong>Industries:</strong> {camp.industries.join(', ')}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span><strong>Provider:</strong> {camp.providerId}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <div className="flex items-center space-x-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Discovered</span>
                  <span className="font-extrabold text-slate-900 text-sm">{camp.discoveredCount}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Qualified</span>
                  <span className="font-extrabold text-indigo-600 text-sm">{camp.qualifiedCount}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onRunCampaign(camp.id)}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
                >
                  <Play className="w-3 h-3" />
                  <span>Execute</span>
                </button>
                <button
                  onClick={() => onSelectCampaign(camp)}
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-xs transition-colors"
                >
                  <span>Results</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
