import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Calendar,
  Award,
  MessageSquare,
  ThumbsUp,
  CheckCircle,
  TrendingUp,
  Clock,
  Eye,
} from 'lucide-react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

interface UserProfile {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  reputation: number;
  badges: Array<{
    name: string;
    icon: string;
    color: string;
    earnedAt: string;
  }>;
  role: string;
  joinedAt: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  stats: {
    totalQuestions: number;
    totalAnswers: number;
    acceptedAnswers: number;
    acceptanceRate: string;
  };
  recentQuestions: Array<{
    _id: string;
    title: string;
    voteScore: number;
    answerCount: number;
    views: number;
    createdAt: string;
  }>;
  recentAnswers: Array<{
    _id: string;
    content: string;
    voteScore: number;
    isAccepted: boolean;
    createdAt: string;
    question: {
      title: string;
    };
  }>;
}

const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      fetchUserProfile();
    }
  }, [id]);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/users/${id}`);
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">User not found</h2>
        <Link to="/users" className="text-primary-600 hover:text-primary-700">
          Back to Users
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'questions', label: 'Questions', icon: MessageSquare },
    { id: 'answers', label: 'Answers', icon: CheckCircle },
    { id: 'activity', label: 'Activity', icon: TrendingUp },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-32"></div>
        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-end md:space-x-6 -mt-16">
            {/* Avatar */}
            <div className="relative">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-32 h-32 rounded-full border-4 border-white object-cover"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-300 rounded-full border-4 border-white flex items-center justify-center">
                  <User size={48} className="text-gray-600" />
                </div>
              )}
              {user.role !== 'user' && (
                <span className={`absolute -bottom-2 -right-2 px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === 'admin' 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {user.role}
                </span>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 mt-4 md:mt-0">
              <h1 className="text-3xl font-bold text-gray-900">{user.username}</h1>
              {user.bio && (
                <p className="text-gray-600 mt-2 max-w-2xl">{user.bio}</p>
              )}
              
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600">
                {user.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin size={16} />
                    <span>{user.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Calendar size={16} />
                  <span>Joined {formatDistanceToNow(new Date(user.joinedAt), { addSuffix: true })}</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-3 mt-4">
                {user.website && (
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    <Globe size={20} />
                  </a>
                )}
                {user.github && (
                  <a
                    href={`https://github.com/${user.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    <Github size={20} />
                  </a>
                )}
                {user.linkedin && (
                  <a
                    href={`https://linkedin.com/in/${user.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    <Linkedin size={20} />
                  </a>
                )}
                {user.twitter && (
                  <a
                    href={`https://twitter.com/${user.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-primary-600 transition-colors"
                  >
                    <Twitter size={20} />
                  </a>
                )}
              </div>
            </div>

            {/* Reputation */}
            <div className="text-center md:text-right mt-4 md:mt-0">
              <div className="text-3xl font-bold text-orange-600">
                {user.reputation.toLocaleString()}
              </div>
              <div className="text-gray-600">reputation</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <MessageSquare className="h-8 w-8 text-primary-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{user.stats.totalQuestions}</div>
          <div className="text-gray-600 text-sm">Questions</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <CheckCircle className="h-8 w-8 text-secondary-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{user.stats.totalAnswers}</div>
          <div className="text-gray-600 text-sm">Answers</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <Award className="h-8 w-8 text-accent-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{user.stats.acceptedAnswers}</div>
          <div className="text-gray-600 text-sm">Accepted</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{user.stats.acceptanceRate}%</div>
          <div className="text-gray-600 text-sm">Accept Rate</div>
        </div>
      </motion.div>

      {/* Badges */}
      {user.badges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Badges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.badges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <div className="font-medium text-gray-900">{badge.name}</div>
                  <div className="text-sm text-gray-600">
                    Earned {formatDistanceToNow(new Date(badge.earnedAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-md"
      >
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Recent Questions */}
              {user.recentQuestions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Questions</h3>
                  <div className="space-y-3">
                    {user.recentQuestions.map((question) => (
                      <div key={question._id} className="border border-gray-200 rounded-lg p-4">
                        <Link
                          to={`/questions/${question._id}`}
                          className="text-lg font-medium text-gray-900 hover:text-primary-600 block mb-2"
                        >
                          {question.title}
                        </Link>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <ThumbsUp size={14} className="mr-1" />
                            {question.voteScore}
                          </span>
                          <span className="flex items-center">
                            <MessageSquare size={14} className="mr-1" />
                            {question.answerCount}
                          </span>
                          <span className="flex items-center">
                            <Eye size={14} className="mr-1" />
                            {question.views}
                          </span>
                          <span className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Answers */}
              {user.recentAnswers.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Answers</h3>
                  <div className="space-y-3">
                    {user.recentAnswers.map((answer) => (
                      <div key={answer._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <Link
                            to={`/questions/${answer._id}`}
                            className="text-lg font-medium text-gray-900 hover:text-primary-600"
                          >
                            {answer.question.title}
                          </Link>
                          {answer.isAccepted && (
                            <span className="flex items-center text-green-600 text-sm">
                              <CheckCircle size={16} className="mr-1" />
                              Accepted
                            </span>
                          )}
                        </div>
                        <div className="text-gray-600 mb-2 line-clamp-2">
                          {answer.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <ThumbsUp size={14} className="mr-1" />
                            {answer.voteScore}
                          </span>
                          <span className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'questions' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">All Questions</h3>
              <p className="text-gray-600">Questions tab content would go here...</p>
            </div>
          )}

          {activeTab === 'answers' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">All Answers</h3>
              <p className="text-gray-600">Answers tab content would go here...</p>
            </div>
          )}

          {activeTab === 'activity' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h3>
              <p className="text-gray-600">Activity timeline would go here...</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfilePage;