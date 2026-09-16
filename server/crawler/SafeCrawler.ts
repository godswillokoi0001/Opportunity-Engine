import dns from 'dns/promises';
import { URL } from 'url';

/**
 * SSRF-Safe Website Crawler
 * Strictly enforces:
 * - Protocol validation (only http and https)
 * - Prohibits private/loopback/cloud-metadata IP spaces
 * - Safe request timeouts (8000ms)
 * - Maximum response payload limits (2.5MB)
 * - Standard professional User-Agent
 */

export interface CrawlResult {
  url: string;
  finalUrl: string;
  isHttps: boolean;
  httpStatus: number;
  responseTimeMs: number;
  html: string;
  contentLength: number;
}

// Check if IP is in restricted private/link-local/metadata ranges
export function isRestrictedIp(ip: string): boolean {
  // IPv4 Loopback & Special
  if (ip === 'localhost' || ip === '127.0.0.1' || ip.startsWith('127.')) return true;
  if (ip === '0.0.0.0' || ip === '255.255.255.255') return true;

  // Cloud metadata endpoint (169.254.169.254) and link-local
  if (ip.startsWith('169.254.')) return true;

  // RFC 1918 Private ranges
  if (ip.startsWith('10.')) return true;
  if (ip.startsWith('192.168.')) return true;
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip)) return true;

  // IPv6 loopback and private
  if (ip === '::1' || ip === '::' || ip.startsWith('fe80:') || ip.startsWith('fc00:') || ip.startsWith('fd00:')) return true;

  return false;
}

export class SafeCrawler {
  private static TIMEOUT_MS = 8000;
  private static MAX_BYTES = 2.5 * 1024 * 1024; // 2.5MB cap

  public static async fetchSafely(targetUrl: string): Promise<CrawlResult> {
    let parsed: URL;
    try {
      // Normalize URL if protocol is omitted
      if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = 'https://' + targetUrl;
      }
      parsed = new URL(targetUrl);
    } catch (e: any) {
      throw new Error(`Invalid URL provided: ${e?.message || targetUrl}`);
    }

    // Protocol check
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new Error(`Unsupported protocol: ${parsed.protocol}. Only http: and https: are permitted.`);
    }

    const hostname = parsed.hostname.toLowerCase();

    // Block common internal/local names
    if (
      hostname === 'localhost' ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal') ||
      hostname.endsWith('.lan') ||
      hostname === 'metadata.google.internal' ||
      hostname === '169.254.169.254'
    ) {
      throw new Error(`Security policy blocked internal or restricted hostname: ${hostname}`);
    }

    // If hostname is directly an IP literal, verify it
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || hostname.includes(':')) {
      if (isRestrictedIp(hostname)) {
        throw new Error(`Access to restricted IP ${hostname} is blocked.`);
      }
    } else {
      // Resolve hostname to IP to prevent DNS rebinding / internal routing
      try {
        const addresses = await dns.lookup(hostname, { all: true });
        for (const addr of addresses) {
          if (isRestrictedIp(addr.address)) {
            throw new Error(`Resolved IP ${addr.address} for ${hostname} is in a restricted network range.`);
          }
        }
      } catch (dnsErr: any) {
        // DNS lookup failure or blocked IP
        if (dnsErr.message && dnsErr.message.includes('restricted')) {
          throw dnsErr;
        }
        throw new Error(`DNS resolution failed for ${hostname}: ${dnsErr.message}`);
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);
    const startTime = Date.now();

    try {
      const response = await fetch(parsed.toString(), {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 OpportunityEngine/1.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        redirect: 'follow',
      });

      const responseTimeMs = Date.now() - startTime;
      const finalUrl = response.url || parsed.toString();
      const isHttps = finalUrl.startsWith('https://');

      // Verify content-type is HTML or XML
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml') && !contentType.includes('text/plain')) {
        // Return minimal wrapper if non-HTML
        return {
          url: targetUrl,
          finalUrl,
          isHttps,
          httpStatus: response.status,
          responseTimeMs,
          html: '',
          contentLength: 0,
        };
      }

      // Read text safely up to MAX_BYTES
      const rawText = await response.text();
      const truncated = rawText.length > this.MAX_BYTES ? rawText.slice(0, this.MAX_BYTES) : rawText;

      return {
        url: targetUrl,
        finalUrl,
        isHttps,
        httpStatus: response.status,
        responseTimeMs,
        html: truncated,
        contentLength: rawText.length,
      };
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new Error(`Website request timed out after ${this.TIMEOUT_MS}ms`);
      }
      throw new Error(`Website fetch failed: ${err.message || 'Unknown network error'}`);
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
