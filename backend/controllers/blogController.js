// backend/controllers/blogController.js

const Blog = require('../models/Blog');

// @desc  Get published blogs with pagination, sort, filter
// @route GET /api/blogs?category=&tag=&sort=latest&page=1&limit=9&search=
// @access Public
const getPublishedBlogs = async (req, res) => {
  try {
    const { category, tag, sort = 'latest', page = 1, limit = 9, search } = req.query;
    const filter = { isPublished: true };
    if (category) filter.category = category;
    if (tag)      filter.tags = tag;
    if (search)   filter.title = { $regex: search, $options: 'i' };

    const sortMap = {
      latest:  { publishedAt: -1 },
      popular: { views: -1 },
      oldest:  { publishedAt: 1 },
    };
    const sortObj = sortMap[sort] ?? sortMap.latest;

    const skip = (Number(page) - 1) * Number(limit);
    const [blogs, total, featured] = await Promise.all([
      Blog.find(filter).sort(sortObj).skip(skip).limit(Number(limit)).select('-sections'),
      Blog.countDocuments(filter),
      Blog.find({ isPublished: true, isFeatured: true }).sort({ publishedAt: -1 }).limit(3).select('-sections'),
    ]);

    res.json({
      blogs,
      featured,
      total,
      page:  Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get single blog by slug + increment views
// @route GET /api/blogs/:slug
// @access Public
const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug, isPublished: true },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // Related blogs (same category, excluding current)
    const related = await Blog.find({
      isPublished: true,
      category: blog.category,
      slug: { $ne: blog.slug },
    }).sort({ publishedAt: -1 }).limit(3).select('-sections');

    res.json({ blog, related });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get all blogs (admin)
// @route GET /api/blogs/admin/all
// @access Private/Admin
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get single blog by ID (admin edit)
// @route GET /api/blogs/admin/:id
// @access Private/Admin
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Create blog
// @route POST /api/blogs
// @access Private/Admin
const createBlog = async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc  Update blog
// @route PUT /api/blogs/:id
// @access Private/Admin
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    Object.assign(blog, req.body);
    const updated = await blog.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc  Delete blog
// @route DELETE /api/blogs/:id
// @access Private/Admin
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json({ message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Toggle publish
// @route PATCH /api/blogs/:id/toggle
// @access Private/Admin
const togglePublish = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    blog.isPublished = !blog.isPublished;
    if (blog.isPublished && !blog.publishedAt) blog.publishedAt = new Date();
    const updated = await blog.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Toggle featured
// @route PATCH /api/blogs/:id/feature
// @access Private/Admin
const toggleFeatured = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    blog.isFeatured = !blog.isFeatured;
    const updated = await blog.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getPublishedBlogs, getBlogBySlug, getAllBlogs, getBlogById,
  createBlog, updateBlog, deleteBlog, togglePublish, toggleFeatured,
};