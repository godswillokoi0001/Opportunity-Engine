import { Business, Campaign, LeadNote, LeadStatus, OutreachGeneration, SavedLead, UserProfile, WebsiteAudit } from '../../src/types.js';
import { OpportunityRulesEngine } from '../engine/OpportunityRulesEngine.js';

export class Store {
  private static instance: Store;

  public userProfile: UserProfile = {
    id: 'usr_lead_01',
    name: 'Alexandre Sterling',
    email: 'alex@apexdesign.studio',
    agencyName: 'Sterling Digital Partners',
    primaryService: 'Website Design & Development',
    secondaryServices: [
      'Website Redesign & Modernization',
      'Conversion Rate Optimization (CRO)',
      'SEO & Search Visibility',
      'Branding & Creative Identity'
    ],
    targetLocations: ['Lagos, Nigeria', 'London, UK', 'Austin, TX'],
    targetIndustries: ['Logistics', 'Real Estate', 'Hospitality', 'Professional Services'],
    subscriptionTier: 'Pro',
    quotaRemaining: {
      searches: 84,
      audits: 45,
      aiOutreach: 120,
    },
  };

  public campaigns: Map<string, Campaign> = new Map();
  public businesses: Map<string, Business> = new Map();
  public savedLeads: Map<string, SavedLead> = new Map();
  public outreachHistory: Map<string, OutreachGeneration[]> = new Map();
  public activityLogs: Array<{ id: string; action: string; details: string; timestamp: string }> = [];

  private constructor() {
    this.seedInitialData();
  }

  public static get(): Store {
    if (!Store.instance) {
      Store.instance = new Store();
    }
    return Store.instance;
  }

