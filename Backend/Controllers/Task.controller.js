const mongoose = require('mongoose');

const Task = require('../Models/Task');
const Pitch = require('../Models/Pitch');
const TaskProgress = require('../Models/TaskProgress');

const getAuthenticatedUserId = (req) => req.user?.id || req.user?._id;

// ─────────────────────────────────────────
// Create Task
// ─────────────────────────────────────────

exports.createTask = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const {
      title,
      description,
      category,
      budget,
      deadline,
      requiredSkills,
      attachments,
      isRecurring,
      recurringSchedule,
      location,
    } = req.body;

    // Normalize location: accept string (city) or object { city, area, pincode }
    let normalizedLocation = undefined;
    if (location !== undefined && location !== null) {
      if (typeof location === 'string') {
        const trimmed = location.trim();
        if (trimmed) normalizedLocation = { city: trimmed, area: '', pincode: '' };
      } else if (typeof location === 'object' && (location.city || location.area || location.pincode)) {
        normalizedLocation = {
          city: location.city || '',
          area: location.area || '',
          pincode: location.pincode || '',
        };
      }
    }

    if (new Date(deadline) <= new Date()) {
      return res
        .status(400)
        .json({ message: 'Deadline must be in the future' });
    }

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const task = new Task({
      businessId: userId,
      title,
      description,
      category,
      location: normalizedLocation,
      budget,
      deadline,
      requiredSkills: requiredSkills || [],
      attachments: attachments || [],
      isRecurring: isRecurring || false,
      recurringSchedule: recurringSchedule || '',
      status: 'Open',
    });

    await task.save();

    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Task validation failed',
        errors: Object.values(err.errors).map((validationError) => validationError.message),
        error: err.message,
      });
    }

    res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};

// ─────────────────────────────────────────
// Get All Open Tasks
// ─────────────────────────────────────────

exports.getTasks = async (req, res) => {
  try {
    const {
      category,
      minBudget,
      maxBudget,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = { status: 'Open' };

    if (category) filter.category = category;

    if (minBudget || maxBudget) {
      filter.budget = {};

      if (minBudget) {
        filter.budget.$gte = Number(minBudget);
      }

      if (maxBudget) {
        filter.budget.$lte = Number(maxBudget);
      }
    }

    if (search) {
      filter.$or = [
        {
          title: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          description: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          requiredSkills: {
            $in: [new RegExp(search, 'i')],
          },
        },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate('businessId', 'name location')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),

      Task.countDocuments(filter),
    ]);

    const tasksWithCount = await Promise.all(
      tasks.map(async (task) => {
        const pitchCount = await Pitch.countDocuments({
          taskId: task._id,
        });

        return {
          ...task.toObject(),
          pitchCount,
        };
      })
    );

    res.json({
      tasks: tasksWithCount,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};

// ─────────────────────────────────────────
// Get Business Tasks
// ─────────────────────────────────────────

exports.getMyTasks = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const { status } = req.query;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const filter = {
      businessId: userId,
      status: { $ne: 'Paid' },
    };

    if (status) {
      filter.status = status;
    }

    const tasks = await Task.find(filter)
      .populate('assignedStudentId', 'name email')
      .populate(
        'shortlistedPitchId',
        'proposedPrice timeline studentId'
      )
      .sort({ createdAt: -1 });

    const tasksWithCount = await Promise.all(
      tasks.map(async (task) => {
        const pitchCount = await Pitch.countDocuments({
          taskId: task._id,
        });

        return {
          ...task.toObject(),
          pitchCount,
        };
      })
    );

    res.json({
      tasks: tasksWithCount,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};

// ─────────────────────────────────────────
// Get Applied Tasks
// ─────────────────────────────────────────

exports.getAppliedTasks = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const pitches = await Pitch.find({
      studentId: userId,
    })
      .populate({
        path: 'taskId',
        populate: {
          path: 'businessId',
          select: 'name location',
        },
      })
      .sort({ createdAt: -1 });

    const applied = pitches.map((p) => ({
      pitchId: p._id,
      pitchStatus: p.status,
      proposedPrice: p.proposedPrice,
      timeline: p.timeline,
      aiUsed: p.aiUsed,
      submittedAt: p.submittedAt,
      task: p.taskId,
    }));

    res.json({ applied });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};

// ─────────────────────────────────────────
// Get Single Task
// ─────────────────────────────────────────

exports.getTaskById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid task ID',
      });
    }

    const task = await Task.findById(req.params.id)
      .populate('businessId', 'name phone location')
      .populate('assignedStudentId', 'name email');

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

    const pitchCount = await Pitch.countDocuments({
      taskId: task._id,
    });

    let myPitch = null;

    if (req.user.role === 'student') {
      myPitch = await Pitch.findOne({
        taskId: task._id,
        studentId: getAuthenticatedUserId(req),
      }).select(
        'status proposedPrice timeline aiUsed submittedAt'
      );
    }

    res.json({
      task,
      pitchCount,
      myPitch,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};

// ─────────────────────────────────────────
// Update Task
// ─────────────────────────────────────────

exports.updateTask = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid task ID',
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

    if (
      task.businessId.toString() !==
      userId?.toString()
    ) {
      return res.status(403).json({
        message: 'Not authorised to edit this task',
      });
    }

    if (task.status !== 'Open') {
      return res.status(400).json({
        message:
          'Cannot edit a task that is already in progress',
      });
    }

    const editable = [
      'title',
      'description',
      'budget',
      'deadline',
      'requiredSkills',
      'attachments',
      'isRecurring',
      'recurringSchedule',
      'location',
    ];

    editable.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'location') {
          const loc = req.body.location;
          if (typeof loc === 'string') {
            task.location = { city: loc.trim(), area: '', pincode: '' };
          } else if (typeof loc === 'object') {
            task.location = {
              city: loc.city || task.location?.city || '',
              area: loc.area || task.location?.area || '',
              pincode: loc.pincode || task.location?.pincode || '',
            };
          }
        } else {
          task[field] = req.body[field];
        }
      }
    });

    if (
      req.body.deadline &&
      new Date(req.body.deadline) <= new Date()
    ) {
      return res.status(400).json({
        message: 'Deadline must be in the future',
      });
    }

    await task.save();

    res.json({
      message: 'Task updated',
      task,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};

// ─────────────────────────────────────────
// Update Task Status
// ─────────────────────────────────────────

exports.updateTaskStatus = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid task ID',
      });
    }

    const { status, note } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

    if (
      task.businessId.toString() !==
      userId?.toString()
    ) {
      return res.status(403).json({
        message: 'Not authorised',
      });
    }

    if (
      ['Completed', 'Paid', 'Cancelled'].includes(
        task.status
      )
    ) {
      return res.status(400).json({
        message: `Task is already ${task.status}`,
      });
    }

    const allowed = [
      'Revision',
      'In Progress',
      'Completed',
      'Cancelled',
    ];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        message: `Invalid status: ${status}`,
      });
    }

    task.status = status;

    if (status === 'Completed') {
      task.completedAt = new Date();
    }

    await task.save();

    const progress = await TaskProgress.findOne({
      taskId: task._id,
    });

    if (progress) {
      const stageMap = {
        'In Progress': 'In Progress',
        Revision: 'Revision',
        Completed: 'Completed',
      };

      if (stageMap[status]) {
        progress.history.push({
          stage: stageMap[status],
          note: note || '',
          updatedBy: userId,
        });

        progress.stage = stageMap[status];
        progress.updatedBy = userId;
        progress.notes = note || progress.notes;

        await progress.save();
      }
    }

    res.json({
      message: `Task moved to ${status}`,
      task,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};

// ─────────────────────────────────────────
// Delete Task
// ─────────────────────────────────────────

exports.deleteTask = async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid task ID',
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

    if (
      task.businessId.toString() !==
      userId?.toString()
    ) {
      return res.status(403).json({
        message: 'Not authorised',
      });
    }

    if (!['Open', 'Completed', 'Cancelled'].includes(task.status)) {
      return res.status(400).json({
        message:
          'Cannot delete a task already in progress — use status PATCH to cancel instead',
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    await Pitch.deleteMany({
      taskId: req.params.id,
    });

    res.json({
      message:
        'Task and all related pitches deleted successfully',
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};