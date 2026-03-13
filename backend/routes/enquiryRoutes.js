const express = require('express');
const router = express.Router();
//const { getDashboardStats } = require('../controllers/enquiryController');
const { protect } = require('../middleware/authMiddleware');
const {
  submitEnquiry,
  getAllEnquiries,
  getEnquiryById,
  markEnquiryRead,
  deleteEnquiry,
  getDashboardStats,
} = require('../controllers/enquiryController');

router.get('/dashboard', getDashboardStats);
// Public
router.post('/', submitEnquiry);

// Admin
router.get('/dashboard', protect, getDashboardStats);
router.get('/', protect, getAllEnquiries);
router.get('/:id', protect, getEnquiryById);
router.patch('/:id/read', protect, markEnquiryRead);
router.delete('/:id', protect, deleteEnquiry);

module.exports = router;