import { GoogleGenAI } from '@google/genai';
import { Business, Opportunity, OutreachGeneration, UserProfile, WebsiteAudit } from '../../src/types.js';

export interface IAIProvider {
  explainOpportunity(
    business: Business,
    audit: WebsiteAudit | undefined,
    opportunity: Opportunity,
    sellingService: string
  ): Promise<{
    executiveSummary: string;
    commercialRationale: string;
    whyBuyNow: string;
    buyerPersona: string;
    recommendedPitchAngle: string;
  }>;

  generateOutreach(
    business: Business,
    opportunity: Opportunity,
    audit: WebsiteAudit | undefined,
    userProfile: UserProfile,
    angle: 'problem_solution' | 'value_audit' | 'consultative_inquiry',
    tone?: 'professional' | 'direct' | 'consultative'
  ): Promise<OutreachGeneration>;
}

export class GeminiAIProvider implements IAIProvider {
  private ai: GoogleGenAI | null = null;
  private modelName = 'gemini-3.8-flash';

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 0) {
      try {
        this.ai = new GoogleGenAI({ apiKey });
      } catch (e) {
        console.warn('Gemini AI initialization warning:', e);
      }
    }
  }

  public async explainOpportunity(
    business: Business,
    audit: WebsiteAudit | undefined,
    opportunity: Opportunity,
    sellingService: string
  ): Promise<{
    executiveSummary: string;
    commercialRationale: string;
    whyBuyNow: string;
    buyerPersona: string;
    recommendedPitchAngle: string;
  }> {
    // If Gemini is available, generate deep synthesized business analysis
    if (this.ai) {
      try {
        const prompt = `You are a senior B2B sales strategist and business analyst at an enterprise agency.
Analyze this business opportunity and produce an explainable, fact-grounded commercial intelligence report.

TARGET BUSINESS:
Name: ${business.name}
Industry: ${business.industry}
Location: ${business.location.city}, ${business.location.country}
Website: ${business.hasWebsite ? (business.websiteUrl || 'Yes') : 'No owned website'}

SELLING SERVICE OFFERED:
${sellingService}

DETERMINISTIC SIGNALS & AUDIT FINDINGS:
${audit ? `
- HTTPS: ${audit.isHttps ? 'Yes' : 'No'}
- Mobile Viewport Meta: ${audit.hasViewport ? 'Responsive configured' : 'MISSING (Fails mobile screens)'}
- CTAs Count: ${audit.ctaCount} (${audit.detectedCtas.join(', ') || 'None'})
- Contact Form: ${audit.hasLeadForm ? 'Present' : 'Missing'}
- Phone / Email Links: ${audit.hasPhoneLink ? 'Phone link present' : 'No direct tel:'}, ${audit.hasEmailLink ? 'Email link' : 'No mailto:'}
- Tech Stack: ${audit.detectedTech.join(', ') || 'Custom / Legacy'}
- Health Score: ${audit.deterministicHealthScore}/100
` : 'No website available. Relying on verified commercial registry and directory signals.'}

DETECTED OPPORTUNITY:
Type: ${opportunity.type}
Title: ${opportunity.title}
Observed Facts: ${opportunity.triad.observed.join(' | ')}
Inferred Impact: ${opportunity.triad.inferred.join(' | ')}

OUTPUT FORMAT:
Return strictly a valid JSON object matching this schema (no markdown fences, no code blocks):
{
  "executiveSummary": "Concise 2-sentence summary of why this business needs this service",
  "commercialRationale": "Why their current presence hurts their revenue, credibility, or conversion in their local market",
  "whyBuyNow": "Specific trigger or catalyst that makes approaching them timely right now",
  "buyerPersona": "The specific decision-maker role to target (e.g., Managing Director, Operations Head)",
  "recommendedPitchAngle": "Strategic framing to use in initial conversation"
}`;

        const response = await this.ai.models.generateContent({
          model: this.modelName,
          contents: prompt,
          config: {
            temperature: 0.2,
            responseMimeType: 'application/json',
          },
        });

        const text = response.text || '';
        const parsed = JSON.parse(text);
        return {
          executiveSummary: parsed.executiveSummary || `${business.name} operates in ${business.location.city} with demonstrated market presence but substantial conversion friction in their digital footprint.`,
          commercialRationale: parsed.commercialRationale || opportunity.triad.aiInterpretation,
          whyBuyNow: parsed.whyBuyNow || `Local peers in ${business.industry} are actively upgrading their direct acquisition channels, creating customer defection risks for slower movers.`,
          buyerPersona: parsed.buyerPersona || 'Managing Director / Commercial Lead',
          recommendedPitchAngle: parsed.recommendedPitchAngle || opportunity.recommendedAction,
        };
      } catch (err) {
        console.warn('Gemini opportunity explanation fallback invoked:', err);
      }
    }

    // High-quality deterministic fallback if Gemini key is not configured
    return {
      executiveSummary: `${business.name} is an established ${business.industry} enterprise in ${business.location.city}, yet its digital presence contains measurable gaps that hinder client acquisition.`,
      commercialRationale: opportunity.triad.aiInterpretation || `Without optimized digital touchpoints, high-value prospective clients looking for ${business.industry} services in ${business.location.city} experience friction when attempting to engage or request quotes.`,
      whyBuyNow: `Regional competitors are adopting frictionless mobile booking and modern web portals, making modernized digital touchpoints essential to protect market share.`,
      buyerPersona: 'Managing Director / Chief Executive Officer / Commercial Lead',
      recommendedPitchAngle: opportunity.recommendedAction,
    };
  }

  public async generateOutreach(
    business: Business,
    opportunity: Opportunity,
    audit: WebsiteAudit | undefined,
    userProfile: UserProfile,
    angle: 'problem_solution' | 'value_audit' | 'consultative_inquiry',
    tone: 'professional' | 'direct' | 'consultative' = 'consultative'
  ): Promise<OutreachGeneration> {
    if (this.ai) {
      try {
        const prompt = `You are a top 1% B2B copywriter and sales strategist writing a high-converting, personalized outreach email.
DO NOT write generic spam ("I hope you are doing well", "I was browsing your website").
The message MUST reference the EXACT verifiable findings and offer tangible commercial value.

SENDER:
Name: ${userProfile.name}
Agency: ${userProfile.agencyName}
Service: ${userProfile.primaryService}

RECIPIENT:
Company: ${business.name}
Industry: ${business.industry}
Location: ${business.location.city}, ${business.location.country}
Website: ${business.websiteUrl || 'No website'}

QUALIFIED OPPORTUNITY:
Title: ${opportunity.title}
Target Service: ${opportunity.targetService}
Observed Finding: ${opportunity.triad.observed.join('; ')}
Evidence: ${opportunity.evidence.map(e => `${e.metric}: ${e.finding}`).join(', ')}

ANGLE REQUIRED: ${angle} (Options: 'problem_solution' = lead with specific finding and fix; 'value_audit' = share concrete data points and revenue upside; 'consultative_inquiry' = concise executive query regarding their digital growth).
TONE: ${tone}

OUTPUT FORMAT:
Return strictly a valid JSON object matching this schema (no markdown, no code blocks):
{
  "subject": "Compelling, low-friction subject line (under 9 words, lowercase or sentence case)",
  "body": "The email body text with paragraph breaks. Keep under 140 words. Professional, clear, referencing specific details.",
  "callToAction": "Low-friction next step (e.g., 'Open to me sending a 2-minute video breakdown?')",
  "referencedEvidence": ["Array of exact findings mentioned in the copy"]
}`;

        const response = await this.ai.models.generateContent({
          model: this.modelName,
          contents: prompt,
          config: {
            temperature: 0.3,
            responseMimeType: 'application/json',
          },
        });

        const text = response.text || '';
        const parsed = JSON.parse(text);
        return {
          id: 'outreach_' + Math.random().toString(36).substring(2, 9),
          businessId: business.id,
          angle,
          subject: parsed.subject || `Quick question regarding ${business.name}'s digital client inquiries`,
          body: parsed.body || `Hi team at ${business.name},\n\nI was reviewing ${business.industry} operations in ${business.location.city} and noticed your site isn't fully adapted for mobile client inquiries. We recently helped similar providers streamline inbound quote requests.\n\nWould you be open to a 2-minute breakdown of what we found?`,
          callToAction: parsed.callToAction || 'Open to a brief 2-minute comparison?',
          referencedEvidence: parsed.referencedEvidence || opportunity.triad.observed,
          generatedAt: new Date().toISOString(),
        };
      } catch (err) {
        console.warn('Gemini outreach generation fallback invoked:', err);
      }
    }

    // High-touch deterministic fallback tailored to angle
    let subject = '';
    let body = '';
    let callToAction = '';
    const observedStr = opportunity.triad.observed[0] || 'your current digital client path';

    if (angle === 'problem_solution') {
      subject = `Quick note on ${business.name}'s digital presence`;
      body = `Hi ${business.name} team,\n\nWhile analyzing ${business.industry.toLowerCase()} providers in ${business.location.city}, I noticed a specific barrier: ${observedStr.toLowerCase()}.\n\nFor potential clients browsing your services, this creates friction before they can get in touch or request pricing.\n\nWe specialize in ${userProfile.primaryService.toLowerCase()} that turns passive visitors into qualified commercial inquiries.`;
      callToAction = 'Would you be against me sending over a 2-minute walkthrough of how to resolve this?';
    } else if (angle === 'value_audit') {
      subject = `Audit insight for ${business.name}`;
      body = `Hi ${business.name} leadership,\n\nWe recently completed a benchmark of ${business.industry.toLowerCase()} platforms across ${business.location.city}.\n\nYour business clearly has strong operational standing, but our audit flagged: ${opportunity.evidence.map(e => e.metric + ' (' + e.finding + ')').slice(0, 2).join(' and ')}.\n\nFixing these points typically results in a noticeable lift in inbound quote requests without increasing marketing spend.`;
      callToAction = 'Happy to share the full 1-page benchmark if useful?';
    } else {
      subject = `${business.name} + ${business.industry} inquiries in ${business.location.city}`;
      body = `Hi ${business.name} team,\n\nReaching out directly as we work with several ${business.industry.toLowerCase()} leaders across ${business.location.city} on ${userProfile.primaryService.toLowerCase()}.\n\nI took a look at ${business.websiteUrl ? business.websiteUrl : 'your public presence'} and noted that ${opportunity.triad.inferred[0] || 'there is an opportunity to expand direct client lead capture'}.\n\nAre you currently looking to upgrade your digital client acquisition this quarter?`;
      callToAction = 'Let me know if you have 5 minutes for a quick chat next Tuesday.';
    }

    return {
      id: 'outreach_' + Math.random().toString(36).substring(2, 9),
      businessId: business.id,
      angle,
      subject,
      body,
      callToAction,
      referencedEvidence: opportunity.triad.observed,
      generatedAt: new Date().toISOString(),
    };
  }
}
