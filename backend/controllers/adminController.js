const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Admin = require("../models/Admin");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const loginAdmin = async (req, res) => {
  const { email, password } = req.body || {};

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (admin.twoFactorEnabled) {
      return res.json({
        require2FA: true,
        adminId: admin._id,
      });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({
      token,
      email: admin.email,
      role: admin.role,
      name: admin.name,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create new admin
// @route POST /api/admin/create
// @access Superadmin only
const createAdmin = async (req, res) => {
  try {
    const data =
      typeof req.body.body === "string" ? JSON.parse(req.body.body) : req.body || {};

    const { name, email, password, role } = data;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Name, email, password and role are required" });
    }

    const normalizedEmail = email.toLowerCase();

    const existing = await Admin.findOne({ email: normalizedEmail });

    if (existing) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    await Admin.create({
      name,
      email: normalizedEmail,
      password,
      role,
    });

    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    console.error("Create admin error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Verify admin token
// @route GET /api/admin/verify
// @access Private
const verifyAdmin = async (req, res) => {
  res.json({
    isAdmin: true,
    email: req.admin.email,
    role: req.admin.role,
    twoFactorEnabled: req.admin.twoFactorEnabled,
  });
};

// @desc Generate 2FA secret
// @route POST /api/admin/2fa/generate
// @access Private
const generate2FA = async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({
      length: 20,
      name: `GlobalTrade (${req.admin.email})`,
    });

    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

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

// @desc Verify and enable 2FA
// @route POST /api/admin/2fa/verify
// @access Private
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

// @desc Verify OTP after password login
// @route POST /api/admin/2fa/login
// @access Public
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
      name: admin.name,
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

// @desc Forgot password - send OTP
// @route POST /api/admin/forgot-password
// @access Public
const forgotPassword = async (req, res) => {
  const { email } = req.body || {};

  try {
    console.log("req.body:", req.body);

    if (!email || typeof email !== "string") {
      return res.status(400).json({ message: "Email is required" });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    admin.resetOtp = otp;
    admin.resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    admin.resetOtpVerified = false;
    admin.resetOtpAttempts = 0;

    await admin.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: admin.email,
      subject: "WeExports Admin Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>WeExports Admin Password Reset</h2>
          <p>Your OTP for password reset is:</p>
          <h1 style="letter-spacing: 5px;">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    res.json({ message: "Reset OTP sent to your email" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: error.message });
  }
};
// @desc Verify reset OTP
// @route POST /api/admin/verify-reset-otp
// @access Public
const verifyResetOtp = async (req, res) => {
  const { email, otp } = req.body || {};

  try {
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (!admin.resetOtp || !admin.resetOtpExpiry) {
      return res.status(400).json({ message: "No reset OTP requested" });
    }

    if (admin.resetOtpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (admin.resetOtpAttempts >= 5) {
      return res.status(429).json({ message: "Too many invalid attempts" });
    }

    if (admin.resetOtp !== otp) {
      admin.resetOtpAttempts += 1;
      await admin.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    admin.resetOtpVerified = true;
    admin.resetOtpAttempts = 0;
    await admin.save();

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Reset password
// @route POST /api/admin/reset-password
// @access Public
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body || {};

  try {
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (!admin.resetOtpVerified) {
      return res.status(400).json({ message: "OTP not verified" });
    }

    admin.password = newPassword;
    admin.resetOtp = null;
    admin.resetOtpExpiry = null;
    admin.resetOtpVerified = false;
    admin.resetOtpAttempts = 0;

    await admin.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};