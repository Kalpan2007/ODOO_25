import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['answer', 'comment', 'vote', 'accept', 'mention', 'badge', 'system'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  link: String,
  isRead: {
    type: Boolean,
    default: false
  },
  data: {
    questionId: mongoose.Schema.Types.ObjectId,
    answerId: mongoose.Schema.Types.ObjectId,
    badgeName: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Notification', notificationSchema);