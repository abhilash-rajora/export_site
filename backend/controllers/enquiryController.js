const Enquiry = require('../models/Enquiry');
const Product = require('../models/Product');

// @desc    Submit enquiry (public)
// @route   POST /api/enquiries
// @access  Public
const submitEnquiry = async (req, res) => {
  try {
    const { name, email, phone, productId, productName, message } = req.body;
    const enquiry = await Enquiry.create({
      name,
      email,
      phone: phone || '',
      productId: productId || null,
      productName: productName || '',
      message,
    });
    res.status(201).json(enquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Private/Admin
const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get enquiry by ID
// @route   GET /api/enquiries/:id
// @access  Private/Admin
const getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });
    res.json(enquiry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark enquiry as read
// @route   PATCH /api/enquiries/:id/read
// @access  Private/Admin
const markEnquiryRead = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });
    enquiry.status = 'read';
    const updated = await enquiry.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete enquiry
// @route   DELETE /api/enquiries/:id
// @access  Private/Admin
const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });
    res.json({ message: 'Enquiry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/enquiries/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const totalEnquiries = await Enquiry.countDocuments();
    const newEnquiries = await Enquiry.countDocuments({ status: 'new' });
    const recentEnquiries = await Enquiry.find().sort({ createdAt: -1 }).limit(5);
    const activeRate = totalProducts > 0
      ? Math.round((activeProducts / totalProducts) * 100)
      : 0;

    res.json({ totalProducts, activeProducts, activeRate, totalEnquiries, newEnquiries, recentEnquiries });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitEnquiry,
  getAllEnquiries,
  getEnquiryById,
  markEnquiryRead,
  deleteEnquiry,
  getDashboardStats,
};