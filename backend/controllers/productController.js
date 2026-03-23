const Product = require('../models/Product');

const getActiveProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },   
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.category,
      isActive: true,
    }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, category, description, imageUrl, images, specifications, originCountry, minOrderQty, priceRange } = req.body;
    const product = await Product.create({
      name, category, description,
      imageUrl: imageUrl || (images?.[0] || ''),
      images: images || [],
      specifications: specifications || [],
      originCountry, minOrderQty, priceRange,
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const { name, category, description, imageUrl, images, specifications, originCountry, minOrderQty, priceRange, inStock, isFeatured } = req.body;
    // Only update fields that were actually sent
    if (name        !== undefined) product.name        = name;
    if (category    !== undefined) product.category    = category;
    if (description !== undefined) product.description = description;
    if (images      !== undefined) product.images      = images;
    if (imageUrl    !== undefined) product.imageUrl    = imageUrl || images?.[0] || product.imageUrl;
    if (specifications !== undefined) product.specifications = specifications;
    if (originCountry  !== undefined) product.originCountry  = originCountry;
    if (minOrderQty    !== undefined) product.minOrderQty    = minOrderQty;
    if (priceRange     !== undefined) product.priceRange     = priceRange;
    if (inStock        !== undefined) product.inStock        = inStock;
    if (isFeatured     !== undefined) product.isFeatured     = isFeatured;
    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleProductActive = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.isActive = !product.isActive;
    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getHomepageProducts = async (req, res) => {
  try {
    const base = { isActive: true };

    const [featured, newArrivals, trending] = await Promise.all([
      Product.find({ ...base, isFeatured: true })
        .sort({ createdAt: -1 })
        .limit(12)
        .select('name category description images imageUrl priceRange originCountry minOrderQty isFeatured views soldCount createdAt'),

      Product.find(base)
        .sort({ createdAt: -1 })
        .limit(16)
        .select('name category description images imageUrl priceRange originCountry minOrderQty isFeatured views soldCount createdAt'),

      Product.find(base)
        .sort({ views: -1, soldCount: -1 })
        .limit(4)
        .select('name category description images imageUrl priceRange originCountry minOrderQty isFeatured views soldCount createdAt'),
    ]);

    res.json({ featured, newArrivals, trending });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getActiveProducts,
  getProductById,
  getProductsByCategory,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductActive,
  getHomepageProducts,  
};