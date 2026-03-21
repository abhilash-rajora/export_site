// backend/controllers/commentController.js
// Like only — comments removed

const BlogLike = require('../models/BlogLike');

// Rate limiter
const rateLimitMap = new Map();
function isRateLimited(key, max = 10, windowMs = 60 * 1000) {
  const now = Date.now();
  const rec = rateLimitMap.get(key) || { count: 0, start: now };
  if (now - rec.start > windowMs) { rateLimitMap.set(key, { count: 1, start: now }); return false; }
  if (rec.count >= max) return true;
  rec.count++;
  rateLimitMap.set(key, rec);
  return false;
}

// GET /api/comments/like/:blogId
const getLikeStatus = async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || 'unknown';
    const [liked, count] = await Promise.all([
      BlogLike.exists({ blog: req.params.blogId, ip }),
      BlogLike.countDocuments({ blog: req.params.blogId }),
    ]);
    res.json({ liked: !!liked, count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/comments/like/:blogId
const toggleLike = async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || 'unknown';
    const blogId = req.params.blogId;

    if (isRateLimited(`like:${ip}`)) {
      return res.status(429).json({ message: 'Too many requests' });
    }

    const existing = await BlogLike.findOne({ blog: blogId, ip });
    if (existing) {
      await BlogLike.deleteOne({ _id: existing._id });
      const count = await BlogLike.countDocuments({ blog: blogId });
      return res.json({ liked: false, count });
    }

    await BlogLike.create({ blog: blogId, ip, userAgent: req.headers['user-agent'] });
    const count = await BlogLike.countDocuments({ blog: blogId });
    res.json({ liked: true, count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getLikeStatus, toggleLike };