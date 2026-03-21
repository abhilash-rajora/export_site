// backend/models/BlogLike.js

const mongoose = require('mongoose');

const blogLikeSchema = new mongoose.Schema(
  {
    blog:      { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
    ip:        { type: String, required: true },
    userAgent: { type: String },
  },
  { timestamps: true }
);

// Ek IP ek blog ko sirf ek baar like kar sakta hai
blogLikeSchema.index({ blog: 1, ip: 1 }, { unique: true });

module.exports = mongoose.model('BlogLike', blogLikeSchema);