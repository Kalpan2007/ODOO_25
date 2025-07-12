import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart3,
  MessageSquare,
  CheckCircle,
  Award,
  TrendingUp,
  Clock,
  Eye,
  ThumbsUp,
  Plus,
  Bell,
  Users,
  Tag,
} from 'lucide-react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';

interface DashboardStats {
  totalQuestions: number;
  totalAnswers: number;
  acceptedAnswers: number;
  totalViews: number;
  reputationGained: number;
  badgesEarned: number;
}

interface RecentActivity {
  _id: string;
  type: 'question' | 'answer' | 'vote' | 'badge';
  title: string;
  description: string;
  link: string;
  createdAt: string;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalQuestions: 0,
    totalAnswers: 0,
    acceptedAnswers: 0,
    totalViews: 0,
    reputationGained: 0,
    badgesEarned: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      // Mock data for demo - in real app, this would come from API
      setStats({
        totalQuestions: 12,
        totalAnswers: 28,
        acceptedAnswers: 15,
        totalViews: 1250,
        reputationGained: 450,
        badgesEarned: 3,
      });

      setRecentActivity([
        {
          _id: '1',
          type: 'answer',
          title: 'Your answer was accepted',
          description: 'How to center a div in CSS?',
          link: '/questions/1',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '2',
          type: 'question',
          title: 'New question posted',
          description: 'React hooks best practices',
          link: '/questions/2',
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '3',
          type: 'badge',
          title: 'Badge earned',
          description: 'Silver Contributor badge',
          link: '/profile',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your StackIt activity
          </p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <Link
            to="/ask"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            <Plus className="mr-2" size={20} />
            Ask Question
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Questions Asked</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalQuestions}</p>
            </div>
            <MessageSquare className="h-12 w-12 text-primary-600" />
          </div>
          <div className="mt-4">
            <Link to="/questions?author=me" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View all questions →
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Answers Given</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalAnswers}</p>
            </div>
            <CheckCircle className="h-12 w-12 text-secondary-600" />
          </div>
          <div className="mt-4">
            <Link to="/answers?author=me" className="text-secondary-600 hover:text-secondary-700 text-sm font-medium">
              View all answers →
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Accepted Answers</p>
              <p className="text-3xl font-bold text-gray-900">{stats.acceptedAnswers}</p>
            </div>
            <Award className="h-12 w-12 text-accent-600" />
          </div>
          <div className="mt-4">
            <span className="text-accent-600 text-sm font-medium">
              {Math.round((stats.acceptedAnswers / stats.totalAnswers) * 100)}% acceptance rate
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
            </div>
            <Eye className="h-12 w-12 text-blue-600" />
          </div>
          <div className="mt-4">
            <span className="text-blue-600 text-sm font-medium">
              Avg {Math.round(stats.totalViews / stats.totalQuestions)} views per question
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reputation</p>
              <p className="text-3xl font-bold text-gray-900">{user?.reputation.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-12 w-12 text-orange-600" />
          </div>
          <div className="mt-4">
            <span className="text-orange-600 text-sm font-medium">
              +{stats.reputationGained} this month
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Badges Earned</p>
              <p className="text-3xl font-bold text-gray-900">{user?.badges.length || 0}</p>
            </div>
            <Award className="h-12 w-12 text-purple-600" />
          </div>
          <div className="mt-4">
            <Link to={`/users/${user?.id}`} className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              View badges →
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <Bell className="h-5 w-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity._id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${
                  activity.type === 'question' ? 'bg-primary-100 text-primary-600' :
                  activity.type === 'answer' ? 'bg-secondary-100 text-secondary-600' :
                  activity.type === 'badge' ? 'bg-purple-100 text-purple-600' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {activity.type === 'question' && <MessageSquare size={16} />}
                  {activity.type === 'answer' && <CheckCircle size={16} />}
                  {activity.type === 'badge' && <Award size={16} />}
                  {activity.type === 'vote' && <ThumbsUp size={16} />}
                </div>
                
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <Link
                    to={activity.link}
                    className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    {activity.description}
                  </Link>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Link
              to="/notifications"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View all notifications →
            </Link>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>

          <div className="space-y-4">
            <Link
              to="/ask"
              className="flex items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors group"
            >
              <MessageSquare className="h-8 w-8 text-primary-600 mr-4" />
              <div>
                <h3 className="font-medium text-gray-900 group-hover:text-primary-600">Ask a Question</h3>
                <p className="text-sm text-gray-600">Get help from the community</p>
              </div>
            </Link>

            <Link
              to="/questions"
              className="flex items-center p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors group"
            >
              <CheckCircle className="h-8 w-8 text-secondary-600 mr-4" />
              <div>
                <h3 className="font-medium text-gray-900 group-hover:text-secondary-600">Answer Questions</h3>
                <p className="text-sm text-gray-600">Help others and earn reputation</p>
              </div>
            </Link>

            <Link
              to="/tags"
              className="flex items-center p-4 bg-accent-50 rounded-lg hover:bg-accent-100 transition-colors group"
            >
              <Tag className="h-8 w-8 text-accent-600 mr-4" />
              <div>
                <h3 className="font-medium text-gray-900 group-hover:text-accent-600">Browse Tags</h3>
                <p className="text-sm text-gray-600">Discover topics you're interested in</p>
              </div>
            </Link>

            <Link
              to="/users"
              className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors group"
            >
              <Users className="h-8 w-8 text-orange-600 mr-4" />
              <div>
                <h3 className="font-medium text-gray-900 group-hover:text-orange-600">Explore Users</h3>
                <p className="text-sm text-gray-600">Connect with other developers</p>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Achievements Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Keep up the great work!</h2>
            <p className="text-primary-100">
              You're making valuable contributions to the community. Here are some goals to work towards:
            </p>
          </div>
          <Award className="h-16 w-16 text-primary-200" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Next Badge</h3>
            <p className="text-sm text-primary-100">Answer 5 more questions to earn the "Helper" badge</p>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-2 mt-3">
              <div className="bg-white h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>

          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Reputation Goal</h3>
            <p className="text-sm text-primary-100">Reach 1000 reputation to unlock new privileges</p>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-2 mt-3">
              <div className="bg-white h-2 rounded-full" style={{ width: `${(user?.reputation || 0) / 10}%` }}></div>
            </div>
          </div>

          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Community Impact</h3>
            <p className="text-sm text-primary-100">Your answers have helped {stats.totalViews} people</p>
            <div className="flex items-center mt-3">
              <Eye className="h-4 w-4 mr-2" />
              <span className="text-sm">{stats.totalViews} total views</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;