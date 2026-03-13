const express = require("express");
const router = express.Router();
const { getSeo, updateSeo } = require("../controllers/seoController");
const { protect } = require("../middleware/authMiddleware");

router.get("/:page", getSeo);
router.post("/", protect, updateSeo);

module.exports = router;