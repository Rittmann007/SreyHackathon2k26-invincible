const mongoose = require('mongoose');

const portfolioItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      default: null,
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
      default: '',
      trim: true,
      maxlength: 2000,
    },
    category: {
      type: String,
      default: '',
      trim: true,
    },
    mediaUrls: [
      {
        type: String,
        trim: true,
      },
    ],
    proofType: {
      type: String,
      enum: ['studentWork', 'clientApproved'],
      default: 'studentWork',
    },
    approvedByClient: {
      type: Boolean,
      default: false,
    },
    clientName: {
      type: String,
      default: '',
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PortfolioItem', portfolioItemSchema);