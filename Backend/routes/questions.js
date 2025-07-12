import express from 'express';
import { body, validationResult } from 'express-validator';
import Question from '../models/Question.js';
import Answer from '../models/Answer.js';
import User from '../models/User.js';
import Tag from '../models/Tag.js';
import Notification from '../models/Notification.js';
import { protect, optional } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/questions
// @desc    Get all questions with pagination and filtering
// @access  Public
router.get('/', optional, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const {
      sort = 'newest',
      tag,
      search,
      status = 'open',
      featured
    } = req.query;

    // Build query
    let query = {};
    
    if (status !== 'all') {
      query.status = status;
    }
    
    if (tag) {
      query.tags = { $in: [tag.toLowerCase()] };
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (featured === 'true') {
      query.featured = true;
    }

    // Build sort
    let sortObj = {};
    switch (sort) {
      case 'newest':
        sortObj = { createdAt: -1 };
        break;
      case 'oldest':
        sortObj = { createdAt: 1 };
        break;
      case 'votes':
        sortObj = { 'votes.up': -1 };
        break;
      case 'views':
        sortObj = { views: -1 };
        break;
      case 'answers':
        sortObj = { answers: -1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }

    const questions = await Question.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .populate('author', 'username avatar reputation badges')
      .populate('acceptedAnswer')
      .lean();

    // Add virtual fields
    const questionsWithVirtuals = questions.map(question => ({
      ...question,
      voteScore: question.votes.up.length - question.votes.down.length,
      answerCount: question.answers.length,
      hasVoted: req.user ? {
        up: question.votes.up.some(vote => vote.user.toString() === req.user.id),
        down: question.votes.down.some(vote => vote.user.toString() === req.user.id)
      } : null
    }));

    const total = await Question.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

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
    console.error('Get questions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/questions/:id
// @desc    Get single question with answers
// @access  Public
router.get('/:id', optional, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'username avatar reputation badges role')
      .populate({
        path: 'answers',
        populate: {
          path: 'author',
          select: 'username avatar reputation badges role'
        }
      })
      .populate('acceptedAnswer');

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Increment view count (only if not the author)
    if (!req.user || req.user.id !== question.author._id.toString()) {
      question.views += 1;
      await question.save();
    }

    // Add voting information
    const questionData = {
      ...question.toObject(),
      voteScore: question.votes.up.length - question.votes.down.length,
      hasVoted: req.user ? {
        up: question.votes.up.some(vote => vote.user.toString() === req.user.id),
        down: question.votes.down.some(vote => vote.user.toString() === req.user.id)
      } : null,
      answers: question.answers.map(answer => ({
        ...answer.toObject(),
        voteScore: answer.votes.up.length - answer.votes.down.length,
        hasVoted: req.user ? {
          up: answer.votes.up.some(vote => vote.user.toString() === req.user.id),
          down: answer.votes.down.some(vote => vote.user.toString() === req.user.id)
        } : null
      }))
    };

    res.json({
      success: true,
      question: questionData
    });
  } catch (error) {
    console.error('Get question error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/questions
// @desc    Create new question
// @access  Private
router.post('/', protect, [
  body('title').isLength({ min: 10 }).withMessage('Title must be at least 10 characters'),
  body('content').isLength({ min: 20 }).withMessage('Content must be at least 20 characters'),
  body('tags').isArray({ min: 1, max: 5 }).withMessage('Must have 1-5 tags')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, tags } = req.body;

    // Create question
    const question = await Question.create({
      title,
      content,
      author: req.user.id,
      tags: tags.map(tag => tag.toLowerCase())
    });

    // Update tag counts
    for (const tagName of tags) {
      await Tag.findOneAndUpdate(
        { name: tagName.toLowerCase() },
        { 
          $inc: { questionCount: 1 },
          $setOnInsert: { name: tagName.toLowerCase() }
        },
        { upsert: true, new: true }
      );
    }

    // Populate author info
    await question.populate('author', 'username avatar reputation badges');

    res.status(201).json({
      success: true,
      question: {
        ...question.toObject(),
        voteScore: 0,
        answerCount: 0,
        hasVoted: null
      }
    });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/questions/:id/vote
// @desc    Vote on question
// @access  Private
router.put('/:id/vote', protect, async (req, res) => {
  try {
    const { type } = req.body; // 'up' or 'down'
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Remove existing votes by this user
    question.votes.up = question.votes.up.filter(
      vote => vote.user.toString() !== req.user.id
    );
    question.votes.down = question.votes.down.filter(
      vote => vote.user.toString() !== req.user.id
    );

    // Add new vote
    if (type === 'up') {
      question.votes.up.push({ user: req.user.id });
      // Update author reputation
      await User.findByIdAndUpdate(question.author, { $inc: { reputation: 10 } });
    } else if (type === 'down') {
      question.votes.down.push({ user: req.user.id });
      // Update author reputation
      await User.findByIdAndUpdate(question.author, { $inc: { reputation: -2 } });
    }

    await question.save();

    res.json({
      success: true,
      voteScore: question.votes.up.length - question.votes.down.length,
      hasVoted: {
        up: type === 'up',
        down: type === 'down'
      }
    });
  } catch (error) {
    console.error('Vote question error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/questions/:id
// @desc    Delete question
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if user is author or admin
    if (question.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this question' });
    }

    // Delete associated answers
    await Answer.deleteMany({ question: question._id });

    // Update tag counts
    for (const tagName of question.tags) {
      await Tag.findOneAndUpdate(
        { name: tagName },
        { $inc: { questionCount: -1 } }
      );
    }

    await Question.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;