import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: '',
    maxlength: 500
  },
  reputation: {
    type: Number,
    default: 0
  },
  badges: [{
    name: String,
    icon: String,
    color: String,
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  location: String,
  website: String,
  github: String,
  linkedin: String,
  twitter: String,
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update reputation and badges
userSchema.methods.updateReputation = function(points) {
  this.reputation += points;
  
  // Award badges based on reputation
  const badges = [];
  if (this.reputation >= 100 && !this.badges.find(b => b.name === 'Bronze Contributor')) {
    badges.push({ name: 'Bronze Contributor', icon: '🥉', color: '#CD7F32' });
  }
  if (this.reputation >= 500 && !this.badges.find(b => b.name === 'Silver Expert')) {
    badges.push({ name: 'Silver Expert', icon: '🥈', color: '#C0C0C0' });
  }
  if (this.reputation >= 1000 && !this.badges.find(b => b.name === 'Gold Master')) {
    badges.push({ name: 'Gold Master', icon: '🥇', color: '#FFD700' });
  }
  
  this.badges.push(...badges);
  return this.save();
};

export default mongoose.model('User', userSchema);