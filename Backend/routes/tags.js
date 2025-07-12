import express from 'express';
import Tag from '../models/Tag.js';
import Question from '../models/Question.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/tags
// @desc    Get all tags with pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const { sort = 'popular', search } = req.query;

    let query = {};
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    let sortObj = {};
    switch (sort) {
      case 'popular':
        sortObj = { questionCount: -1 };
        break;
      case 'newest':
        sortObj = { createdAt: -1 };
        break;
      case 'name':
        sortObj = { name: 1 };
        break;
      default:
        sortObj = { questionCount: -1 };
    }

    const tags = await Tag.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    const total = await Tag.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      tags,
      pagination: {
        currentPage: page,
        totalPages,
        totalTags: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tags/popular
// @desc    Get popular tags
// @access  Public
router.get('/popular', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;

    const tags = await Tag.find()
      .sort({ questionCount: -1 })
      .limit(limit);

    res.json({
      success: true,
      tags
    });
  } catch (error) {
    console.error('Get popular tags error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tags/:name
// @desc    Get tag details with questions
// @access  Public
router.get('/:name', async (req, res) => {
  try {
    const tagName = req.params.name.toLowerCase();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const tag = await Tag.findOne({ name: tagName });
    
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    // Get questions with this tag
    const questions = await Question.find({ 
      tags: tagName,
      status: 'open'
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'username avatar reputation badges')
      .populate('answers', '_id');

    const total = await Question.countDocuments({ 
      tags: tagName,
      status: 'open'
    });
    const totalPages = Math.ceil(total / limit);

    const questionsWithVirtuals = questions.map(question => ({
      ...question.toObject(),
      voteScore: question.votes.up.length - question.votes.down.length,
      answerCount: question.answers.length
    }));

    res.json({
      success: true,
      tag,
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
    console.error('Get tag error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/tags/:name/follow
// @desc    Follow/unfollow tag
// @access  Private
router.put('/:name/follow', protect, async (req, res) => {
  try {
    const tagName = req.params.name.toLowerCase();
    
    const tag = await Tag.findOne({ name: tagName });
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    const isFollowing = tag.followers.includes(req.user.id);

    if (isFollowing) {
      tag.followers = tag.followers.filter(
        follower => follower.toString() !== req.user.id
      );
    } else {
      tag.followers.push(req.user.id);
    }

    await tag.save();

    res.json({
      success: true,
      isFollowing: !isFollowing,
      followerCount: tag.followers.length
    });
  } catch (error) {
    console.error('Follow tag error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/tags
// @desc    Create new tag (admin only)
// @access  Private/Admin
router.post('/', protect, authorize('admin', 'moderator'), async (req, res) => {
  try {
    const { name, description, color } = req.body;

    const existingTag = await Tag.findOne({ name: name.toLowerCase() });
    if (existingTag) {
      return res.status(400).json({ message: 'Tag already exists' });
    }

    const tag = await Tag.create({
      name: name.toLowerCase(),
      description,
      color: color || '#6B7280'
    });

    res.status(201).json({
      success: true,
      tag
    });
  } catch (error) {
    console.error('Create tag error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/tags/:name
// @desc    Update tag (admin only)
// @access  Private/Admin
router.put('/:name', protect, authorize('admin', 'moderator'), async (req, res) => {
  try {
    const tagName = req.params.name.toLowerCase();
    const { description, color, featured } = req.body;

    const tag = await Tag.findOne({ name: tagName });
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    if (description !== undefined) tag.description = description;
    if (color !== undefined) tag.color = color;
    if (featured !== undefined) tag.featured = featured;

    await tag.save();

    res.json({
      success: true,
      tag
    });
  } catch (error) {
    console.error('Update tag error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;