const mongoose = require('mongoose');

const taskProgressSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
      unique: true,
      index: true,
    },
    stage: {
      type: String,
      enum: ['Pending', 'In Progress', 'Revision', 'Completed', 'Paid'],
      default: 'Pending',
      index: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
      maxlength: 3000,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    history: [
      {
        stage: {
          type: String,
          enum: ['Pending', 'In Progress', 'Revision', 'Completed', 'Paid'],
          required: true,
        },
        note: {
          type: String,
          default: '',
          trim: true,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          default: null,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('TaskProgress', taskProgressSchema);