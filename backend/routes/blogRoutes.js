// backend/routes/blogRoutes.js

const express = require('express');
const router  = express.Router();
const {
  getPublishedBlogs, getBlogBySlug, getAllBlogs, getBlogById,
  createBlog, updateBlog, deleteBlog, togglePublish, toggleFeatured,
} = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');

// Public
router.get('/',              getPublishedBlogs);
router.get('/:slug',         getBlogBySlug);

// Admin
router.get('/admin/all',          protect, getAllBlogs);
router.get('/admin/:id',          protect, getBlogById);
router.post('/',                  protect, createBlog);
router.put('/:id',                protect, updateBlog);
router.delete('/:id',             protect, deleteBlog);
router.patch('/:id/toggle',       protect, togglePublish);
router.patch('/:id/feature',      protect, toggleFeatured);

module.exports = router;