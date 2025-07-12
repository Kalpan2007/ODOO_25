import express from 'express';
import User from '../models/User.js';
import Question from '../models/Question.js';
import Answer from '../models/Answer.js';
import Tag from '../models/Tag.js';
import Notification from '../models/Notification.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/admin/stats
// @desc    Get admin dashboard stats
// @access  Private/Admin
router.get('/stats', protect, authorize('admin', 'moderator'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalQuestions = await Question.countDocuments();
    const totalAnswers = await Answer.countDocuments();
    const totalTags = await Tag.countDocuments();

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const recentUsers = await User.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo },
      isActive: true 
    });
    const recentQuestions = await Question.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo } 
    });
    const recentAnswers = await Answer.countDocuments({ 
      createdAt: { $gte: thirtyDaysAgo } 
    });

    // Top users by reputation
    const topUsers = await User.find({ isActive: true })
      .select('username avatar reputation badges')
      .sort({ reputation: -1 })
      .limit(5);

    // Most active tags
    const topTags = await Tag.find()
      .select('name questionCount color')
      .sort({ questionCount: -1 })
      .limit(5);

    // Recent questions
    const recentQuestionsList = await Question.find()
      .select('title author createdAt votes views')
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        total: {
          users: totalUsers,
          questions: totalQuestions,
          answers: totalAnswers,
          tags: totalTags
        },
        recent: {
          users: recentUsers,
          questions: recentQuestions,
          answers: recentAnswers
        },
        topUsers,
        topTags,
        recentQuestions: recentQuestionsList.map(q => ({
          ...q.toObject(),
          voteScore: q.votes.up.length - q.votes.down.length
        }))
      }
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users for admin
// @access  Private/Admin
router.get('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const { search, role, status } = req.query;

    let query = {};
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role && role !== 'all') {
      query.role = role;
    }
    
    if (status && status !== 'all') {
      query.isActive = status === 'active';
    }

    const users = await User.find(query)
      .select('username email avatar reputation role isActive createdAt lastSeen')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Private/Admin
router.put('/users/:id/role', protect, authorize('admin'), async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'moderator', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Ban/unban user
// @access  Private/Admin
router.put('/users/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/questions
// @desc    Get all questions for admin
// @access  Private/Admin
router.get('/questions', protect, authorize('admin', 'moderator'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const { search, status } = req.query;

    let query = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }

    const questions = await Question.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'username avatar reputation')
      .populate('answers', '_id');

    const total = await Question.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    const questionsWithVirtuals = questions.map(question => ({
      ...question.toObject(),
      voteScore: question.votes.up.length - question.votes.down.length,
      answerCount: question.answers.length
    }));

    res.json({
      success: true,
      questions: questionsWithVirtuals,
      pagination: {
        currentPage: page,
        totalPages,
        totalQuestions: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get admin questions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/questions/:id/feature
// @desc    Feature/unfeature question
// @access  Private/Admin
router.put('/questions/:id/feature', protect, authorize('admin', 'moderator'), async (req, res) => {
  try {
    const { featured } = req.body;

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { featured },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json({
      success: true,
      question
    });
  } catch (error) {
    console.error('Feature question error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;