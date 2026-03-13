const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require("../models/Admin");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // If 2FA enabled → require OTP
    if (admin.twoFactorEnabled) {
      return res.json({
        require2FA: true,
        adminId: admin._id,
      });
    }

    // Normal login
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      token,
      email: admin.email,
      role: admin.role,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Create new admin
// @route   POST /api/admin/create
// @access  Superadmin only
const createAdmin = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const newAdmin = await Admin.create({
      name,
      email,
      password,
      role: role || "editor",
    });

    res.status(201).json({
      message: "Admin created successfully",
      id: newAdmin._id,
      email: newAdmin.email,
      role: newAdmin.role,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify admin token
// @route   GET /api/admin/verify
// @access  Private
const verifyAdmin = async (req, res) => {
  res.json({
    isAdmin: true,
    email: req.admin.email,
    role: req.admin.role,
    twoFactorEnabled: req.admin.twoFactorEnabled,
  });
};

// @desc    Generate 2FA secret
// @route   POST /api/admin/2fa/generate
// @access  Private
const generate2FA = async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({
      length: 20,
      name: `GlobalTrade (${req.admin.email})`,
    });

    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    // Temporarily store secret (not enable yet)
    req.admin.twoFactorSecret = secret.base32;
    await req.admin.save();

    res.json({
      qrCode,
      manualKey: secret.base32,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Verify and enable 2FA
// @route   POST /api/admin/2fa/verify
// @access  Private
const verify2FASetup = async (req, res) => {
  const { token } = req.body;

  try {
    if (!req.admin.twoFactorSecret) {
      return res.status(400).json({ message: "2FA not initialized" });
    }

    const verified = speakeasy.totp.verify({
      secret: req.admin.twoFactorSecret,
      encoding: "base32",
      token,
      window: 1,
    });

    if (!verified) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    req.admin.twoFactorEnabled = true;
    await req.admin.save();

    res.json({ message: "2FA enabled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Verify OTP after password login
// @route   POST /api/admin/2fa/login
// @access  Public
const verify2FALogin = async (req, res) => {
  const { adminId, token } = req.body;

  try {
    const admin = await Admin.findById(adminId);

    if (!admin || !admin.twoFactorEnabled) {
      return res.status(400).json({ message: "Invalid request" });
    }

    const verified = speakeasy.totp.verify({
      secret: admin.twoFactorSecret,
      encoding: "base32",
      token,
      window: 1,
    });

    if (!verified) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const jwtToken = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      token: jwtToken,
      email: admin.email,
      role: admin.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const disable2FA = async (req, res) => {
  try {
    req.admin.twoFactorEnabled = false;
    req.admin.twoFactorSecret = undefined;
    await req.admin.save();

    res.json({ message: "2FA disabled" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { loginAdmin, verifyAdmin, generate2FA, verify2FASetup, verify2FALogin, disable2FA , createAdmin};