  private seedInitialData() {
    // 1. Initial Campaign: Lagos Logistics & Real Estate
    const campId = 'camp_lagos_01';
    const initialCampaign: Campaign = {
      id: campId,
      name: 'Lagos Logistics & Real Estate Modernization',
      service: 'Website Design & Development',
      location: 'Lagos, Nigeria',
      industries: ['Logistics', 'Real Estate', 'Hospitality'],
      criteria: {
        websiteRequirement: 'any',
        companySize: 'established',
        minConfidence: 'all',
        requireContactInfo: true,
      },
      status: 'active',
      discoveredCount: 6,
      qualifiedCount: 5,
      savedCount: 2,
      createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
      lastRunAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    };
    this.campaigns.set(campId, initialCampaign);

    // 2. Pre-seeded Businesses with deterministic audits & opportunities
    const b1: Business = {
      id: 'biz_apex_haulage',
      name: 'Apex Haulage & Intermodal Logistics',
      normalizedName: 'apexhaulageintermodallogistics',
      industry: 'Logistics',
      subIndustry: 'Freight Forwarding & Port Haulage',
      location: {
        city: 'Lagos',
        state: 'Lagos State',
        country: 'Nigeria',
        address: '14 Commercial Avenue, Apapa Port Corridor, Lagos',
      },
      websiteUrl: 'https://example-apexhaulage-lagos.org',
      hasWebsite: true,
      phone: '+234 1 700 8920',
      email: 'operations@apexhaulage-lagos.org',
      verifiedActive: true,
      source: {
        providerId: 'curated_commercial_registry',
        license: 'Public Corporate Directory',
        externalId: 'RC-1049281',
        fetchedAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
      },
      digitalPresence: {
        status: 'outdated',
        ownedWebsite: true,
        socialChannelsCount: 1,
        contactFriction: 'high',
        mobileReadiness: 'poor',
        brandConsistency: 'mixed',
      },
      audit: {
        id: 'aud_apex_01',
        businessId: 'biz_apex_haulage',
        url: 'https://example-apexhaulage-lagos.org',
        status: 'completed',
        isHttps: true,
        httpStatus: 200,
        responseTimeMs: 1420,
        pageTitle: 'Apex Haulage & Logistics Limited',
        metaDescription: undefined, // Missing
        hasViewport: false, // Severe mobile issue
        h1Count: 0, // No semantic H1
        h2Count: 2,
        ctaCount: 0, // No CTA buttons
        detectedCtas: [],
        hasContactPage: true,
        hasPhoneLink: false,
        hasEmailLink: true,
        hasLeadForm: false,
        socialLinks: [{ platform: 'Facebook', url: 'https://facebook.com/apexhaulage' }],
        hasOpenGraph: false,
        pageSizeBytes: 340000,
        scriptCount: 14,
        stylesheetCount: 5,
        detectedTech: ['WordPress', 'Elementor'],
        brokenLinksFound: 1,
        deterministicHealthScore: 38,
        auditedAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
      },
      opportunities: [],
      createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    };
    b1.opportunities = OpportunityRulesEngine.evaluate(b1, initialCampaign.service, b1.audit);

    // Business 2: Kreston Inland (No website, established company)
    const b2: Business = {
      id: 'biz_kreston_express',
      name: 'Kreston Inland Express Logistics',
      normalizedName: 'krestoninlandexpresslogistics',
      industry: 'Logistics',
      subIndustry: 'Intra-State Delivery & Cargo Fleet',
      location: {
        city: 'Lagos',
        state: 'Lagos State',
        country: 'Nigeria',
        address: 'Plot 8, Ikorodu Industrial Estate, Ikeja, Lagos',
      },
      websiteUrl: undefined,
      hasWebsite: false,
      phone: '+234 803 554 9912',
      email: 'inquiries@krestonexpress.ng',
      verifiedActive: true,
      source: {
        providerId: 'curated_commercial_registry',
        license: 'Public Corporate Directory',
        externalId: 'RC-892401',
        fetchedAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
      },
      digitalPresence: {
        status: 'none',
        ownedWebsite: false,
        socialChannelsCount: 0,
        contactFriction: 'high',
        mobileReadiness: 'missing',
        brandConsistency: 'weak',
      },
      opportunities: [],
      createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    };
    b2.opportunities = OpportunityRulesEngine.evaluate(b2, initialCampaign.service, undefined);

    // Business 3: Eko Prime Terraces (Real estate with website, no CTA, high friction)
    const b3: Business = {
      id: 'biz_eko_prime',
      name: 'Eko Prime Terraces & Asset Management',
      normalizedName: 'ekoprimeterracesassetmanagement',
      industry: 'Real Estate',
      subIndustry: 'Commercial & Luxury Residential',
      location: {
        city: 'Lagos',
        state: 'Lagos State',
        country: 'Nigeria',
        address: 'Admiralty Way, Lekki Phase 1, Lagos',
      },
      websiteUrl: 'https://example-ekoprime.ng',
      hasWebsite: true,
      phone: '+234 1 889 0041',
      email: 'advisory@ekoprime.ng',
      verifiedActive: true,
      source: {
        providerId: 'curated_commercial_registry',
        license: 'Public Corporate Directory',
        externalId: 'RC-673194',
        fetchedAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
      },
      digitalPresence: {
        status: 'suboptimal',
        ownedWebsite: true,
        socialChannelsCount: 1,
        contactFriction: 'high',
        mobileReadiness: 'good',
        brandConsistency: 'mixed',
      },
      audit: {
        id: 'aud_eko_01',
        businessId: 'biz_eko_prime',
        url: 'https://example-ekoprime.ng',
        status: 'completed',
        isHttps: true,
        httpStatus: 200,
        responseTimeMs: 890,
        pageTitle: 'Eko Prime Terraces | Real Estate Lagos',
        metaDescription: 'Luxury homes in Lekki Phase 1 and Victoria Island.',
        hasViewport: true,
        h1Count: 1,
        h2Count: 4,
        ctaCount: 0, // Missing CTAs completely
        detectedCtas: [],
        hasContactPage: true,
        hasPhoneLink: false,
        hasEmailLink: false,
        hasLeadForm: false,
        socialLinks: [{ platform: 'Instagram', url: 'https://instagram.com/ekoprime' }],
        hasOpenGraph: true,
        pageSizeBytes: 512000,
        scriptCount: 9,
        stylesheetCount: 3,
        detectedTech: ['Next.js', 'Tailwind CSS'],
        brokenLinksFound: 0,
        deterministicHealthScore: 62,
        auditedAt: new Date(Date.now() - 3600 * 1000 * 10).toISOString(),
      },
      opportunities: [],
      createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    };
    b3.opportunities = OpportunityRulesEngine.evaluate(b3, initialCampaign.service, b3.audit);

    // Business 4: Boutique Palms Hotel
    const b4: Business = {
      id: 'biz_boutique_palms',
      name: 'Boutique Palms Hotel & Suites',
      normalizedName: 'boutiquepalmshotelsuites',
      industry: 'Hospitality',
      subIndustry: 'Executive Lodging & Dining',
      location: {
        city: 'Lagos',
        state: 'Lagos State',
        country: 'Nigeria',
        address: '22 Isaac John Street, GRA Ikeja, Lagos',
      },
      websiteUrl: 'https://example-boutiquepalms-ikeja.com',
      hasWebsite: true,
      phone: '+234 1 291 0023',
      email: 'reservations@boutiquepalms.com',
      verifiedActive: true,
      source: {
        providerId: 'curated_commercial_registry',
        license: 'Public Corporate Directory',
        externalId: 'RC-998124',
        fetchedAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
      },
      digitalPresence: {
        status: 'outdated',
        ownedWebsite: true,
        socialChannelsCount: 2,
        contactFriction: 'medium',
        mobileReadiness: 'poor',
        brandConsistency: 'mixed',
      },
      audit: {
        id: 'aud_palms_01',
        businessId: 'biz_boutique_palms',
        url: 'https://example-boutiquepalms-ikeja.com',
        status: 'completed',
        isHttps: true,
        httpStatus: 200,
        responseTimeMs: 1980,
        pageTitle: 'Welcome to Boutique Palms',
        metaDescription: undefined,
        hasViewport: false,
        h1Count: 0,
        h2Count: 1,
        ctaCount: 1,
        detectedCtas: ['Contact Us'],
        hasContactPage: true,
        hasPhoneLink: true,
        hasEmailLink: true,
        hasLeadForm: false,
        socialLinks: [
          { platform: 'Facebook', url: 'https://facebook.com/palmsikeja' },
          { platform: 'Instagram', url: 'https://instagram.com/palmsikeja' }
        ],
        hasOpenGraph: false,
        pageSizeBytes: 820000,
        scriptCount: 18,
        stylesheetCount: 6,
        detectedTech: ['Wix'],
        brokenLinksFound: 2,
        deterministicHealthScore: 45,
        auditedAt: new Date(Date.now() - 3600 * 1000 * 8).toISOString(),
      },
      opportunities: [],
      createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    };
    b4.opportunities = OpportunityRulesEngine.evaluate(b4, initialCampaign.service, b4.audit);

    // Add businesses
    this.businesses.set(b1.id, b1);
    this.businesses.set(b2.id, b2);
    this.businesses.set(b3.id, b3);
    this.businesses.set(b4.id, b4);

    // Pre-save 2 leads
    const lead1: SavedLead = {
      id: 'lead_01',
      businessId: b1.id,
      campaignId: campId,
      status: 'researching',
      tags: ['High Priority', 'Mobile Redesign', 'Apapa Corridor'],
      notes: [
        {
          id: 'note_01',
          text: 'Verified business registration RC-1049281. Key fleet hub in Apapa. Decision-maker is Alhaji S. Bello (Managing Director).',
          createdAt: new Date(Date.now() - 3600 * 1000 * 18).toISOString(),
          author: 'Alexandre Sterling',
        }
      ],
      savedAt: new Date(Date.now() - 3600 * 1000 * 20).toISOString(),
      updatedAt: new Date(Date.now() - 3600 * 1000 * 18).toISOString(),
    };
    this.savedLeads.set(b1.id, lead1);
    b1.savedLead = lead1;

    const lead2: SavedLead = {
      id: 'lead_02',
      businessId: b2.id,
      campaignId: campId,
      status: 'new',
      tags: ['Greenfield Website', 'Express Fleet'],
      notes: [
        {
          id: 'note_02',
          text: 'No digital website at all despite 40+ vehicle fleet. Perfect candidate for initial corporate portal package.',
          createdAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
          author: 'Alexandre Sterling',
        }
      ],
      savedAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
      updatedAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
    };
    this.savedLeads.set(b2.id, lead2);
    b2.savedLead = lead2;

    this.activityLogs.push({
      id: 'act_01',
      action: 'Campaign Created',
      details: 'Started campaign "Lagos Logistics & Real Estate Modernization"',
      timestamp: initialCampaign.createdAt,
    });
    this.activityLogs.push({
      id: 'act_02',
      action: 'Signals Qualified',
      details: 'Evaluated 4 businesses; qualified 4 high-probability service opportunities',
      timestamp: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
    });
    this.activityLogs.push({
      id: 'act_03',
      action: 'Lead Saved',
      details: 'Saved Apex Haulage & Intermodal Logistics to pipeline with priority tags',
      timestamp: lead1.savedAt,
    });
  }

