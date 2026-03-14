const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Agriculture', 'Textiles', 'Minerals', 'Electronics', 'Food & Beverages', 'Handicrafts', 'Chemicals', 'Metals', 'Plastics', 'Machinery', 'Automotive Parts', 'Pharmaceuticals', 'Furniture', 'Construction Materials', 'Energy Products', 'Consumer Goods', 'Other'],
    },
    description: { type: String, required: [true, 'Description is required'] },
    imageUrl: { type: String, default: '' },
    images: { type: [String], default: [] },
    specifications: [{
    property: { type: String, trim: true },
    value: { type: String, trim: true },},],
    originCountry: { type: String, required: [true, 'Origin country is required'], trim: true },
    minOrderQty: { type: Number, required: true, min: 1, default: 1 },
    priceRange: { type: String, required: [true, 'Price range is required'], trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);