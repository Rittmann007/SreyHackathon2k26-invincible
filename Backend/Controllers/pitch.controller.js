const mongoose = require('mongoose');

const Pitch = require('../models/Pitch');
const Task = require('../models/Task');
const TaskProgress = require('../models/TaskProgress');
const Payment = require('../models/Payment');
const StudentProfile = require('../models/StudentProfile');
const PortfolioItem = require('../models/PortfolioItem');
const User = require('../models/User');
const { predictPitch } = require('../services/gradio.service');

const getAuthenticatedUserId = (req) => req.user?.id || req.user?._id;

// ─────────────────────────────────────────
// Create Pitch
// ─────────────────────────────────────────

exports.createPitch = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const {
      taskId,
      coverLetter,
      proposedPrice,
      timeline,
      sampleLinks,
      aiImprovedPitch,
      aiUsed,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        message: 'Invalid task ID',
      });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    if (task.status !== 'Open') {
      return res.status(400).json({
        message: 'This task is no longer accepting pitches',
      });
    }

    const existing = await Pitch.findOne({
      taskId,
      studentId: userId,
    });

    if (existing) {
      return res.status(400).json({
        message: 'You have already pitched on this task',
      });
    }

    if (
      task.businessId.toString() ===
      userId.toString()
    ) {
      return res.status(403).json({
        message: 'You cannot pitch on your own task',
      });
    }

    const pitch = new Pitch({
      taskId,
      studentId: userId,
      coverLetter,
      proposedPrice,
      timeline,
      sampleLinks: sampleLinks || [],
      aiImprovedPitch: aiImprovedPitch || '',
      aiUsed: aiUsed || false,
      status: 'Submitted',
      submittedAt: new Date(),
    });

    await pitch.save();

    res.status(201).json({
      message: 'Pitch submitted successfully',
      pitch,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};

// ─────────────────────────────────────────
// Improve Pitch
// ─────────────────────────────────────────

exports.improvePitch = async (req, res) => {
  try {
    const { coverLetter, sampleLinks } = req.body;

    if (
      !coverLetter ||
      coverLetter.trim().length < 20
    ) {
      return res.status(400).json({
        message:
          'Write at least a few sentences before improving',
      });
    }

    const userText =
      sampleLinks && sampleLinks.length > 0
        ? `${coverLetter}\n\nPortfolio links: ${sampleLinks.join(', ')}`
        : coverLetter;

    const improvedPitch = await predictPitch(userText);

    res.json({ improvedPitch });
  } catch (err) {
    console.error('Gradio API error:', err.message);

    res.json({
      improvedPitch: req.body.coverLetter,
      fallback: true,
      message: 'AI unavailable, showing original pitch',
    });
  }
};

// ─────────────────────────────────────────
// Get Task Pitches
// ─────────────────────────────────────────

exports.getTaskPitches = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.taskId)) {
      return res.status(400).json({
        message: 'Invalid task ID',
      });
    }

    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

    if (task.businessId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: 'Not authorised to view these pitches',
      });
    }

    const pitches = await Pitch.find({ taskId: req.params.taskId })
      .populate('studentId', 'name email location')
      .sort({ createdAt: -1 });

    const enriched = await Promise.all(
      pitches.map(async (pitch) => {
        const profile = await StudentProfile.findOne({
          userId: pitch.studentId._id,
        }).select('trustTier trustScore completionRate totalJobsWon skills');

        return {
          ...pitch.toObject(),
          studentProfile: profile,
        };
      })
    );

    res.json({
      pitches: enriched,
      total: enriched.length,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};

// ─────────────────────────────────────────
// Get My Pitches
// ─────────────────────────────────────────

exports.getMyPitches = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const { status } = req.query;

    const filter = {
      studentId: userId,
    };

    if (status) {
      filter.status = status;
    }

    const pitches = await Pitch.find(filter)
      .populate({
        path: 'taskId',
        select: 'title category budget deadline status businessId',
        populate: {
          path: 'businessId',
          select: 'name location',
        },
      })
      .sort({ createdAt: -1 });

    res.json({ pitches });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};

// ─────────────────────────────────────────
// Get Single Pitch
// ─────────────────────────────────────────

exports.getPitchById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid pitch ID',
      });
    }

    const pitch = await Pitch.findById(req.params.id)
      .populate('studentId', 'name email location')
      .populate('taskId', 'title category budget deadline businessId');

    if (!pitch) {
      return res.status(404).json({
        message: 'Pitch not found',
      });
    }

    const userId = getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const isOwner = pitch.studentId._id.toString() === userId.toString();
    const isBusiness = pitch.taskId.businessId.toString() === userId.toString();

    if (!isOwner && !isBusiness) {
      return res.status(403).json({
        message: 'Not authorised to view this pitch',
      });
    }

    res.json({ pitch });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};

// ─────────────────────────────────────────
// Shortlist Pitch
// ─────────────────────────────────────────

