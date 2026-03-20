// hooks/useSeo.ts
// ─────────────────────────────────────────────────────────────────
// Smart SEO Hook:
//   - Static pages (home, products, about, terms):
//       Admin panel ki values fetch karo → nahi mili toh fallback use karo
//   - Dynamic pages (product detail, category):
//       Sirf fallback/automatic values use karo (no API call)
// ─────────────────────────────────────────────────────────────────

import { useEffect } from 'react';
import api from '../api/axios';

interface SeoOptions {
  title:       string;   // fallback title (agar admin ne set nahi kiya)
  description: string;   // fallback description
  keywords?:   string;   // fallback keywords
  canonical?:  string;   // canonical URL
  ogImage?:    string;   // og:image (product image etc.)
  noindex?:    boolean;  // true karo wishlist/admin pages ke liye
}

// Pages jinke liye admin SEO panel kaam karta hai
const ADMIN_SEO_PAGES = ['home', 'products', 'about', 'terms'];

const BASE_URL = 'https://wexports.vercel.app';

// ── DOM helpers ──────────────────────────────────────────────────
function setMeta(attr: string, attrVal: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${attrVal}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, attrVal);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

// ── Apply all SEO tags ───────────────────────────────────────────
function applySeo(opts: SeoOptions) {
  const canonical = opts.canonical ?? (BASE_URL + window.location.pathname);

  document.title = opts.title;
  setMeta('name', 'description', opts.description);
  if (opts.keywords) setMeta('name', 'keywords', opts.keywords);
  setMeta('name', 'robots', opts.noindex ? 'noindex, nofollow' : 'index, follow');
  setLink('canonical', canonical);

  // Open Graph — WhatsApp / LinkedIn / Facebook preview
  setMeta('property', 'og:title',       opts.title);
  setMeta('property', 'og:description', opts.description);
  setMeta('property', 'og:url',         canonical);
  setMeta('property', 'og:type',        'website');
  setMeta('property', 'og:site_name',   'WExports');
  if (opts.ogImage) setMeta('property', 'og:image', opts.ogImage);
}

// ── Main hook ────────────────────────────────────────────────────
export default function useSeo(page: string, options: SeoOptions) {
  useEffect(() => {
    // Step 1: Fallback values turant apply karo (no flash/delay)
    applySeo(options);

    // Step 2: Agar admin SEO page hai toh backend se fetch karo
    // Admin ki values milne pe override ho jaayengi
    if (!ADMIN_SEO_PAGES.includes(page)) return;

    const fetchAdminSeo = async () => {
      try {
        const res = await api.get(`/seo/${page}`);
        if (!res.data) return;

        // Admin values se override karo (sirf jo admin ne set ki hain)
        applySeo({
          title:       res.data.title       || options.title,
          description: res.data.description || options.description,
          keywords:    res.data.keywords    || options.keywords,
          canonical:   options.canonical,   // canonical hamesha code se hi aata hai
          ogImage:     options.ogImage,
          noindex:     options.noindex,
        });
      } catch {
        // API fail → fallback values already set hain, kuch karna nahi
      }
    };

    fetchAdminSeo();

  }, [page, options.title, options.description, options.canonical, options.ogImage]);
}