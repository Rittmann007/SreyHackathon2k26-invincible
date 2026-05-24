const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Social Media",
        "Branding",
        "Video/Editing",
        "Growth/Outreach",
        "Automation/Tech",
        "Research/Ops",
      ],
      index: true,
    },
    location: {
      city: { type: String, default: '' },
      area: { type: String, default: '' },
      pincode: { type: String, default: '' },
    },
    budget: {
      type: Number,
      required: true,
      min: 0,
    },
    deadline: {
      type: Date,
      required: true,
      index: true,
    },
    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    location: {
      city: { type: String, default: '' },
      area: { type: String, default: '' },
      pincode: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: [
        "Open",
        "In Progress",
        "Revision",
        "Completed",
        "Paid",
        "Cancelled",
      ],
      default: "Open",
      index: true,
    },
    assignedStudentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    shortlistedPitchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pitch",
      default: null,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringSchedule: {
      type: String,
      default: "",
    },
    attachments: [
      {
        fileId: { type: String, required: true }, // Appwrite file ID
        url: { type: String, required: true }, // direct view URL
        name: { type: String, default: "" },
        mimeType: { type: String, default: "" },
      },
    ],
    approvedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

taskSchema.index({ businessId: 1, status: 1 });
taskSchema.index({ category: 1, budget: 1, deadline: 1 });

module.exports = mongoose.model('Task', taskSchema);