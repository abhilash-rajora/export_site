const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const {
  getActiveProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  toggleProductActive,
  getHomepageProducts,  // ← yeh missing tha
} = require('../controllers/productController');

const { upload } = require('../config/cloudinary');

// Image upload
router.post('/upload-image', protect, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer/Cloudinary error:', err.message || err);
      return res.status(500).json({ message: err.message || String(err) });
    }
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    res.json({ url: req.file.path });
  });
});

// ── Specific routes pehle /:id se pehle ──────────────────────────
router.get('/all',      protect, getAllProducts);
router.get('/homepage', getHomepageProducts);       // ← specific route
router.get('/category/:category', getProductsByCategory);

router.get('/',    getActiveProducts);
router.get('/:id', getProductById);                 // ← dynamic route last mein

router.post('/',          protect, createProduct);
router.put('/:id',        protect, updateProduct);
router.delete('/:id',     protect, deleteProduct);
router.patch('/:id/toggle', protect, toggleProductActive);

module.exports = router;