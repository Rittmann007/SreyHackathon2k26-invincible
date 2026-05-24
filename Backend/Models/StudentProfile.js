const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    collegeName: {
      type: String,
      default: '',
      trim: true,
    },
    collegeVerified: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
      default: '',
      trim: true,
      maxlength: 1000,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    tools: [
      {
        type: String,
        trim: true,
      },
    ],
    trustTier: {
      type: String,
      enum: ['Bronze', 'Silver', 'Gold', 'Verified Pro'],
      default: 'Bronze',
    },
    trustScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    responseRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    totalJobsWon: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.StudentProfile || mongoose.model('StudentProfile', studentProfileSchema);