  public logActivity(action: string, details: string) {
    this.activityLogs.unshift({
      id: 'act_' + Math.random().toString(36).substring(2, 9),
      action,
      details,
      timestamp: new Date().toISOString(),
    });
    if (this.activityLogs.length > 50) {
      this.activityLogs.pop();
    }
  }

  public saveLead(businessId: string, campaignId?: string, tags: string[] = []): SavedLead {
    const biz = this.businesses.get(businessId);
    if (!biz) throw new Error('Business not found');

    let lead = this.savedLeads.get(businessId);
    if (lead) {
      lead.tags = Array.from(new Set([...lead.tags, ...tags]));
      lead.updatedAt = new Date().toISOString();
    } else {
      lead = {
        id: 'lead_' + Math.random().toString(36).substring(2, 9),
        businessId,
        campaignId,
        status: 'new',
        tags: tags.length ? tags : ['Prospect'],
        notes: [],
        savedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.savedLeads.set(businessId, lead);
    }

    biz.savedLead = lead;
    this.logActivity('Lead Saved', `Saved ${biz.name} to outreach pipeline`);
    return lead;
  }

  public updateLeadStatus(idOrBusinessId: string, status: LeadStatus): SavedLead {
    let lead = this.savedLeads.get(idOrBusinessId);
    if (!lead) {
      for (const l of this.savedLeads.values()) {
        if (l.id === idOrBusinessId) {
          lead = l;
          break;
        }
      }
    }
    if (!lead) throw new Error('Saved lead record not found');
    lead.status = status;
    lead.updatedAt = new Date().toISOString();
    const biz = this.businesses.get(lead.businessId);
    if (biz) {
      biz.savedLead = lead;
      this.logActivity('Status Updated', `${biz.name} status updated to ${status}`);
    }
    return lead;
  }

  public addLeadNote(idOrBusinessId: string, text: string, author: string = 'Alexandre Sterling'): LeadNote {
    let lead = this.savedLeads.get(idOrBusinessId);
    if (!lead) {
      for (const l of this.savedLeads.values()) {
        if (l.id === idOrBusinessId) {
          lead = l;
          break;
        }
      }
    }
    if (!lead) throw new Error('Saved lead record not found');
    const note: LeadNote = {
      id: 'note_' + Math.random().toString(36).substring(2, 9),
      text,
      createdAt: new Date().toISOString(),
      author,
    };
    lead.notes.unshift(note);
    lead.updatedAt = new Date().toISOString();
    const biz = this.businesses.get(lead.businessId);
    if (biz) {
      biz.savedLead = lead;
    }
    return note;
  }
}
