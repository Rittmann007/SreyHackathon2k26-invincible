const mongoose = require('mongoose');

const pitchSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    coverLetter: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    proposedPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    timeline: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    sampleLinks: [
      {
        type: String,
        trim: true,
      },
    ],
    aiImprovedPitch: {
      type: String,
      default: '',
      trim: true,
      maxlength: 5000,
    },
    aiUsed: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['Submitted', 'Shortlisted', 'Rejected', 'Accepted'],
      default: 'Submitted',
      index: true,
    },
    feedback: {
      type: String,
      default: '',
      trim: true,
      maxlength: 2000,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

pitchSchema.index({ taskId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Pitch', pitchSchema);