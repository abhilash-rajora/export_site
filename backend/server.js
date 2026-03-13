const dns = require('node:dns');

// This check ensures we only override DNS during local development
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

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/enquiries', require('./routes/enquiryRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/seo', require('./routes/seoRoutes'));

app.get('/', (req, res) => res.send('Export Site API running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));