exports.shortlistPitch = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid pitch ID',
      });
    }

    const pitch = await Pitch.findById(req.params.id).populate('taskId');

    if (!pitch) {
      return res.status(404).json({
        message: 'Pitch not found',
      });
    }

    if (pitch.taskId.businessId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: 'Not authorised',
      });
    }

    if (pitch.status !== 'Submitted') {
      return res.status(400).json({
        message: `Pitch is already ${pitch.status}`,
      });
    }

    pitch.status = 'Shortlisted';
    pitch.reviewedAt = new Date();

    await pitch.save();

    await Task.findByIdAndUpdate(pitch.taskId._id, {
      shortlistedPitchId: pitch._id,
    });

    res.json({
      message: 'Pitch shortlisted',
      pitch,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};

// ─────────────────────────────────────────
// Accept Pitch
// ─────────────────────────────────────────

exports.acceptPitch = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid pitch ID',
      });
    }

    const pitch = await Pitch.findById(req.params.id).populate('taskId');

    if (!pitch) {
      return res.status(404).json({
        message: 'Pitch not found',
      });
    }

    const task = pitch.taskId;
    const existingPayment = await Payment.findOne({ taskId: task._id });

    if (task.businessId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: 'Not authorised',
      });
    }

    if (task.status !== 'Open') {
      return res.status(400).json({
        message: 'Task is no longer open for acceptance',
      });
    }

    if (pitch.status === 'Rejected') {
      return res.status(400).json({
        message: 'Cannot accept a rejected pitch',
      });
    }

    pitch.status = 'Accepted';
    pitch.reviewedAt = new Date();

    await pitch.save();

    await Pitch.updateMany(
      { taskId: task._id, _id: { $ne: pitch._id } },
      {
        status: 'Rejected',
        reviewedAt: new Date(),
      }
    );

    task.status = 'In Progress';
    task.assignedStudentId = pitch.studentId;
    task.shortlistedPitchId = pitch._id;

    await task.save();

    const progress = new TaskProgress({
      taskId: task._id,
      stage: 'In Progress',
      updatedBy: userId,
      notes: 'Pitch accepted - work started',
      history: [
        {
          stage: 'In Progress',
          note: 'Pitch accepted by business',
          updatedBy: userId,
        },
      ],
    });

    await progress.save();

    const payment = new Payment({
      taskId: task._id,
      businessId: userId,
      studentId: pitch.studentId,
      amount: pitch.proposedPrice,
      currency: 'INR',
      escrowStatus: 'Held',
      paymentMethod: 'manual',
      transactionRef: `TXN-${Date.now()}`,
    });

    await payment.save();

    res.json({
      message: 'Pitch accepted - task started, escrow created',
      pitch,
      progress,
      payment,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};

// ─────────────────────────────────────────
// Reject Pitch
// ─────────────────────────────────────────

exports.rejectPitch = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid pitch ID',
      });
    }

    const { feedback } = req.body;

    const pitch = await Pitch.findById(req.params.id).populate('taskId');

    if (!pitch) {
      return res.status(404).json({
        message: 'Pitch not found',
      });
    }

    if (pitch.taskId.businessId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: 'Not authorised',
      });
    }

    if (pitch.status === 'Accepted') {
      return res.status(400).json({
        message: 'Cannot reject an already accepted pitch',
      });
    }

    pitch.status = 'Rejected';
    pitch.feedback = feedback || '';
    pitch.reviewedAt = new Date();

    await pitch.save();

    res.json({
      message: 'Pitch rejected',
      pitch,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};

// ─────────────────────────────────────────
// Release Payment
// ─────────────────────────────────────────

exports.releasePayment = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid pitch ID',
      });
    }

    const pitch = await Pitch.findById(req.params.id).populate('taskId');

    if (!pitch) {
      return res.status(404).json({
        message: 'Pitch not found',
      });
    }

    const task = pitch.taskId;
    const existingPayment = await Payment.findOne({ taskId: task._id });

    if (task.businessId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: 'Not authorised',
      });
    }

    if (task.status === 'Paid') {
      return res.status(400).json({
        message: 'Payment already released',
      });
    }

    const canReleaseFromCancelled =
      task.status === 'Cancelled' && existingPayment && existingPayment.escrowStatus === 'Held';

    if (!['In Progress', 'Revision', 'Completed'].includes(task.status) && !canReleaseFromCancelled) {
      return res.status(400).json({
        message: 'Task must be in progress or completed before releasing payment',
      });
    }

    const business = await User.findById(userId).select('name');

    task.status = 'Paid';
    task.approvedAt = new Date();

    await task.save();

    await TaskProgress.findOneAndUpdate(
      { taskId: task._id },
      {
        stage: 'Paid',
        updatedBy: userId,
        $push: {
          history: {
            stage: 'Paid',
            note: 'Business approved work and released payment',
            updatedBy: userId,
          },
        },
      }
    );

    const updatedPayment = await Payment.findOneAndUpdate(
      { taskId: task._id },
      {
        escrowStatus: 'Released',
        releaseApprovedAt: new Date(),
      },
      { new: true }
    );

    await StudentProfile.findOneAndUpdate(
      { userId: pitch.studentId },
      {
        $inc: {
          totalEarnings: updatedPayment ? updatedPayment.amount : pitch.proposedPrice,
          totalJobsWon: 1,
        },
      }
    );

    await PortfolioItem.create({
      userId: pitch.studentId,
      taskId: task._id,
      title: `${task.category} for ${business.name}`,
      description: task.description,
      category: task.category,
      mediaUrls: [],
      proofType: 'clientApproved',
      approvedByClient: true,
      clientName: business.name,
    });

    res.json({
      message: 'Payment released - portfolio updated automatically',
      payment: updatedPayment,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};

// Override the task pitch lookup with a clean implementation.
exports.getTaskPitches = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.taskId)) {
      return res.status(400).json({
        message: 'Invalid task ID',
      });
    }

    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

    if (task.businessId.toString() !== userId.toString()) {
      return res.status(403).json({
        message: 'Not authorised to view these pitches',
      });
    }

    const pitches = await Pitch.find({ taskId: req.params.taskId })
      .populate('studentId', 'name email location')
      .sort({ createdAt: -1 });

    const enriched = await Promise.all(
      pitches.map(async (pitch) => {
        const profile = await StudentProfile.findOne({
          userId: pitch.studentId._id,
        }).select('trustTier trustScore completionRate totalJobsWon skills');

        return {
          ...pitch.toObject(),
          studentProfile: profile,
        };
      })
    );

    res.json({
      pitches: enriched,
      total: enriched.length,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};