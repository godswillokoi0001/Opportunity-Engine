import * as cheerio from 'cheerio';
import { WebsiteAudit } from '../../src/types.js';
import { CrawlResult } from '../crawler/SafeCrawler.js';

export class DeterministicAuditor {
  public static audit(crawl: CrawlResult, businessId: string): WebsiteAudit {
    const { html, finalUrl, isHttps, httpStatus, responseTimeMs } = crawl;
    const $ = cheerio.load(html);

    // 1. Title & Meta
    const pageTitle = ($('title').first().text() || '').trim();
    const metaDescription = ($('meta[name="description"]').attr('content') || 
      $('meta[property="og:description"]').attr('content') || '').trim();

    // 2. Viewport
    const viewportContent = $('meta[name="viewport"]').attr('content') || '';
    const hasViewport = viewportContent.toLowerCase().includes('width=device-width');

    // 3. Headings
    const h1Count = $('h1').length;
    const h2Count = $('h2').length;

    // 4. CTAs (Buttons and links with action intent)
    const ctaKeywords = [
      'quote', 'book', 'demo', 'consult', 'contact us', 'get started', 
      'request', 'schedule', 'call', 'hire', 'order', 'talk to', 'inquire',
      'free estimate', 'get in touch'
    ];
    const detectedCtas: string[] = [];

    $('a, button, input[type="submit"]').each((_, el) => {
      const text = $(el).text().trim() || $(el).attr('value') || '';
      const lower = text.toLowerCase();
      if (text.length > 2 && text.length < 50) {
        if (ctaKeywords.some(k => lower.includes(k))) {
          if (!detectedCtas.includes(text) && detectedCtas.length < 8) {
            detectedCtas.push(text);
          }
        }
      }
    });

    const ctaCount = detectedCtas.length;

    // 5. Contact Accessibility
    let hasPhoneLink = false;
    let hasEmailLink = false;
    let hasContactPage = false;
    let hasLeadForm = $('form').length > 0;

    $('a').each((_, el) => {
      const href = ($(el).attr('href') || '').trim();
      const text = $(el).text().toLowerCase();

      if (href.startsWith('tel:')) hasPhoneLink = true;
      if (href.startsWith('mailto:')) hasEmailLink = true;
      if (
        href.toLowerCase().includes('contact') || 
        text.includes('contact') || 
        href.toLowerCase().includes('/get-in-touch')
      ) {
        hasContactPage = true;
      }
    });

    // 6. Social Links
    const socialPlatforms = [
      { name: 'LinkedIn', match: 'linkedin.com' },
      { name: 'Twitter / X', match: 'twitter.com' },
      { name: 'Twitter / X', match: 'x.com' },
      { name: 'Instagram', match: 'instagram.com' },
      { name: 'Facebook', match: 'facebook.com' },
      { name: 'YouTube', match: 'youtube.com' },
      { name: 'WhatsApp', match: 'wa.me' },
    ];

    const socialLinks: Array<{ platform: string; url: string }> = [];
    const seenPlatforms = new Set<string>();

    $('a[href]').each((_, el) => {
      const href = ($(el).attr('href') || '').trim();
      for (const p of socialPlatforms) {
        if (href.includes(p.match) && !seenPlatforms.has(p.name)) {
          seenPlatforms.add(p.name);
          socialLinks.push({ platform: p.name, url: href });
        }
      }
    });

    // 7. OpenGraph
    const hasOpenGraph = $('meta[property^="og:"]').length > 0;

    // 8. Performance & Assets
    const scriptCount = $('script[src]').length;
    const stylesheetCount = $('link[rel="stylesheet"]').length;

    // 9. Detected Tech Signatures
    const detectedTech: string[] = [];
    const htmlLower = html.toLowerCase();

    if (htmlLower.includes('wp-content') || htmlLower.includes('wordpress')) detectedTech.push('WordPress');
    if (htmlLower.includes('shopify.com') || htmlLower.includes('cdn.shopify.com')) detectedTech.push('Shopify');
    if (htmlLower.includes('webflow.com') || htmlLower.includes('data-wf-page')) detectedTech.push('Webflow');
    if (htmlLower.includes('wix.com') || htmlLower.includes('wix-image')) detectedTech.push('Wix');
    if (htmlLower.includes('squarespace.com')) detectedTech.push('Squarespace');
    if (htmlLower.includes('next/font') || htmlLower.includes('__next')) detectedTech.push('Next.js');
    if (htmlLower.includes('gtm.js') || htmlLower.includes('googletagmanager')) detectedTech.push('Google Tag Manager');
    if (htmlLower.includes('google-analytics.com') || htmlLower.includes('gtag(')) detectedTech.push('Google Analytics');
    if (htmlLower.includes('elementor')) detectedTech.push('Elementor');
    if (htmlLower.includes('bootstrap')) detectedTech.push('Bootstrap');
    if (htmlLower.includes('tailwind')) detectedTech.push('Tailwind CSS');

    // 10. Broken internal links safety heuristic
    let brokenLinksFound = 0;
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href') || '';
      if (href === '#' || href === 'javascript:void(0)' || href === 'undefined') {
        brokenLinksFound++;
      }
    });

    // 11. Deterministic Health Score Calculation (0-100)
    let score = 100;
    if (!isHttps) score -= 25;
    if (!hasViewport) score -= 20;
    if (!pageTitle || pageTitle.length < 5) score -= 10;
    if (!metaDescription || metaDescription.length < 20) score -= 10;
    if (h1Count === 0) score -= 10;
    if (h1Count > 3) score -= 5;
    if (ctaCount === 0) score -= 15;
    if (!hasContactPage && !hasPhoneLink && !hasEmailLink) score -= 15;
    if (!hasOpenGraph) score -= 5;
    if (responseTimeMs > 2500) score -= 10;

    const deterministicHealthScore = Math.max(10, Math.min(100, score));

    return {
      id: 'audit_' + Math.random().toString(36).substring(2, 9),
      businessId,
      url: finalUrl,
      status: 'completed',
      isHttps,
      httpStatus,
      responseTimeMs,
      pageTitle: pageTitle || undefined,
      metaDescription: metaDescription || undefined,
      hasViewport,
      h1Count,
      h2Count,
      ctaCount,
      detectedCtas,
      hasContactPage,
      hasPhoneLink,
      hasEmailLink,
      hasLeadForm,
      socialLinks,
      hasOpenGraph,
      pageSizeBytes: crawl.contentLength,
      scriptCount,
      stylesheetCount,
      detectedTech,
      brokenLinksFound,
      deterministicHealthScore,
      auditedAt: new Date().toISOString(),
    };
  }
}
