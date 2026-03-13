const mongoose = require("mongoose");

const seoSchema = new mongoose.Schema(
  {
    page: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    keywords: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Seo", seoSchema);