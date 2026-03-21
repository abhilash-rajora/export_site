const dns = require('node:dns');

if (process.env.NODE_ENV !== 'production') {
  dns.setServers(['1.1.1.1', '8.8.8.8']);
  console.log('Local DNS fix applied: Using Google/Cloudflare DNS');
}

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://wexports.vercel.app',
  ],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ── API Routes ───────────────────────────────────────────────────
app.use('/api/products',  require('./routes/productRoutes'));
app.use('/api/enquiries', require('./routes/enquiryRoutes'));
app.use('/api/admin',     require('./routes/adminRoutes'));
app.use('/api/seo',       require('./routes/seoRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));

// ── OG tags (WhatsApp/social sharing ke liye) ────────────────────
app.use('/', require('./routes/ogRoute'));

// ── Sitemap + robots.txt ─────────────────────────────────────────
app.use('/', require('./routes/sitemapRoute'));

// ── Keep Alive (Render free tier sleep prevent karne ke liye) ────
app.get('/ping', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/', (req, res) => res.send('Export Site API running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));