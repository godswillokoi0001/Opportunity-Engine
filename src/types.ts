export type ServiceType = 
  | 'Website Design & Development'
  | 'Website Redesign & Modernization'
  | 'SEO & Search Visibility'
  | 'Conversion Rate Optimization (CRO)'
  | 'Branding & Creative Identity'
  | 'Social Media & Content Strategy'
  | 'B2B Lead Generation'
  | 'Custom Software & Mobile Apps';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  agencyName: string;
  primaryService: ServiceType;
  secondaryServices: ServiceType[];
  targetLocations: string[];
  targetIndustries: string[];
  subscriptionTier: 'Free' | 'Pro' | 'Agency';
  quotaRemaining: {
    searches: number;
    audits: number;
    aiOutreach: number;
  };
}

export interface CampaignCriteria {
  websiteRequirement: 'any' | 'must_have_website' | 'no_website_only';
  companySize?: 'all' | 'small' | 'medium' | 'established';
  minConfidence?: 'all' | 'medium_high' | 'high_only';
  requireContactInfo?: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  service: ServiceType;
  location: string;
  industries: string[];
  criteria: CampaignCriteria;
  status: 'active' | 'completed' | 'draft';
  discoveredCount: number;
  qualifiedCount: number;
  savedCount: number;
  providerId?: string;
  createdAt: string;
  lastRunAt?: string;
}

export interface BusinessLocation {
  city: string;
  state?: string;
  country: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface DigitalPresenceSummary {
  status: 'none' | 'outdated' | 'suboptimal' | 'modern' | 'verified';
  ownedWebsite: boolean;
  socialChannelsCount: number;
  contactFriction: 'low' | 'medium' | 'high';
  mobileReadiness: 'good' | 'poor' | 'missing';
  brandConsistency: 'strong' | 'mixed' | 'weak';
}

export interface EvidenceItem {
  metric: string;
  finding: string;
  benchmark: string;
  severity: 'critical' | 'warning' | 'info';
}

export interface OpportunityTriad {
  observed: string[];        // Deterministic facts directly extracted
  inferred: string[];        // Logical deduction
  aiInterpretation: string;  // Strategic commercial rationale
}

export interface Opportunity {
  id: string;
  businessId: string;
  type: string;
  title: string;
  targetService: ServiceType | string;
  confidence: 'high' | 'medium' | 'low';
  score: number; // 0-100
  triad: OpportunityTriad;
  recommendedAction: string;
  valueProposition: string;
  evidence: EvidenceItem[];
}

export interface WebsiteAudit {
  id: string;
  businessId: string;
  url: string;
  status: 'completed' | 'failed' | 'in_progress' | 'unreachable' | 'not_applicable';
  isHttps: boolean;
  httpStatus: number;
  responseTimeMs: number;
  pageTitle?: string;
  metaDescription?: string;
  hasViewport: boolean;
  h1Count: number;
  h2Count: number;
  ctaCount: number;
  detectedCtas: string[];
  hasContactPage: boolean;
  hasPhoneLink: boolean;
  hasEmailLink: boolean;
  hasLeadForm: boolean;
  socialLinks: Array<{ platform: string; url: string }>;
  hasOpenGraph: boolean;
  pageSizeBytes: number;
  scriptCount: number;
  stylesheetCount: number;
  detectedTech: string[];
  brokenLinksFound: number;
  deterministicHealthScore: number;
  auditedAt: string;
  error?: string;
}

export type LeadStatus = 
  | 'new'
  | 'researching'
  | 'contacted'
  | 'replied'
  | 'qualified'
  | 'won'
  | 'not_interested';

export interface LeadNote {
  id: string;
  text: string;
  createdAt: string;
  author: string;
}

export interface SavedLead {
  id: string;
  businessId: string;
  campaignId?: string;
  status: LeadStatus;
  tags: string[];
  notes: LeadNote[];
  savedAt: string;
  updatedAt: string;
  lastContactedAt?: string;
}

export interface Business {
  id: string;
  name: string;
  normalizedName: string;
  industry: string;
  subIndustry?: string;
  location: BusinessLocation;
  websiteUrl?: string;
  hasWebsite: boolean;
  phone?: string;
  email?: string;
  verifiedActive: boolean;
  source: {
    providerId: string;
    license: string;
    externalId?: string;
    fetchedAt: string;
  };
  digitalPresence: DigitalPresenceSummary;
  audit?: WebsiteAudit;
  opportunities: Opportunity[];
  savedLead?: SavedLead;
  createdAt: string;
}

export interface OutreachGeneration {
  id: string;
  businessId: string;
  angle: 'problem_solution' | 'value_audit' | 'consultative_inquiry';
  subject: string;
  body: string;
  callToAction: string;
  referencedEvidence: string[];
  generatedAt: string;
}
