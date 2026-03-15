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
} = require('../controllers/productController');

const { upload } = require('../config/cloudinary');

// Image upload route
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

router.get('/all', protect, getAllProducts);

router.get('/', getActiveProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);

router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);
router.patch('/:id/toggle', protect, toggleProductActive);

module.exports = router;