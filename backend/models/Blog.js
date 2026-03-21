// backend/models/Blog.js

const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  heading:  { type: String, default: '' },
  content:  { type: String, default: '' },
  images:   { type: [String], default: [] },
  videoUrl: { type: String, default: '' },
}, { _id: true });

const blogSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    slug:        { type: String, unique: true, trim: true },
    excerpt:     { type: String, trim: true, maxlength: 300 },
    sections:    { type: [sectionSchema], default: [] },
    coverImage:  { type: String, default: '' },
    author:      { type: String, default: 'WExports Team' },
    category: {
      type: String,
      enum: ['Export Tips', 'Industry News', 'Trade Insights', 'Product Spotlight', 'Company Updates', 'Market Trends'],
      default: 'Export Tips',
    },
    tags:        { type: [String], default: [] },
    isPublished: { type: Boolean, default: false },
    isFeatured:  { type: Boolean, default: false },
    publishedAt: { type: Date },
    readTime:    { type: Number, default: 5 },
    views:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

blogSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  if (this.isModified('isPublished') && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  if (this.isModified('sections')) {
    const allText = this.sections.map(s => s.content).join(' ');
    const wordCount = allText.split(/\s+/).filter(Boolean).length;
    this.readTime = Math.max(1, Math.ceil(wordCount / 200));
  }
  next();
});

blogSchema.index({ isPublished: 1, publishedAt: -1 });
blogSchema.index({ isFeatured: 1 });
blogSchema.index({ views: -1 });

module.exports = mongoose.model('Blog', blogSchema);