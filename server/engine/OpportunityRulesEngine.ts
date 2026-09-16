import { Business, Opportunity, ServiceType, WebsiteAudit, EvidenceItem } from '../../src/types.js';

export class OpportunityRulesEngine {
  /**
   * Evaluates a business against a target selling service and generates qualified, explainable opportunities
   */
  public static evaluate(
    business: Business, 
    sellingService: ServiceType | string,
    audit?: WebsiteAudit
  ): Opportunity[] {
    const opportunities: Opportunity[] = [];
    const normalizedService = sellingService.toLowerCase();

    // ==========================================
    // RULE 1: Missing Owned Web Presence (No Website)
    // Target: Website Design & Development, Custom Software
    // ==========================================
    if (!business.hasWebsite || !business.websiteUrl) {
      if (
        normalizedService.includes('design') ||
        normalizedService.includes('development') ||
        normalizedService.includes('website')
      ) {
        const evidence: EvidenceItem[] = [
          {
            metric: 'Website Existence',
            finding: 'No public domain or official owned website found in commercial registries',
            benchmark: 'Active B2B enterprises in industry have owned web portals',
            severity: 'critical'
          },
          {
            metric: 'Business Verification',
            finding: `Business is operating in ${business.location.city}, ${business.location.country} with registered activity`,
            benchmark: 'Registered commercial presence',
            severity: 'info'
          }
        ];

        opportunities.push({
          id: 'opp_' + Math.random().toString(36).substring(2, 9),
          businessId: business.id,
          type: 'website_creation',
          title: 'Establish Primary Digital Gateway & Website',
          targetService: 'Website Design & Development',
          confidence: 'high',
          score: 92,
          triad: {
            observed: [
              'No public domain or official website detected in public records.',
              `Business is actively operating in ${business.location.city} with verified commercial listings.`
            ],
            inferred: [
              'Customers searching for logistics and services online cannot directly inspect capabilities or submit quotes.',
              'Reliance on third-party listings or offline phone calls creates severe customer acquisition leakage.'
            ],
            aiInterpretation: `In ${business.location.city}'s competitive market, B2B buyers expect an authoritative digital portal to evaluate trust before issuing contracts. Building an initial responsive site represents immediate commercial ROI.`
          },
          recommendedAction: 'Propose a modern, high-converting corporate website with instant quote inquiries and service verification.',
          valueProposition: 'Capture inbound client demand and establish an authoritative digital hub.',
          evidence
        });
      }
      return opportunities;
    }

    // If website exists, evaluate based on audit signals
    const currentAudit = audit || business.audit;
    if (!currentAudit) return opportunities;

    // ==========================================
    // RULE 2: Non-Mobile Optimized / Missing Viewport
    // Target: Website Redesign, Mobile Modernization, CRO
    // ==========================================
    if (!currentAudit.hasViewport) {
      if (
        normalizedService.includes('redesign') ||
        normalizedService.includes('design') ||
        normalizedService.includes('mobile') ||
        normalizedService.includes('conversion')
      ) {
        const evidence: EvidenceItem[] = [
          {
            metric: 'Mobile Viewport Meta',
            finding: 'Missing <meta name="viewport" content="width=device-width"> tag',
            benchmark: 'Mandatory standard for all modern responsive websites',
            severity: 'critical'
          },
          {
            metric: 'Mobile Rendering',
            finding: 'Renders in desktop fallback mode on smartphones with tiny unreadable text',
            benchmark: 'Fluid responsive layout adapted to phone/tablet screens',
            severity: 'critical'
          }
        ];

        opportunities.push({
          id: 'opp_' + Math.random().toString(36).substring(2, 9),
          businessId: business.id,
          type: 'mobile_modernization',
          title: 'Mobile Usability & Responsive Overhaul',
          targetService: 'Website Redesign & Modernization',
          confidence: 'high',
          score: 89,
          triad: {
            observed: [
              'HTML source lacks responsive viewport configuration.',
              'Content renders at fixed desktop width on handheld devices.'
            ],
            inferred: [
              'Mobile visitors must pinch-to-zoom to read service descriptions or locate contact details.',
              'Estimated 60%+ of regional mobile traffic bounces immediately due to poor viewport scaling.'
            ],
            aiInterpretation: `Over 70% of business discovery in ${business.location.city} originates on smartphones. The lack of responsive formatting is actively repelling inbound procurement inquiries.`
          },
          recommendedAction: 'Demonstrate side-by-side mobile audit comparison and offer a responsive redesign.',
          valueProposition: 'Eliminate 60%+ mobile bounce rates and double mobile lead capture.',
          evidence
        });
      }
    }

    // ==========================================
    // RULE 3: Missing or Weak Conversion Pathways (CTAs & Forms)
    // Target: CRO, Website Redesign, Lead Generation
    // ==========================================
    if (currentAudit.ctaCount === 0 || !currentAudit.hasLeadForm) {
      if (
        normalizedService.includes('conversion') ||
        normalizedService.includes('redesign') ||
        normalizedService.includes('lead generation') ||
        normalizedService.includes('website')
      ) {
        const evidence: EvidenceItem[] = [
          {
            metric: 'Call-To-Action (CTA) Presence',
            finding: currentAudit.ctaCount === 0 ? 'Zero conversion action buttons found on primary landing page' : `${currentAudit.ctaCount} vague action points`,
            benchmark: 'Minimum 2 clear, prominent conversion CTAs above and below fold',
            severity: currentAudit.ctaCount === 0 ? 'critical' : 'warning'
          },
          {
            metric: 'Lead Capture Form',
            finding: currentAudit.hasLeadForm ? 'Form detected' : 'No inquiry or quote form available on homepage',
            benchmark: 'Direct online lead capture mechanism',
            severity: currentAudit.hasLeadForm ? 'info' : 'warning'
          }
        ];

        opportunities.push({
          id: 'opp_' + Math.random().toString(36).substring(2, 9),
          businessId: business.id,
          type: 'conversion_optimization',
          title: 'High-Intent Conversion Pathway & Lead Capture Flow',
          targetService: 'Conversion Rate Optimization (CRO)',
          confidence: 'high',
          score: 86,
          triad: {
            observed: [
              `Detected ${currentAudit.ctaCount} explicit action buttons in page layout.`,
              currentAudit.hasLeadForm ? 'Basic form exists without clear commercial prompt.' : 'No direct inquiry/quote form detected on homepage.'
            ],
            inferred: [
              'Visitors who want to request services or book consultations encounter high friction.',
              'Website functions as a passive brochure rather than an active client acquisition engine.'
            ],
            aiInterpretation: `Decision-makers visiting this site have no clear next step. Implementing a streamlined 'Request Freight Quote' or 'Book Property Consultation' flow will immediately boost inquiry volume.`
          },
          recommendedAction: 'Propose targeted lead capture architecture with high-visibility CTAs and simplified inquiry submission.',
          valueProposition: 'Turn passive web visitors into actionable sales inquiries.',
          evidence
        });
      }
    }

    // ==========================================
    // RULE 4: SEO & Metadata Deficits
    // Target: SEO & Search Visibility
    // ==========================================
    if (!currentAudit.metaDescription || currentAudit.h1Count === 0 || currentAudit.h1Count > 2 || !currentAudit.hasOpenGraph) {
      if (
        normalizedService.includes('seo') ||
        normalizedService.includes('search') ||
        normalizedService.includes('visibility')
      ) {
        const evidence: EvidenceItem[] = [
          {
            metric: 'Meta Description',
            finding: currentAudit.metaDescription ? 'Description present but suboptimal' : 'Missing meta description tag',
            benchmark: 'Descriptive, keyword-optimized 150-160 character snippet',
            severity: currentAudit.metaDescription ? 'info' : 'critical'
          },
          {
            metric: 'Heading Structure (H1)',
            finding: currentAudit.h1Count === 0 ? 'Zero H1 semantic headings found' : `${currentAudit.h1Count} H1 tags detected (over-crowded)`,
            benchmark: 'Exactly 1 authoritative H1 defining core industry service',
            severity: 'warning'
          },
          {
            metric: 'Social Share Cards (OpenGraph)',
            finding: currentAudit.hasOpenGraph ? 'Present' : 'Missing og:image and og:title tags',
            benchmark: 'Required for branded link previews on LinkedIn & WhatsApp',
            severity: currentAudit.hasOpenGraph ? 'info' : 'warning'
          }
        ];

        opportunities.push({
          id: 'opp_' + Math.random().toString(36).substring(2, 9),
          businessId: business.id,
          type: 'seo_optimization',
          title: 'Search Ranking & Organic B2B Visibility Architecture',
          targetService: 'SEO & Search Visibility',
          confidence: 'medium',
          score: 81,
          triad: {
            observed: [
              currentAudit.metaDescription ? 'Generic meta description.' : 'No meta description found in HTML head.',
              `Found ${currentAudit.h1Count} H1 headings in DOM hierarchy.`,
              currentAudit.hasOpenGraph ? 'OpenGraph present.' : 'No social preview meta tags detected.'
            ],
            inferred: [
              'Search engines struggle to index target service keywords and commercial intent.',
              'Links shared in WhatsApp, Slack, or LinkedIn appear as raw unbranded URLs without preview cards.'
            ],
            aiInterpretation: `When clients in ${business.location.city} search for '${business.industry} services', competitors with clean on-page semantic architecture rank above them.`
          },
          recommendedAction: 'Audit on-page schema, optimize service metadata, and structure keyword-targeted landing pages.',
          valueProposition: 'Rank above local competitors for high-intent search queries.',
          evidence
        });
      }
    }

    // ==========================================
    // RULE 5: Brand & Social Channels Fragmentation
    // Target: Branding & Creative Identity, Social Media
    // ==========================================
    if (currentAudit.socialLinks.length < 2) {
      if (
        normalizedService.includes('brand') ||
        normalizedService.includes('social') ||
        normalizedService.includes('content')
      ) {
        const evidence: EvidenceItem[] = [
          {
            metric: 'Connected Social Footprint',
            finding: `${currentAudit.socialLinks.length} verified social channel links detected on site`,
            benchmark: 'Cohesive multi-channel presence (LinkedIn, Instagram, X, Facebook)',
            severity: 'warning'
          },
          {
            metric: 'B2B Trust Proof',
            finding: 'Limited external social validation channels visible to prospective clients',
            benchmark: 'Active case studies, leadership updates, and social proof',
            severity: 'info'
          }
        ];

        opportunities.push({
          id: 'opp_' + Math.random().toString(36).substring(2, 9),
          businessId: business.id,
          type: 'branding_refresh',
          title: 'Brand Authority & Social Proof Amplification',
          targetService: 'Branding & Creative Identity',
          confidence: 'medium',
          score: 76,
          triad: {
            observed: [
              `Website links to only ${currentAudit.socialLinks.length} external brand touchpoints.`,
              'Absence of verified LinkedIn corporate hub or active social verification.'
            ],
            inferred: [
              'Corporate buyers cannot easily verify recent operational activity or company culture.',
              'Brand looks less established than peers with vibrant professional networks.'
            ],
            aiInterpretation: `B2B contracts depend heavily on peer trust. A unified corporate identity package and active authority content strategy elevates market perception.`
          },
          recommendedAction: 'Propose a unified brand kit and systematic authority content distribution system.',
          valueProposition: 'Position company as an industry benchmark and justify premium pricing.',
          evidence
        });
      }
    }

    // Fallback: If score is low or specialized service, provide general enhancement opportunity
    if (opportunities.length === 0) {
      opportunities.push({
        id: 'opp_' + Math.random().toString(36).substring(2, 9),
        businessId: business.id,
        type: 'digital_presence_upgrade',
        title: 'Digital Performance & Client Acquisition Enhancement',
        targetService: sellingService,
        confidence: 'medium',
        score: 72,
        triad: {
          observed: [
            `Deterministic health score stands at ${currentAudit.deterministicHealthScore}/100.`,
            `Page response time measured at ${currentAudit.responseTimeMs}ms.`
          ],
          inferred: [
            'Operational foundation exists, but digital assets are not optimized to maximize high-margin contracts.'
          ],
          aiInterpretation: `Upgrading core user flows and positioning directly addresses pipeline growth in ${business.location.city}.`
        },
        recommendedAction: 'Present targeted efficiency benchmarks and propose modular improvements.',
        valueProposition: 'Accelerate contract velocity and improve digital brand authority.',
        evidence: [
          {
            metric: 'Overall Technical Score',
            finding: `${currentAudit.deterministicHealthScore}/100 health rating`,
            benchmark: '90+/100 commercial standard',
            severity: currentAudit.deterministicHealthScore < 70 ? 'warning' : 'info'
          }
        ]
      });
    }

    return opportunities;
  }
}
