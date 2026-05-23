const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      required: true,
      enum: ["business", "student"],
      index: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
      maxlength: 10,
    },
    location: {
      city: { type: String, default: "", trim: true },
      area: { type: String, default: "", trim: true },
      pincode: { type: String, default: "", trim: true },
    },
    status: {
      type: String,
      enum: ["active", "suspended", "pending"],
      default: "active",
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('User', userSchema);