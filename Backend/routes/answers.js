import express from 'express';
import { body, validationResult } from 'express-validator';
import Answer from '../models/Answer.js';
import Question from '../models/Question.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/answers
// @desc    Create new answer
// @access  Private
router.post('/', protect, [
  body('content').isLength({ min: 20 }).withMessage('Answer must be at least 20 characters'),
  body('questionId').isMongoId().withMessage('Valid question ID required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { content, questionId } = req.body;

    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Create answer
    const answer = await Answer.create({
      content,
      author: req.user.id,
      question: questionId
    });

    // Add answer to question
    question.answers.push(answer._id);
    await question.save();

    // Populate author info
    await answer.populate('author', 'username avatar reputation badges');

    // Create notification for question author
    if (question.author.toString() !== req.user.id) {
      const notification = await Notification.create({
        recipient: question.author,
        sender: req.user.id,
        type: 'answer',
        title: 'New Answer',
        message: `${req.user.username} answered your question: ${question.title}`,
        link: `/questions/${questionId}`,
        data: {
          questionId,
          answerId: answer._id
        }
      });

      // Send real-time notification
      const io = req.app.get('socketio');
      io.to(`user_${question.author}`).emit('notification', notification);
    }

    res.status(201).json({
      success: true,
      answer: {
        ...answer.toObject(),
        voteScore: 0,
        hasVoted: null
      }
    });
  } catch (error) {
    console.error('Create answer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/answers/:id/vote
// @desc    Vote on answer
// @access  Private
router.put('/:id/vote', protect, async (req, res) => {
  try {
    const { type } = req.body; // 'up' or 'down'
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Remove existing votes by this user
    answer.votes.up = answer.votes.up.filter(
      vote => vote.user.toString() !== req.user.id
    );
    answer.votes.down = answer.votes.down.filter(
      vote => vote.user.toString() !== req.user.id
    );

    // Add new vote
    if (type === 'up') {
      answer.votes.up.push({ user: req.user.id });
      // Update author reputation
      await User.findByIdAndUpdate(answer.author, { $inc: { reputation: 10 } });
    } else if (type === 'down') {
      answer.votes.down.push({ user: req.user.id });
      // Update author reputation
      await User.findByIdAndUpdate(answer.author, { $inc: { reputation: -2 } });
    }

    await answer.save();

    res.json({
      success: true,
      voteScore: answer.votes.up.length - answer.votes.down.length,
      hasVoted: {
        up: type === 'up',
        down: type === 'down'
      }
    });
  } catch (error) {
    console.error('Vote answer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/answers/:id/accept
// @desc    Accept answer (question author only)
// @access  Private
router.put('/:id/accept', protect, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    const question = await Question.findById(answer.question);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if user is question author
    if (question.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only question author can accept answers' });
    }

    // Unaccept previous answer if any
    if (question.acceptedAnswer) {
      await Answer.findByIdAndUpdate(question.acceptedAnswer, { isAccepted: false });
    }

    // Accept this answer
    answer.isAccepted = true;
    await answer.save();

    question.acceptedAnswer = answer._id;
    await question.save();

    // Update answer author reputation (+15 for accepted answer)
    await User.findByIdAndUpdate(answer.author, { $inc: { reputation: 15 } });

    // Create notification for answer author
    if (answer.author.toString() !== req.user.id) {
      const notification = await Notification.create({
        recipient: answer.author,
        sender: req.user.id,
        type: 'accept',
        title: 'Answer Accepted',
        message: `Your answer was accepted by ${req.user.username}`,
        link: `/questions/${question._id}`,
        data: {
          questionId: question._id,
          answerId: answer._id
        }
      });

      // Send real-time notification
      const io = req.app.get('socketio');
      io.to(`user_${answer.author}`).emit('notification', notification);
    }

    res.json({
      success: true,
      message: 'Answer accepted successfully'
    });
  } catch (error) {
    console.error('Accept answer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/answers/:id
// @desc    Delete answer
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Check if user is author or admin
    if (answer.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this answer' });
    }

    // Remove answer from question
    await Question.findByIdAndUpdate(answer.question, {
      $pull: { answers: answer._id },
      $unset: answer.isAccepted ? { acceptedAnswer: 1 } : {}
    });

    await Answer.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Answer deleted successfully'
    });
  } catch (error) {
    console.error('Delete answer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;