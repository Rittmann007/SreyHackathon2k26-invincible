const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
      unique: true,
      index: true,
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'INR',
      trim: true,
    },
    escrowStatus: {
      type: String,
      enum: ['Held', 'Released', 'Refunded'],
      default: 'Held',
      index: true,
    },
    releaseApprovedAt: {
      type: Date,
      default: null,
    },
    paymentMethod: {
      type: String,
      default: 'manual',
      trim: true,
    },
    transactionRef: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Payment', paymentSchema);