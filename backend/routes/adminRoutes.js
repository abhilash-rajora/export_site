const express = require("express");
const router = express.Router();
const { protect, superAdminOnly } = require("../middleware/authMiddleware");
const {
  loginAdmin,
  verifyAdmin,
  generate2FA,
  verify2FASetup,
  verify2FALogin,
  disable2FA,
  createAdmin,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
} = require("../controllers/adminController");

router.post("/login", loginAdmin);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

router.get("/verify", protect, verifyAdmin);
router.post("/2fa/generate", protect, generate2FA);
router.post("/2fa/verify", protect, verify2FASetup);
router.post("/2fa/login", verify2FALogin);
router.post("/2fa/disable", protect, disable2FA);
router.post("/create", protect, superAdminOnly, createAdmin);

module.exports = router;