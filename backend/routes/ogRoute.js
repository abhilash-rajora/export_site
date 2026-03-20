const express = require('express');
const router  = express.Router();
const Product = require('../models/Product');

const BASE_URL    = 'https://wexports.vercel.app';
const SITE_NAME   = 'WExports';
const DEFAULT_IMG = `${BASE_URL}/favicon/apple-touch-icon.png`;

const BOT_AGENTS = /facebookexternalhit|Twitterbot|WhatsApp|LinkedInBot|Googlebot|Slackbot|TelegramBot|Discordbot|Pinterest|Applebot/i;

router.get('/products/detail/:id', async (req, res) => {
  const userAgent = req.headers['user-agent'] ?? '';

  // Normal browser → React app pe redirect
  if (!BOT_AGENTS.test(userAgent)) {
    return res.redirect(301, `${BASE_URL}/products/detail/${req.params.id}`);
  }

  // Bot → OG tags wala HTML
  try {
    const product = await Product.findById(req.params.id)
      .select('name description category images imageUrl isActive')
      .lean();

    if (!product || !product.isActive) {
      return res.redirect(BASE_URL);
    }

    const title   = `${product.name} | ${product.category} Export India | ${SITE_NAME}`;
    const desc    = product.description?.split('\n')[0]?.slice(0, 160) ??
                    `Quality ${product.category} export from India. Verified supplier.`;
    const image   = product.images?.[0] ?? product.imageUrl ?? DEFAULT_IMG;
    const pageUrl = `${BASE_URL}/products/detail/${req.params.id}`;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escHtml(title)}</title>
  <meta name="description" content="${escHtml(desc)}" />
  <meta property="og:type"         content="product" />
  <meta property="og:title"        content="${escHtml(title)}" />
  <meta property="og:description"  content="${escHtml(desc)}" />
  <meta property="og:url"          content="${pageUrl}" />
  <meta property="og:image"        content="${escHtml(image)}" />
  <meta property="og:image:width"  content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name"    content="${SITE_NAME}" />
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="${escHtml(title)}" />
  <meta name="twitter:description" content="${escHtml(desc)}" />
  <meta name="twitter:image"       content="${escHtml(image)}" />
</head>
<body>
  <h1>${escHtml(product.name)}</h1>
  <p>${escHtml(desc)}</p>
  <a href="${pageUrl}">View Product on WExports</a>
</body>
</html>`;

    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Content-Type', 'text/html');
    return res.send(html);

  } catch (err) {
    console.error('OG route error:', err);
    return res.redirect(BASE_URL);
  }
});

function escHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

module.exports = router;