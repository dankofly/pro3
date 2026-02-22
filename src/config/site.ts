/**
 * Site Configuration – Operator fills in business details here.
 * TODO markers indicate values the operator must set before going live.
 */

export const siteConfig = {
  site: {
    name: 'Tandemflug Lienz',
    url: 'https://tandemflug-lienz.com',
    defaultLocale: 'de' as const,
    locales: ['de', 'en', 'nl'] as const,
  },

  /** Main site for CTA referrals */
  mainSite: {
    url: 'https://gleitschirm-tandemflug.com',
    name: 'gleitschirm-tandemflug.com',
  },

  /** UTM parameters appended to all main-site CTAs */
  utm: {
    source: 'tandemflug-lienz.com',
    medium: 'referral',
    campaign: 'osttirol-lp',
  },

  /** Business contact details */
  contact: {
    phone: '+43 676 7293888',
    whatsapp: '+43 676 7293888',
    email: 'info@Gleitschirm-Tandemflug.com',
  },

  /** Legal entity / NAP data */
  legal: {
    companyName: 'Gleitschirm-Tandemflug.com',
    address: {
      street: 'Unterassling 29',
      zip: '9911',
      city: 'Assling',
      country: 'Österreich',
    },
    vatId: '',
    registerNumber: '',
  },

  /** Google Maps directions link */
  mapsUrl: 'https://maps.app.goo.gl/ywpKPXwKkuotoU5BA',

  /** Social media links */
  social: {
    instagram: 'https://www.instagram.com/tandemfluglienz/',
    facebook: '',
    youtube: '',
  },

  /** Google Search Console verification ID */
  googleSiteVerification: '',
} as const;

/**
 * Build a URL to the main site with UTM tracking parameters.
 * @param ctaId - identifies which CTA was clicked (e.g. "hero-primary", "sticky-bar")
 * @param locale - current page language
 * @param path - path on main site (default: "/")
 */
export function buildMainSiteUrl(
  ctaId: string,
  locale: string,
  path: string = '/'
): string {
  const params = new URLSearchParams({
    utm_source: siteConfig.utm.source,
    utm_medium: siteConfig.utm.medium,
    utm_campaign: siteConfig.utm.campaign,
    utm_content: ctaId,
    utm_term: locale,
  });
  return `${siteConfig.mainSite.url}${path}?${params.toString()}`;
}
