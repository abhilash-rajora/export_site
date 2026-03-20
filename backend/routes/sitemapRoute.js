// ============================================================
// backend/routes/sitemapRoute.js  (NEW FILE)
//
// Yeh route Express pe dynamic sitemap.xml serve karta hai
// jisme sab active products ke URLs automatically aa jaate hain.
//
// SETUP:
//   1. Is file ko backend/routes/ mein rakh do
//   2. server.js / app.js mein add karo:
//        const sitemapRoute = require('./routes/sitemapRoute');
//        app.use('/', sitemapRoute);
// ============================================================

const express = require('express');
const router  = express.Router();
const Product = require('../models/Product');

// Category label → URL slug map
const CATEGORY_SLUGS = {
  'Agriculture':      'agriculture',
  'Textiles':         'textiles',
  'Minerals':         'minerals',
  'Electronics':      'electronics',
  'Food & Beverages': 'food-beverages',
  'Handicrafts':      'handicrafts',
};

const BASE_URL   = 'https://wexports.vercel.app';
const TODAY      = new Date().toISOString().split('T')[0]; // e.g. 2026-03-20

router.get('/sitemap.xml', async (req, res) => {
  try {
    // Fetch all active products from MongoDB
    const products = await Product.find({ isActive: true }).select('_id updatedAt').lean();

    // ── Static pages ─────────────────────────────────────────
    const staticPages = [
      { url: '/',        changefreq: 'weekly',  priority: '1.0' },
      { url: '/about',   changefreq: 'monthly', priority: '0.7' },
      { url: '/enquiry', changefreq: 'monthly', priority: '0.7' },
      { url: '/terms',   changefreq: 'yearly',  priority: '0.3' },
      { url: '/products',changefreq: 'weekly',  priority: '0.9' },
    ];

    // ── Category pages ────────────────────────────────────────
    const categoryPages = Object.values(CATEGORY_SLUGS).map(slug => ({
      url: `/products/${slug}`,
      changefreq: 'weekly',
      priority: '0.8',
    }));

    // ── Product detail pages ──────────────────────────────────
    const productPages = products.map(p => ({
      url: `/products/detail/${p._id}`,
      lastmod: p.updatedAt ? new Date(p.updatedAt).toISOString().split('T')[0] : TODAY,
      changefreq: 'monthly',
      priority: '0.6',
    }));

    // ── Build XML ─────────────────────────────────────────────
    const urlEntries = [
      ...staticPages.map(p => `
  <url>
    <loc>${BASE_URL}${p.url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`),

      ...categoryPages.map(p => `
  <url>
    <loc>${BASE_URL}${p.url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`),

      ...productPages.map(p => `
  <url>
    <loc>${BASE_URL}${p.url}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`),
    ].join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour cache
    res.status(200).send(xml);

  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Sitemap generation failed');
  }
});

// ── robots.txt ────────────────────────────────────────────────────────────
router.get('/robots.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.send(`User-agent: *
Allow: /

Disallow: /wishlist
Disallow: /api/
Disallow: /admin/

Sitemap: ${BASE_URL}/sitemap.xml
`);
});

module.exports = router;