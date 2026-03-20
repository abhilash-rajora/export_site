// backend/routes/ogRoute.js
// ─────────────────────────────────────────────────────────────────
// WhatsApp/Facebook/LinkedIn ke liye product OG tags serve karta hai
// Jab koi /products/detail/:id share kare → backend sahi image return kare
//
// SETUP:
//   server.js mein add karo (sitemapRoute ke saath):
//     const ogRoute = require('./routes/ogRoute');
//     app.use('/', ogRoute);
// ─────────────────────────────────────────────────────────────────

const express = require('express');
const router  = express.Router();
const Product = require('../models/Product');

const BASE_URL   = 'https://wexports.vercel.app';
const SITE_NAME  = 'WExports';
const DEFAULT_IMG = `${BASE_URL}/favicon/apple-touch-icon.png`;

// ── Product detail page — WhatsApp/social ke liye ────────────────
// Route: GET /products/detail/:id
// WhatsApp is URL ko crawl karta hai → product image wala HTML milta hai
router.get('/products/detail/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .select('name description category images imageUrl isActive')
      .lean();

    // Product nahi mila ya inactive hai
    if (!product || !product.isActive) {
      return res.redirect(BASE_URL);
    }

    const title    = `${product.name} | ${product.category} Export India | ${SITE_NAME}`;
    const desc     = product.description?.split('\n')[0]?.slice(0, 160) ?? 
                     `Quality ${product.category} export from India. Verified supplier.`;
    const image    = product.images?.[0] ?? product.imageUrl ?? DEFAULT_IMG;
    const pageUrl  = `${BASE_URL}/products/detail/${req.params.id}`;

    // ── HTML with OG tags + instant JS redirect to React app ─────
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>${escHtml(title)}</title>
  <meta name="description" content="${escHtml(desc)}" />

  <!-- Open Graph — WhatsApp / Facebook / LinkedIn -->
  <meta property="og:type"        content="product" />
  <meta property="og:title"       content="${escHtml(title)}" />
  <meta property="og:description" content="${escHtml(desc)}" />
  <meta property="og:url"         content="${pageUrl}" />
  <meta property="og:image"       content="${escHtml(image)}" />
  <meta property="og:image:width"  content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name"   content="${SITE_NAME}" />

  <!-- Twitter Card -->
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="${escHtml(title)}" />
  <meta name="twitter:description" content="${escHtml(desc)}" />
  <meta name="twitter:image"       content="${escHtml(image)}" />

  <!-- Redirect to React app immediately (browser ke liye) -->
  <script>
    // Sirf real browsers redirect honge — crawlers nahi
    if (typeof window !== 'undefined' && navigator.userAgent &&
        !/(facebookexternalhit|Twitterbot|WhatsApp|LinkedInBot|Googlebot)/i.test(navigator.userAgent)) {
      window.location.href = '${pageUrl}';
    }
  </script>
</head>
<body>
  <h1>${escHtml(product.name)}</h1>
  <p>${escHtml(desc)}</p>
  <a href="${pageUrl}">View Product</a>
</body>
</html>`;

    // Cache 1 hour
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Content-Type', 'text/html');
    res.send(html);

  } catch (err) {
    console.error('OG route error:', err);
    res.redirect(BASE_URL);
  }
});

// ── HTML escape helper ────────────────────────────────────────────
function escHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

module.exports = router;