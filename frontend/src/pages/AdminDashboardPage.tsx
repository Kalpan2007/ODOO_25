import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Users,
  MessageSquare,
  Tag,
  Flag,
  TrendingUp,
  TrendingDown,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface AdminStats {
  totalUsers: number;
  newUsersToday: number;
  totalQuestions: number;
  questionsToday: number;
  totalAnswers: number;
  answersToday: number;
  totalTags: number;
  flaggedContent: number;
  pendingReports: number;
}

interface RecentActivity {
  _id: string;
  type: 'user_joined' | 'question_asked' | 'answer_posted' | 'report_submitted';
  title: string;
  description: string;
  user?: {
    username: string;
    avatar: string;
  };
  createdAt: string;
}

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    newUsersToday: 0,
    totalQuestions: 0,
    questionsToday: 0,
    totalAnswers: 0,
    answersToday: 0,
    totalTags: 0,
    flaggedContent: 0,
    pendingReports: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setIsLoading(true);
      // In a real application, this would be an API call
      // Mock data for demonstration purposes
      setStats({
        totalUsers: 3245,
        newUsersToday: 42,
        totalQuestions: 18750,
        questionsToday: 125,
        totalAnswers: 24680,
        answersToday: 210,
        totalTags: 450,
        flaggedContent: 15,
        pendingReports: 8,
      });

      setRecentActivity([
        {
          _id: '1',
          type: 'user_joined',
          title: 'New User Registration',
          description: 'user123 joined the platform',
          user: {
            username: 'user123',
            avatar: 'https://ui-avatars.com/api/?name=User+123&background=random',
          },
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        },
        {
          _id: '2',
          type: 'question_asked',
          title: 'New Question Posted',
          description: 'How to implement authentication in React?',
          user: {
            username: 'reactdev',
            avatar: 'https://ui-avatars.com/api/?name=React+Dev&background=random',
          },
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '3',
          type: 'report_submitted',
          title: 'Content Reported',
          description: 'Answer reported for inappropriate content',
          user: {
            username: 'moderator1',
            avatar: 'https://ui-avatars.com/api/?name=Moderator&background=random',
          },
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_joined':
        return <Users className="text-primary-500" />;
      case 'question_asked':
        return <MessageSquare className="text-secondary-500" />;
      case 'answer_posted':
        return <CheckCircle className="text-green-500" />;
      case 'report_submitted':
        return <AlertTriangle className="text-amber-500" />;
      default:
        return <Clock className="text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.username}. Here's what's happening on your platform.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchAdminData}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Clock size={16} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Users Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Users</h3>
            <div className="p-2 bg-primary-50 rounded-full">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-1">Total registered users</p>
            </div>
            <div className="flex items-center text-green-600">
              <TrendingUp size={16} className="mr-1" />
              <span className="text-sm font-medium">+{stats.newUsersToday} today</span>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/admin/users"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View all users
            </Link>
          </div>
        </motion.div>

        {/* Questions Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Questions</h3>
            <div className="p-2 bg-secondary-50 rounded-full">
              <MessageSquare className="h-6 w-6 text-secondary-600" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalQuestions.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-1">Total questions asked</p>
            </div>
            <div className="flex items-center text-green-600">
              <TrendingUp size={16} className="mr-1" />
              <span className="text-sm font-medium">+{stats.questionsToday} today</span>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/admin/questions"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Manage questions
            </Link>
          </div>
        </motion.div>

        {/* Tags Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
            <div className="p-2 bg-accent-50 rounded-full">
              <Tag className="h-6 w-6 text-accent-600" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{stats.totalTags.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-1">Total tags created</p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/admin/tags"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Manage tags
            </Link>
          </div>
        </motion.div>

        {/* Flagged Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Flagged Content</h3>
            <div className="p-2 bg-red-50 rounded-full">
              <Flag className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{stats.flaggedContent}</p>
              <p className="text-sm text-gray-600 mt-1">Items requiring review</p>
            </div>
            {stats.flaggedContent > 0 && (
              <div className="flex items-center text-amber-600">
                <AlertTriangle size={16} className="mr-1" />
                <span className="text-sm font-medium">Needs attention</span>
              </div>
            )}
          </div>
          <div className="mt-4">
            <Link
              to="/admin/reports"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Review flagged content
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {recentActivity.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No recent activity to display</div>
          ) : (
            recentActivity.map((activity) => (
              <div key={activity._id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-gray-100">
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{activity.title}</h4>
                        <p className="text-gray-600 mt-1">{activity.description}</p>
                        
                        {activity.user && (
                          <div className="flex items-center mt-2 text-sm text-gray-500">
                            <img
                              src={activity.user.avatar}
                              alt={activity.user.username}
                              className="w-5 h-5 rounded-full mr-2"
                            />
                            <span>{activity.user.username}</span>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <span className="text-xs text-gray-500">
                          {new Date(activity.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/users"
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary-100 rounded-full group-hover:bg-primary-200 transition-colors">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Manage Users</h3>
              <p className="text-sm text-gray-600">View, edit, and manage user accounts</p>
            </div>
          </div>
        </Link>
        
        <Link
          to="/admin/questions"
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-secondary-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-secondary-100 rounded-full group-hover:bg-secondary-200 transition-colors">
              <MessageSquare className="h-6 w-6 text-secondary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Manage Questions</h3>
              <p className="text-sm text-gray-600">Review and moderate questions</p>
            </div>
          </div>
        </Link>
        
        <Link
          to="/admin/tags"
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-accent-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-accent-100 rounded-full group-hover:bg-accent-200 transition-colors">
              <Tag className="h-6 w-6 text-accent-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Manage Tags</h3>
              <p className="text-sm text-gray-600">Create, edit, and organize tags</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage;