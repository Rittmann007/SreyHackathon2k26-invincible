const mongoose = require('mongoose');

const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const BusinessProfile = require('../models/BusinessProfile');
const PortfolioItem = require('../models/PortfolioItem');

const {
  uploadFile,
} = require('../services/appwrite');

const getAuthenticatedUserId = (req) => req.user?.id || req.user?._id;

// ─────────────────────────────────────────
// Get My Profile
// ─────────────────────────────────────────

exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(
      getAuthenticatedUserId(req)
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    let profile = null;

    if (user.role === 'student') {
      profile = await StudentProfile.findOne({
        userId: user._id,
      });
    } else if (user.role === 'business') {
      profile = await BusinessProfile.findOne({
        userId: user._id,
      });
    }

    res.json({
      user,
      profile,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};

// ─────────────────────────────────────────
// Update Basic Profile
// ─────────────────────────────────────────

exports.updateBasicProfile = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      getAuthenticatedUserId(req)
    );

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const {
      name,
      phone,
      city,
      area,
      pincode,
    } = req.body;

    if (name) user.name = name;

    if (phone) user.phone = phone;

    if (city || area || pincode) {
      user.location = {
        city:
          city || user.location?.city,

        area:
          area || user.location?.area,

        pincode:
          pincode ||
          user.location?.pincode,
      };
    }

    if (req.file) {
      const uploaded = await uploadFile(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      user.profilePic = uploaded.url;
    }

    await user.save();

    res.json({
      message: 'Basic profile updated',
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};

// ─────────────────────────────────────────
// Get Public Student Profile
// ─────────────────────────────────────────

exports.getStudentProfile = async (
  req,
  res
) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.userId
      )
    ) {
      return res.status(400).json({
        message: 'Invalid user ID',
      });
    }

    const user = await User.findById(
      req.params.userId
    ).select(
      'name email location profilePic'
    );

    if (!user) {
      return res.status(404).json({
        message: 'Student not found',
      });
    }

    const profile =
      await StudentProfile.findOne({
        userId: user._id,
      });

    const portfolio =
      await PortfolioItem.find({
        userId: user._id,
        featured: true,
      })
        .sort({ createdAt: -1 })
        .limit(6);

    const verifiedWork =
      await PortfolioItem.find({
        userId: user._id,
        proofType: 'clientApproved',
      })
        .sort({ createdAt: -1 })
        .limit(6);

    res.json({
      user,
      profile,
      portfolio,
      verifiedWork,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};

// ─────────────────────────────────────────
// Update Student Profile
// ─────────────────────────────────────────

exports.updateStudentProfile = async (
  req,
  res
) => {
  try {
    const {
      collegeName,
      bio,
      skills,
      tools,
    } = req.body;

    let profile =
      await StudentProfile.findOne({
        userId: getAuthenticatedUserId(req),
      });

    if (!profile) {
      profile = new StudentProfile({
        userId: getAuthenticatedUserId(req),
      });
    }

    if (collegeName !== undefined) {
      profile.collegeName =
        collegeName;
    }

    if (bio !== undefined) {
      profile.bio = bio;
    }

    if (skills !== undefined) {
      profile.skills = skills;
    }

    if (tools !== undefined) {
      profile.tools = tools;
    }

    await profile.save();

    res.json({
      message:
        'Student profile updated',
      profile,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};

// ─────────────────────────────────────────
// Update Business Profile
// ─────────────────────────────────────────

exports.updateBusinessProfile = async (
  req,
  res
) => {
  try {
    const {
      businessName,
      businessType,
      description,
      website,
      location,
    } = req.body;

    let profile =
      await BusinessProfile.findOne({
        userId: getAuthenticatedUserId(req),
      });

    if (!profile) {
      profile = new BusinessProfile({
        userId: getAuthenticatedUserId(req),
        businessName:
          businessName || '',
      });
    }

    if (businessName !== undefined) {
      profile.businessName =
        businessName;
    }

    if (businessType !== undefined) {
      profile.businessType =
        businessType;
    }

    if (description !== undefined) {
      profile.description =
        description;
    }

    if (website !== undefined) {
      profile.website = website;
    }

    if (location !== undefined) {
      profile.location = location;
    }

    await profile.save();

    res.json({
      message:
        'Business profile updated',
      profile,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};

// ─────────────────────────────────────────
// Create Portfolio Item
// ─────────────────────────────────────────

exports.createPortfolioItem = async (
  req,
  res
) => {
  try {
    const {
      title,
      description,
      category,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        message: 'Title is required',
      });
    }

    let mediaUrls = [];

    if (
      req.files &&
      req.files.length > 0
    ) {
      const uploaded =
        await Promise.all(
          req.files.map((f) =>
            uploadFile(
              f.buffer,
              f.originalname,
              f.mimetype
            )
          )
        );

      mediaUrls = uploaded.map(
        (u) => u.url
      );
    }

    const item = new PortfolioItem({
      userId: getAuthenticatedUserId(req),
      taskId: null,
      title,
      description:
        description || '',
      category: category || '',
      mediaUrls,
      proofType: 'studentWork',
      approvedByClient: false,
    });

    await item.save();

    res.status(201).json({
      message:
        'Portfolio item added',
      item,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};

// ─────────────────────────────────────────
// Get Portfolio Items
// ─────────────────────────────────────────

exports.getPortfolioItems = async (
  req,
  res
) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.userId
      )
    ) {
      return res.status(400).json({
        message: 'Invalid user ID',
      });
    }

    const { type } = req.query;

    const filter = {
      userId: req.params.userId,
    };

    if (type) {
      filter.proofType = type;
    }

    const items =
      await PortfolioItem.find(filter)
        .sort({
          featured: -1,
          createdAt: -1,
        });

    res.json({
      portfolio: items,
      total: items.length,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};

// ─────────────────────────────────────────
// Update Portfolio Item
// ─────────────────────────────────────────

exports.updatePortfolioItem = async (
  req,
  res
) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.itemId
      )
    ) {
      return res.status(400).json({
        message:
          'Invalid portfolio item ID',
      });
    }

    const item =
      await PortfolioItem.findById(
        req.params.itemId
      );

    if (!item) {
      return res.status(404).json({
        message:
          'Portfolio item not found',
      });
    }

    if (
      item.userId.toString() !==
      getAuthenticatedUserId(req).toString()
    ) {
      return res.status(403).json({
        message:
          'Not authorised to edit this item',
      });
    }

    const {
      title,
      description,
      category,
    } = req.body;

    if (title !== undefined) {
      item.title = title;
    }

    if (description !== undefined) {
      item.description =
        description;
    }

    if (category !== undefined) {
      item.category = category;
    }

    if (
      req.files &&
      req.files.length > 0
    ) {
      const uploaded =
        await Promise.all(
          req.files.map((f) =>
            uploadFile(
              f.buffer,
              f.originalname,
              f.mimetype
            )
          )
        );

      item.mediaUrls = [
        ...item.mediaUrls,
        ...uploaded.map((u) => u.url),
      ];
    }

    await item.save();

    res.json({
      message:
        'Portfolio item updated',
      item,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};

// ─────────────────────────────────────────
// Toggle Feature Portfolio Item
// ─────────────────────────────────────────

exports.toggleFeaturePortfolioItem =
  async (req, res) => {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(
          req.params.itemId
        )
      ) {
        return res.status(400).json({
          message:
            'Invalid portfolio item ID',
        });
      }

      const item =
        await PortfolioItem.findById(
          req.params.itemId
        );

      if (!item) {
        return res.status(404).json({
          message:
            'Portfolio item not found',
        });
      }

      if (
        item.userId.toString() !==
        getAuthenticatedUserId(req).toString()
      ) {
        return res.status(403).json({
          message: 'Not authorised',
        });
      }

      if (!item.featured) {
        const featuredCount =
          await PortfolioItem.countDocuments(
            {
              userId:
                getAuthenticatedUserId(req),
              featured: true,
            }
          );

        if (featuredCount >= 4) {
          return res.status(400).json({
            message:
              'You can only feature up to 4 items',
          });
        }
      }

      item.featured =
        !item.featured;

      await item.save();

      res.json({
        message: item.featured
          ? 'Item featured'
          : 'Item unfeatured',
        item,
      });
    } catch (err) {
      res.status(500).json({
        message: 'Server error',
        error: err.message,
      });
    }
  };

// ─────────────────────────────────────────
// Delete Portfolio Item
// ─────────────────────────────────────────

exports.deletePortfolioItem = async (
  req,
  res
) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.itemId
      )
    ) {
      return res.status(400).json({
        message:
          'Invalid portfolio item ID',
      });
    }

    const item =
      await PortfolioItem.findById(
        req.params.itemId
      );

    if (!item) {
      return res.status(404).json({
        message:
          'Portfolio item not found',
      });
    }

    if (
      item.userId.toString() !==
      getAuthenticatedUserId(req).toString()
    ) {
      return res.status(403).json({
        message: 'Not authorised',
      });
    }

    if (
      item.proofType ===
      'clientApproved'
    ) {
      return res.status(400).json({
        message:
          'Verified client work cannot be deleted — it is part of your trust record',
      });
    }

    await PortfolioItem.findByIdAndDelete(
      req.params.itemId
    );

    res.json({
      message:
        'Portfolio item deleted',
    });
  } catch (err) {
    res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};