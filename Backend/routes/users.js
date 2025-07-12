import express from 'express';
import User from '../models/User.js';
import Question from '../models/Question.js';
import Answer from '../models/Answer.js';
import { protect, optional } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users with pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const { sort = 'reputation', search } = req.query;

    let query = { isActive: true };
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }

    let sortObj = {};
    switch (sort) {
      case 'reputation':
        sortObj = { reputation: -1 };
        break;
      case 'newest':
        sortObj = { joinedAt: -1 };
        break;
      case 'oldest':
        sortObj = { joinedAt: 1 };
        break;
      case 'name':
        sortObj = { username: 1 };
        break;
      default:
        sortObj = { reputation: -1 };
    }

    const users = await User.find(query)
      .select('-password -email')
      .sort(sortObj)
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
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user profile
// @access  Public
router.get('/:id', optional, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -email');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's questions and answers
    const questions = await Question.find({ author: user._id })
      .select('title createdAt votes answers views')
      .populate('answers', '_id')
      .sort({ createdAt: -1 })
      .limit(10);

    const answers = await Answer.find({ author: user._id })
      .select('content createdAt votes isAccepted')
      .populate('question', 'title')
      .sort({ createdAt: -1 })
      .limit(10);

    // Calculate stats
    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });
    const acceptedAnswers = await Answer.countDocuments({ 
      author: user._id, 
      isAccepted: true 
    });

    const stats = {
      totalQuestions,
      totalAnswers,
      acceptedAnswers,
      acceptanceRate: totalAnswers > 0 ? (acceptedAnswers / totalAnswers * 100).toFixed(1) : 0
    };

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        stats,
        recentQuestions: questions.map(q => ({
          ...q.toObject(),
          voteScore: q.votes.up.length - q.votes.down.length,
          answerCount: q.answers.length
        })),
        recentAnswers: answers.map(a => ({
          ...a.toObject(),
          voteScore: a.votes.up.length - a.votes.down.length
        }))
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id/questions
// @desc    Get user's questions
// @access  Public
router.get('/:id/questions', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const questions = await Question.find({ author: req.params.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'username avatar reputation')
      .populate('answers', '_id');

    const total = await Question.countDocuments({ author: req.params.id });
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
    console.error('Get user questions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id/answers
// @desc    Get user's answers
// @access  Public
router.get('/:id/answers', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const answers = await Answer.find({ author: req.params.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'username avatar reputation')
      .populate('question', 'title');

    const total = await Answer.countDocuments({ author: req.params.id });
    const totalPages = Math.ceil(total / limit);

    const answersWithVirtuals = answers.map(answer => ({
      ...answer.toObject(),
      voteScore: answer.votes.up.length - answer.votes.down.length
    }));

    res.json({
      success: true,
      answers: answersWithVirtuals,
      pagination: {
        currentPage: page,
        totalPages,
        totalAnswers: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get user answers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/leaderboard/top
// @desc    Get top users by reputation
// @access  Public
router.get('/leaderboard/top', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const topUsers = await User.find({ isActive: true })
      .select('username avatar reputation badges joinedAt')
      .sort({ reputation: -1 })
      .limit(limit);

    res.json({
      success: true,
      users: topUsers
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;