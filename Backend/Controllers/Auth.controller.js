const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require('../Models/User');
const StudentProfile = require('../Models/StudentProfile');
const BusinessProfile = require('../Models/BusinessProfile');
const TokenBlacklist = require('../Models/TokenBlacklist.model');
const otpModel = require('../Models/Otp.model');
const sendEmail = require("../services/email.service")
const {generateOtp,getOtpHtml} = require("../utils/Otp")

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
};

const getTokenFromRequest = (req) => {
  if (req.cookies?.token) {
    return req.cookies.token;
  }

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  return null;
};

const buildLocation = (location) => {
  if (!location) {
    return { city: "", area: "", pincode: "" };
  }

  if (typeof location === "string") {
    return { city: location, area: "", pincode: "" };
  }

  return {
    city: location.city || "",
    area: location.area || "",
    pincode: location.pincode || "",
  };
};

const signToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    },
  );

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  location: user.location,
  status: user.status,
  verified: user.verified,
  lastLoginAt: user.lastLoginAt,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      location,
      collegeName,
      businessName,
      businessType,
      description,
      website,
    } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
      phone: phone || "",
      location: buildLocation(location),
      status: "active",
    });

    let profile = null;

    if (role === "student") {
      profile = await StudentProfile.create({
        userId: user._id,
        collegeName: collegeName || "",
      });
    }

    if (role === "business") {
      profile = await BusinessProfile.create({
        userId: user._id,
        businessName,
        businessType: businessType || "",
        description: description || "",
        website: website || "",
        location: buildLocation(location).city,
      });
    }

    //for email otp conformation
    const otp = generateOtp();
    const html = getOtpHtml(otp);

    const otphash = await bcrypt.hash(otp, 10);

    await otpModel.create({
      email: email.trim().toLowerCase(),
      user: user._id,
      otpHash: otphash,
    });

    await sendEmail(
      email.trim().toLowerCase(),
      "OTP verification",
      `Your OTP code is ${otp}`,
      html,
    );

    return res.status(201).json({
      success: true,
      message: "Registered successfully,Check email for otp",
      user: sanitizeUser(user),
      profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email and password are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+passwordHash",
    );
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Account is not active",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    user.lastLoginAt = new Date();
    await user.save();

    let profile = null;
    if (user.role === "student") {
      profile = await StudentProfile.findOne({ userId: user._id });
    } else if (user.role === "business") {
      profile = await BusinessProfile.findOne({ userId: user._id });
    }

    const token = signToken(user);

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: sanitizeUser(user),
      profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

const me = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let profile = null;
    if (user.role === "student") {
      profile = await StudentProfile.findOne({ userId: user._id });
    } else if (user.role === "business") {
      profile = await BusinessProfile.findOne({ userId: user._id });
    }

    return res.status(200).json({
      success: true,
      user: sanitizeUser(user),
      profile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch user",
    });
  }
};

const logout = async (req, res) => {
  try {
    const token = getTokenFromRequest(req);

    if (token) {
      await TokenBlacklist.create({ token });
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    return res.status(200).clearCookie("token", options).json({
      success: true,
      message: "user logged out",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Logout failed",
    });
  }
};

async function verifyEmail(req,res) {
   const {otp,email} = req.body

   if (!otp || !email) {
      return res.status(401).json({
        success: false,
        message: "Otp and email are required",
      });
   }

   // Find the OTP record for this email
   const otpRecord = await otpModel.findOne({email:email.trim().toLowerCase()})

   if (!otpRecord) {
      return res.status(401).json({
        success: false,
        message: "Otp expired or not found",
      });
   }

   // Compare provided OTP with stored hash
   const isOtpValid = await bcrypt.compare(otp, otpRecord.otpHash)

   if (!isOtpValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid Otp",
      });
   }

   // Find and update user as verified
   const user = await User.findByIdAndUpdate(otpRecord.user,{verified:true},{new: true})

   if (!user) {
     return res.status(401).json({
        success: false,
        message: "User not found",
      });
   }

   // Delete OTP record after verification
   await otpModel.deleteOne({_id: otpRecord._id})

   let profile = null;
    if (user.role === "student") {
      profile = await StudentProfile.findOne({ userId: user._id });
    } else if (user.role === "business") {
      profile = await BusinessProfile.findOne({ userId: user._id });
    }

   const token = signToken(user);

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: sanitizeUser(user),
      profile,
    });
}

module.exports = {
  register,
  login,
  me,
  logout,
  verifyEmail
};
