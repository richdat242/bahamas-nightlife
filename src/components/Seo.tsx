import { useEffect } from 'react';

const ORIGIN = 'https://nassaunights.com';
const DEFAULT_TITLE = 'Nassau Nights — Bars, clubs & events in Nassau';
const DEFAULT_DESCRIPTION = 'Discover Nassau nightlife, bars, clubs and upcoming events. Find out what is happening tonight.';
type Props = {
  title?: string;
  description?: string;
  path: string;
  image?: string | null;
  structuredData?: Record<string, unknown> | null;
};

function meta(attribute: 'name' | 'property', key: string, content: string) {
  let node = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!node) {
    node = document.createElement('meta');
    node.setAttribute(attribute, key);
    document.head.appendChild(node);
  }
  node.content = content;
}

export function Seo({ title = DEFAULT_TITLE, description = DEFAULT_DESCRIPTION, path, image, structuredData }: Props) {
  const schema = structuredData ? JSON.stringify(structuredData) : null;
  useEffect(() => {
    const canonical = new URL(path, ORIGIN).href;
    document.title = title;
    meta('name', 'description', description);
    meta('property', 'og:title', title);
    meta('property', 'og:description', description);
    meta('property', 'og:url', canonical);
    meta('property', 'og:type', structuredData?.['@type'] === 'Event' ? 'event' : 'website');
    meta('name', 'twitter:card', image ? 'summary_large_image' : 'summary');
    meta('name', 'twitter:title', title);
    meta('name', 'twitter:description', description);
    if (image) {
      meta('property', 'og:image', new URL(image, ORIGIN).href);
      meta('name', 'twitter:image', new URL(image, ORIGIN).href);
    } else {
      document.head.querySelector('meta[property="og:image"]')?.remove();
      document.head.querySelector('meta[name="twitter:image"]')?.remove();
    }
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = canonical;
    document.head.querySelector('script[data-nassau-seo="structured-data"]')?.remove();
    if (schema) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.dataset.nassauSeo = 'structured-data';
      script.textContent = schema;
      document.head.appendChild(script);
    }
    return () => {
      document.head.querySelector('script[data-nassau-seo="structured-data"]')?.remove();
    };
  }, [title, description, path, image, schema]);
  return null;
}
