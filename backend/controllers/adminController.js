const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Resend } = require("resend");
const Admin = require("../models/Admin");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

const resend = new Resend(process.env.RESEND_API_KEY);

// ── Step 1: Email + Password → send email OTP ────────────────────
const loginAdmin = async (req, res) => {
  const { email, password } = req.body || {};

  try {
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate 6-digit email OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.loginOtp = otp;
    admin.loginOtpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    admin.loginOtpAttempts = 0;
    await admin.save();

    // Send OTP email
    await resend.emails.send({
  from: "WeExports Security <onboarding@resend.dev>",
  to: admin.email,
  subject: "Secure Login OTP | WeExports Admin",
  html: `
    <div style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:30px;">
      
      <div style="max-width:520px; margin:auto; background:#ffffff; padding:30px; border-radius:12px; box-shadow:0 6px 18px rgba(0,0,0,0.06);">
        
        <h2 style="margin:0; color:#0D3D3D; text-align:center;">WeExports</h2>
        <p style="text-align:center; color:#777; margin-top:5px;">Admin Secure Login</p>

        <hr style="border:none; border-top:1px solid #eee; margin:25px 0;" />

        <p style="color:#333; font-size:15px;">
          We received a request to log in to your <strong>admin account</strong>.
        </p>

        <p style="margin-top:15px; color:#333;">Use the OTP below to continue:</p>

        <div style="text-align:center; margin:25px 0;">
          <span style="display:inline-block; font-size:34px; font-weight:bold; letter-spacing:10px; color:#D4A017;">
            ${otp}
          </span>
        </div>

        <p style="color:#666; font-size:14px;">
          This OTP is valid for <strong>10 minutes</strong>. For your security, do not share it with anyone.
        </p>

        <p style="color:#999; font-size:13px; margin-top:20px;">
          If this wasn't you, we recommend changing your password immediately.
        </p>

        <hr style="border:none; border-top:1px solid #eee; margin:25px 0;" />

        <p style="font-size:12px; color:#aaa; text-align:center;">
          © ${new Date().getFullYear()} WeExports. All rights reserved.
        </p>

      </div>

    </div>
  `,
});

    res.json({ require2FA: true, adminId: admin._id });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ── Step 2: Verify email OTP → issue JWT (1 hour) ────────────────
const verify2FALogin = async (req, res) => {
  const { adminId, token } = req.body;

  try {
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(400).json({ message: "Invalid request" });

    // Check attempts
    if ((admin.loginOtpAttempts || 0) >= 5)
      return res.status(429).json({ message: "Too many attempts. Please login again." });

    // Check expiry
    if (!admin.loginOtp || !admin.loginOtpExpiry || admin.loginOtpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired. Please login again." });
    }

    // Check OTP
    if (admin.loginOtp !== token) {
      admin.loginOtpAttempts = (admin.loginOtpAttempts || 0) + 1;
      await admin.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Clear OTP
    admin.loginOtp = null;
    admin.loginOtpExpiry = null;
    admin.loginOtpAttempts = 0;
    await admin.save();

    // Issue JWT — 1 hour expiry
    const jwtToken = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }   // ← 1 hour session
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

// ── Rest of controllers (unchanged) ──────────────────────────────

const createAdmin = async (req, res) => {
  try {
    const data = typeof req.body.body === "string" ? JSON.parse(req.body.body) : req.body || {};
    const { name, email, password, role } = data;
    if (!name || !email || !password || !role)
      return res.status(400).json({ message: "Name, email, password and role are required" });
    const normalizedEmail = email.toLowerCase();
    const existing = await Admin.findOne({ email: normalizedEmail });
    if (existing) return res.status(400).json({ message: "Admin already exists" });
    await Admin.create({ name, email: normalizedEmail, password, role });
    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyAdmin = async (req, res) => {
  res.json({
    isAdmin: true,
    email: req.admin.email,
    role: req.admin.role,
    twoFactorEnabled: req.admin.twoFactorEnabled,
  });
};

const generate2FA = async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({ length: 20, name: `GlobalTrade (${req.admin.email})` });
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);
    req.admin.twoFactorSecret = secret.base32;
    await req.admin.save();
    res.json({ qrCode, manualKey: secret.base32 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verify2FASetup = async (req, res) => {
  const { token } = req.body;
  try {
    if (!req.admin.twoFactorSecret)
      return res.status(400).json({ message: "2FA not initialized" });
    const verified = speakeasy.totp.verify({
      secret: req.admin.twoFactorSecret, encoding: "base32", token, window: 1,
    });
    if (!verified) return res.status(400).json({ message: "Invalid OTP" });
    req.admin.twoFactorEnabled = true;
    await req.admin.save();
    res.json({ message: "2FA enabled successfully" });
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

const forgotPassword = async (req, res) => {
  const { email } = req.body || {};
  try {
    if (!email) return res.status(400).json({ message: "Email is required" });
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.resetOtp = otp;
    admin.resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    admin.resetOtpVerified = false;
    admin.resetOtpAttempts = 0;
    await admin.save();
    await resend.emails.send({
  from: "WeExports Security <onboarding@resend.dev>",
  to: admin.email,
  subject: "Your OTP for Password Reset | WeExports",
  html: `
    <div style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding: 30px;">
      
      <div style="max-width:500px; margin:auto; background:white; padding:25px; border-radius:10px; box-shadow:0 4px 10px rgba(0,0,0,0.05); text-align:center;">
        
        <h2 style="color:#2c3e50; margin-bottom:10px;">WeExports</h2>
        <p style="color:#555;">Secure Password Reset Request</p>

        <hr style="border:none; border-top:1px solid #eee; margin:20px 0;" />

        <h3 style="color:#333;">Your OTP Code</h3>

        <div style="font-size:32px; font-weight:bold; letter-spacing:8px; color:#27ae60; margin:20px 0;">
          ${otp}
        </div>

        <p style="color:#777; font-size:14px;">
          This OTP is valid for <strong>10 minutes</strong>.
        </p>

        <p style="color:#999; font-size:13px; margin-top:20px;">
          If you did not request this, please ignore this email or contact support.
        </p>

        <hr style="border:none; border-top:1px solid #eee; margin:20px 0;" />

        <p style="font-size:12px; color:#aaa;">
          © ${new Date().getFullYear()} WeExports. All rights reserved.
        </p>

      </div>

    </div>
  `,
});
    res.json({ message: "Reset OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyResetOtp = async (req, res) => {
  const { email, otp } = req.body || {};
  try {
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    if (!admin.resetOtp || !admin.resetOtpExpiry) return res.status(400).json({ message: "No reset OTP requested" });
    if (admin.resetOtpExpiry < new Date()) return res.status(400).json({ message: "OTP expired" });
    if (admin.resetOtpAttempts >= 5) return res.status(429).json({ message: "Too many attempts" });
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

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body || {};
  try {
    if (!email || !newPassword) return res.status(400).json({ message: "Email and new password required" });
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    if (!admin.resetOtpVerified) return res.status(400).json({ message: "OTP not verified" });
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
  loginAdmin, verifyAdmin, generate2FA, verify2FASetup,
  verify2FALogin, disable2FA, createAdmin,
  forgotPassword, verifyResetOtp, resetPassword,
};