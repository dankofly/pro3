import type { ImageMetadata } from 'astro';
import { findImage } from '~/utils/images';
import sectionImagesData from '~/data/section-images.json';

export type SectionImageKey =
  | 'hero'
  | 'launchSites'
  | 'regions'
  | 'safety'
  | 'pricing'
  | 'howItWorks'
  | 'faq'
  | 'contact'
  | 'socialProof';

export type SectionImages = Record<SectionImageKey, ImageMetadata | undefined>;

/**
 * Load and resolve all section background images.
 * Empty strings in the JSON are treated as "no image set".
 * Returns ImageMetadata for set images (ready for Astro's getImage/Image),
 * or undefined for unset sections (component falls back to gradient).
 */
export async function loadSectionImages(): Promise<SectionImages> {
  const data = sectionImagesData as Record<string, string>;
  const keys: SectionImageKey[] = [
    'hero',
    'launchSites',
    'regions',
    'safety',
    'pricing',
    'howItWorks',
    'faq',
    'contact',
    'socialProof',
  ];

  const entries = await Promise.all(
    keys.map(async (key) => {
      const path = data[key];
      if (!path) return [key, undefined] as const;

      const resolved = await findImage(path);
      if (resolved && typeof resolved !== 'string') {
        return [key, resolved as ImageMetadata] as const;
      }
      return [key, undefined] as const;
    })
  );

  return Object.fromEntries(entries) as SectionImages;
}
