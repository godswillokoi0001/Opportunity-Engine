import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { SafeCrawler } from './server/crawler/SafeCrawler.js';
import { DeterministicAuditor } from './server/analysis/DeterministicAuditor.js';
import { OpportunityRulesEngine } from './server/engine/OpportunityRulesEngine.js';
import { GeminiAIProvider } from './server/ai/AIProvider.js';
import { ProviderRegistry } from './server/providers/DataProvider.js';
import { Store } from './server/storage/Store.js';
import { Business, Campaign, ServiceType } from './src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const store = Store.get();
  const aiProvider = new GeminiAIProvider();

  // -------------------------------------------------------------
  // API ROUTES
  // -------------------------------------------------------------

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'OpportunityEngine', timestamp: new Date().toISOString() });
  });

  // User Profile & Onboarding Settings
  const getProfileHandler = (req: express.Request, res: express.Response) => {
    res.json(store.userProfile);
  };
  const updateProfileHandler = (req: express.Request, res: express.Response) => {
    const updates = req.body;
    store.userProfile = { ...store.userProfile, ...updates };
    store.logActivity('Profile Updated', 'Updated target services and agency profile');
    res.json(store.userProfile);
  };

  app.get('/api/profile', getProfileHandler);
  app.get('/api/user/profile', getProfileHandler);
  app.put('/api/profile', updateProfileHandler);
  app.put('/api/user/profile', updateProfileHandler);

  // Providers List
  app.get('/api/providers', (req, res) => {
    res.json({ providers: ProviderRegistry.listProviders() });
  });

  // Campaigns
  app.get('/api/campaigns', (req, res) => {
    const list = Array.from(store.campaigns.values());
    res.json({ campaigns: list });
  });

  app.post('/api/campaigns', async (req, res) => {
    try {
      const { name, service, location, industries, criteria, providerId } = req.body;

      if (!name || !service || !location) {
        return res.status(400).json({ error: 'Name, service, and location are required' });
      }

      const campaignId = 'camp_' + Math.random().toString(36).substring(2, 9);
      const newCampaign: Campaign = {
        id: campaignId,
        name,
        service: service as ServiceType,
        location,
        industries: Array.isArray(industries) && industries.length > 0 ? industries : ['General Commercial'],
        criteria: criteria || { websiteRequirement: 'any', companySize: 'all' },
        status: 'active',
        discoveredCount: 0,
        qualifiedCount: 0,
        savedCount: 0,
        createdAt: new Date().toISOString(),
      };

      store.campaigns.set(campaignId, newCampaign);
      store.logActivity('Campaign Created', `Created campaign "${name}" for ${service} in ${location}`);

      // Immediately execute initial discovery for this campaign
      const discoveredRecords = await ProviderRegistry.executeDiscovery({
        service,
        location,
        industries: newCampaign.industries,
        websiteRequirement: newCampaign.criteria.websiteRequirement,
      }, providerId);

      let qualified = 0;
      for (const rec of discoveredRecords) {
        let biz = store.businesses.get(rec.id);
        if (!biz) {
          biz = {
            ...rec,
            digitalPresence: {
              status: rec.hasWebsite ? 'suboptimal' : 'none',
              ownedWebsite: rec.hasWebsite,
              socialChannelsCount: 0,
              contactFriction: rec.hasWebsite ? 'medium' : 'high',
              mobileReadiness: rec.hasWebsite ? 'poor' : 'missing',
              brandConsistency: 'mixed',
            },
            opportunities: [],
            createdAt: new Date().toISOString(),
          };
          store.businesses.set(biz.id, biz);
        }

        const opps = OpportunityRulesEngine.evaluate(biz, service, biz.audit);
        biz.opportunities = opps;
        if (opps.length > 0) qualified++;
      }

      newCampaign.discoveredCount = discoveredRecords.length;
      newCampaign.qualifiedCount = qualified;
      newCampaign.lastRunAt = new Date().toISOString();

      res.status(201).json({ campaign: newCampaign, discoveredCount: discoveredRecords.length });
    } catch (err: any) {
      console.error('Error creating campaign:', err);
      res.status(500).json({ error: err.message || 'Failed to create campaign' });
    }
  });

  // Run Campaign Discovery
  app.post('/api/campaigns/:id/run', async (req, res) => {
    try {
      const camp = store.campaigns.get(req.params.id);
      if (!camp) return res.status(404).json({ error: 'Campaign not found' });

      const discovered = await ProviderRegistry.executeDiscovery({
        service: camp.service,
        location: camp.location,
        industries: camp.industries,
        websiteRequirement: camp.criteria.websiteRequirement,
      }, camp.providerId);

      let qualified = 0;
      for (const rec of discovered) {
        let biz = store.businesses.get(rec.id);
        if (!biz) {
          biz = {
            ...rec,
            digitalPresence: {
              status: rec.hasWebsite ? 'suboptimal' : 'none',
              ownedWebsite: rec.hasWebsite,
              socialChannelsCount: 0,
              contactFriction: rec.hasWebsite ? 'medium' : 'high',
              mobileReadiness: rec.hasWebsite ? 'poor' : 'missing',
              brandConsistency: 'mixed',
            },
            opportunities: [],
            createdAt: new Date().toISOString(),
          };
          store.businesses.set(biz.id, biz);
        }

        const opps = OpportunityRulesEngine.evaluate(biz, camp.service, biz.audit);
        biz.opportunities = opps;
        if (opps.length > 0) qualified++;
      }

      camp.discoveredCount = discovered.length;
      camp.qualifiedCount = qualified;
      camp.lastRunAt = new Date().toISOString();

      store.logActivity('Campaign Executed', `Executed discovery for ${camp.name}: found ${discovered.length} businesses`);
      res.json({ campaign: camp, discoveredCount: discovered.length, qualifiedCount: qualified });
    } catch (err: any) {
      console.error('Error running campaign:', err);
      res.status(500).json({ error: err.message || 'Failed to execute campaign' });
    }
  });

  app.get('/api/campaigns/:id', (req, res) => {
    const campaign = store.campaigns.get(req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json({ campaign });
  });

  // Discovery Run
  app.post('/api/discovery/run', async (req, res) => {
    try {
      const { service, location, industries, websiteRequirement, providerId, campaignId } = req.body;
      const targetService = service || store.userProfile.primaryService;
      const targetLocation = location || store.userProfile.targetLocations[0] || 'Lagos, Nigeria';
      const targetIndustries = industries || store.userProfile.targetIndustries;

      const discovered = await ProviderRegistry.executeDiscovery({
        service: targetService,
        location: targetLocation,
        industries: targetIndustries,
        websiteRequirement,
      }, providerId);

      const processedBusinesses: Business[] = [];
      for (const rec of discovered) {
        let biz = store.businesses.get(rec.id);
        if (!biz) {
          biz = {
            ...rec,
            digitalPresence: {
              status: rec.hasWebsite ? 'suboptimal' : 'none',
              ownedWebsite: rec.hasWebsite,
              socialChannelsCount: 0,
              contactFriction: rec.hasWebsite ? 'medium' : 'high',
              mobileReadiness: rec.hasWebsite ? 'poor' : 'missing',
              brandConsistency: 'mixed',
            },
            opportunities: [],
            createdAt: new Date().toISOString(),
          };
          store.businesses.set(biz.id, biz);
        }

        biz.opportunities = OpportunityRulesEngine.evaluate(biz, targetService, biz.audit);
        processedBusinesses.push(biz);
      }

      if (campaignId && store.campaigns.has(campaignId)) {
        const camp = store.campaigns.get(campaignId)!;
        camp.discoveredCount = Math.max(camp.discoveredCount, processedBusinesses.length);
        camp.qualifiedCount = processedBusinesses.filter(b => b.opportunities.length > 0).length;
        camp.lastRunAt = new Date().toISOString();
      }

      store.logActivity('Discovery Executed', `Discovered ${processedBusinesses.length} businesses in ${targetLocation}`);
      res.json({ results: processedBusinesses, count: processedBusinesses.length });
    } catch (err: any) {
      console.error('Discovery run error:', err);
      res.status(500).json({ error: err.message || 'Discovery run failed' });
    }
  });

  // Businesses Query (Filtering, Sorting)
  app.get('/api/businesses', (req, res) => {
    let list = Array.from(store.businesses.values());
    const { industry, location, hasWebsite, opportunityType, search } = req.query;

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(b => 
        b.name.toLowerCase().includes(q) || 
        b.location.city.toLowerCase().includes(q) || 
        b.industry.toLowerCase().includes(q)
      );
    }

    if (industry && typeof industry === 'string') {
      list = list.filter(b => b.industry.toLowerCase() === industry.toLowerCase());
    }

    if (location && typeof location === 'string') {
      list = list.filter(b => b.location.city.toLowerCase().includes(location.toLowerCase()));
    }

    if (hasWebsite !== undefined) {
      const reqHasWebsite = hasWebsite === 'true';
      list = list.filter(b => b.hasWebsite === reqHasWebsite);
    }

    if (opportunityType && typeof opportunityType === 'string') {
      list = list.filter(b => b.opportunities.some(o => o.type === opportunityType));
    }

    res.json({ businesses: list });
  });

  app.get('/api/businesses/:id', (req, res) => {
    const biz = store.businesses.get(req.params.id);
    if (!biz) return res.status(404).json({ error: 'Business not found' });
    res.json({ business: biz });
  });

  // Safe Live Website Audit
  app.post('/api/audit/live', async (req, res) => {
    try {
      const { businessId, url } = req.body;
      let targetUrl = url;
      let biz: Business | undefined;

      if (businessId) {
        biz = store.businesses.get(businessId);
        if (!biz) return res.status(404).json({ error: 'Business record not found' });
        targetUrl = targetUrl || biz.websiteUrl;
      }

      if (!targetUrl) {
        return res.status(400).json({ error: 'No website URL available to audit' });
      }

      // 1. Fetch safely using SSRF-hardened crawler
      const crawlResult = await SafeCrawler.fetchSafely(targetUrl);

      // 2. Deterministic analysis with Cheerio
      const audit = DeterministicAuditor.audit(crawlResult, businessId || 'ad_hoc');

      // 3. Update business in store if businessId provided
      if (biz) {
        biz.audit = audit;
        biz.websiteUrl = audit.url;
        biz.hasWebsite = true;
        biz.digitalPresence = {
          status: audit.deterministicHealthScore > 80 ? 'modern' : (audit.deterministicHealthScore > 50 ? 'suboptimal' : 'outdated'),
          ownedWebsite: true,
          socialChannelsCount: audit.socialLinks.length,
          contactFriction: (audit.hasPhoneLink || audit.hasEmailLink || audit.hasLeadForm) ? 'low' : 'high',
          mobileReadiness: audit.hasViewport ? 'good' : 'poor',
          brandConsistency: audit.socialLinks.length >= 2 ? 'strong' : 'mixed',
        };

        // Re-evaluate opportunities with fresh audit
        biz.opportunities = OpportunityRulesEngine.evaluate(biz, store.userProfile.primaryService, audit);
        store.logActivity('Website Audited', `Performed deterministic audit on ${biz.name} (${audit.deterministicHealthScore}/100)`);
      }

      res.json({ audit, business: biz });
    } catch (err: any) {
      console.error('Audit failed:', err);
      res.status(500).json({ error: err.message || 'Audit failed due to network or safety restriction' });
    }
  });

  // Opportunity Explanation (Gemini AI Reasoning)
  app.post('/api/opportunities/explain', async (req, res) => {
    try {
      const { businessId, opportunityId, sellingService } = req.body;
      const biz = store.businesses.get(businessId);
      if (!biz) return res.status(404).json({ error: 'Business not found' });

      const opp = biz.opportunities.find(o => o.id === opportunityId) || biz.opportunities[0];
      if (!opp) return res.status(404).json({ error: 'Opportunity not found' });

      const explanation = await aiProvider.explainOpportunity(
        biz,
        biz.audit,
        opp,
        sellingService || store.userProfile.primaryService
      );

      res.json({ explanation });
    } catch (err: any) {
      console.error('Opportunity explanation error:', err);
      res.status(500).json({ error: err.message || 'Failed to explain opportunity' });
    }
  });

  // Outreach Generator
  app.post('/api/outreach/generate', async (req, res) => {
    try {
      const { businessId, opportunityId, angle, tone } = req.body;
      const biz = store.businesses.get(businessId);
      if (!biz) return res.status(404).json({ error: 'Business not found' });

      const opp = biz.opportunities.find(o => o.id === opportunityId) || biz.opportunities[0];
      if (!opp) return res.status(404).json({ error: 'No qualified opportunity selected' });

      const outreach = await aiProvider.generateOutreach(
        biz,
        opp,
        biz.audit,
        store.userProfile,
        angle || 'problem_solution',
        tone || 'consultative'
      );

      // Save to outreach history
      const history = store.outreachHistory.get(biz.id) || [];
      history.unshift(outreach);
      store.outreachHistory.set(biz.id, history);

      store.logActivity('Outreach Generated', `Generated personalized ${angle} pitch for ${biz.name}`);

      res.json({ outreach });
    } catch (err: any) {
      console.error('Outreach generation error:', err);
      res.status(500).json({ error: err.message || 'Failed to generate outreach' });
    }
  });

  // Saved Leads CRM & Notes
  app.get('/api/leads', (req, res) => {
    const list = Array.from(store.savedLeads.values()).map(lead => {
      const biz = store.businesses.get(lead.businessId);
      return {
        ...lead,
        business: biz,
      };
    });
    res.json({ leads: list });
  });

  const saveLeadHandler = (req: express.Request, res: express.Response) => {
    try {
      const { businessId, campaignId, tags } = req.body;
      if (!businessId) return res.status(400).json({ error: 'businessId is required' });
      const lead = store.saveLead(businessId, campaignId, tags);
      res.json({ lead, business: store.businesses.get(businessId) });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  app.post('/api/leads', saveLeadHandler);
  app.post('/api/leads/save', saveLeadHandler);

  const updateLeadStatusHandler = (req: express.Request, res: express.Response) => {
    try {
      const businessId = req.params.businessId || req.params.id;
      const { status } = req.body;
      const lead = store.updateLeadStatus(businessId, status);
      res.json({ lead });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  app.patch('/api/leads/:businessId/status', updateLeadStatusHandler);
  app.patch('/api/leads/:businessId', updateLeadStatusHandler);

  const addLeadNoteHandler = (req: express.Request, res: express.Response) => {
    try {
      const businessId = req.params.businessId || req.params.id;
      const { text, author } = req.body;
      if (!text) return res.status(400).json({ error: 'Note text is required' });
      const note = store.addLeadNote(businessId, text, author || store.userProfile.name);
      res.json({ note, lead: store.savedLeads.get(businessId) });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  app.post('/api/leads/:businessId/notes', addLeadNoteHandler);

  // Activity Logs
  app.get('/api/activity', (req, res) => {
    res.json({ activities: store.activityLogs });
  });

  // 404 JSON fallback for all unmatched API routes
  app.all('/api/*', (req, res) => {
    res.status(404).json({ error: `API endpoint not found: ${req.method} ${req.path}` });
  });

  // -------------------------------------------------------------
  // VITE OR STATIC FRONTEND SERVING
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Opportunity Engine server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal server startup error:', err);
});
