const Seo = require("../models/Seo");

const getSeo = async (req, res) => {
  try {
    const seo = await Seo.findOne({ page: req.params.page });
    res.json(seo);
  } catch (error) {
    res.status(500).json({ message: "Error fetching SEO data" });
  }
};

const updateSeo = async (req, res) => {
  try {
    const { page, title, description, keywords } = req.body;
    const seo = await Seo.findOneAndUpdate(
      { page },
      { title, description, keywords },
      { new: true, upsert: true }
    );
    res.json(seo);
  } catch (error) {
    res.status(500).json({ message: "Error updating SEO data" });
  }
};

module.exports = { getSeo, updateSeo };