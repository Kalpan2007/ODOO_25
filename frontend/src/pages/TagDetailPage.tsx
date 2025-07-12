import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Hash, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  Eye, 
  ThumbsUp,
  Star,
  Plus
} from 'lucide-react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface Tag {
  _id: string;
  name: string;
  description: string;
  color: string;
  questionCount: number;
  followers: string[];
  featured: boolean;
}

interface Question {
  _id: string;
  title: string;
  content: string;
  author: {
    username: string;
    avatar: string;
    reputation: number;
  };
  tags: string[];
  voteScore: number;
  answerCount: number;
  views: number;
  acceptedAnswer?: any;
  createdAt: string;
}

const TagDetailPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const { user, isAuthenticated } = useAuth();
  const [tag, setTag] = useState<Tag | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (name) {
      fetchTagData();
    }
  }, [name]);

  const fetchTagData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/tags/${name}`);
      setTag(response.data.tag);
      setQuestions(response.data.questions || []);
      
      if (user && response.data.tag) {
        setIsFollowing(response.data.tag.followers.includes(user.id));
      }
    } catch (error) {
      console.error('Failed to fetch tag data:', error);
      toast.error('Failed to load tag information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to follow tags');
      return;
    }

    try {
      const response = await axios.put(`/tags/${name}/follow`);
      setIsFollowing(response.data.isFollowing);
      
      if (tag) {
        setTag({
          ...tag,
          followers: response.data.isFollowing 
            ? [...tag.followers, user!.id]
            : tag.followers.filter(id => id !== user!.id)
        });
      }
      
      toast.success(response.data.isFollowing ? 'Tag followed!' : 'Tag unfollowed!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update follow status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!tag) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tag not found</h2>
        <Link to="/tags" className="text-primary-600 hover:text-primary-700">
          Back to Tags
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tag Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <div 
                className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-2xl font-bold"
                style={{ backgroundColor: tag.color }}
              >
                <Hash size={32} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">#{tag.name}</h1>
                {tag.featured && (
                  <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm mt-2">
                    <Star size={16} className="mr-1" />
                    Featured Tag
                  </span>
                )}
              </div>
            </div>
            
            <p className="text-gray-600 text-lg mb-6">
              {tag.description || 'No description available for this tag.'}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{tag.questionCount}</div>
                <div className="text-gray-600 text-sm">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{tag.followers.length}</div>
                <div className="text-gray-600 text-sm">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {questions.filter(q => q.acceptedAnswer).length}
                </div>
                <div className="text-gray-600 text-sm">Answered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(questions.reduce((sum, q) => sum + q.voteScore, 0) / questions.length) || 0}
                </div>
                <div className="text-gray-600 text-sm">Avg Score</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            {isAuthenticated && (
              <button
                onClick={handleFollowToggle}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  isFollowing
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow Tag'}
              </button>
            )}
            
            <Link
              to={`/ask?tag=${tag.name}`}
              className="inline-flex items-center px-6 py-3 bg-secondary-600 text-white rounded-lg font-semibold hover:bg-secondary-700 transition-colors"
            >
              <Plus className="mr-2" size={20} />
              Ask Question
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Questions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Questions tagged with #{tag.name}
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>{questions.length} questions</span>
          </div>
        </div>

        {questions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No questions yet</h3>
            <p className="text-gray-600 mb-4">
              Be the first to ask a question with this tag!
            </p>
            <Link
              to={`/ask?tag=${tag.name}`}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="mr-2" size={16} />
              Ask the First Question
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <motion.div
                key={question._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  {/* Stats */}
                  <div className="flex flex-col items-center space-y-2 text-sm text-gray-500 min-w-0">
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span className={`font-medium ${
                        question.voteScore > 0 ? 'text-green-600' : 
                        question.voteScore < 0 ? 'text-red-600' : ''
                      }`}>
                        {question.voteScore}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span className={question.answerCount > 0 ? 'text-green-600' : ''}>
                        {question.answerCount}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{question.views}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <Link
                        to={`/questions/${question._id}`}
                        className="text-xl font-semibold text-gray-900 hover:text-primary-600 line-clamp-2"
                      >
                        {question.title}
                      </Link>
                      
                      {question.acceptedAnswer && (
                        <span className="flex items-center space-x-1 text-green-600 text-sm ml-4">
                          <MessageSquare size={16} />
                          <span className="font-medium">Answered</span>
                        </span>
                      )}
                    </div>

                    <div className="text-gray-600 mb-3 line-clamp-2">
                      {question.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {question.tags.slice(0, 5).map((questionTag) => (
                        <Link
                          key={questionTag}
                          to={`/tags/${questionTag}`}
                          className={`px-2 py-1 text-xs rounded-md transition-colors ${
                            questionTag === tag.name
                              ? 'bg-primary-100 text-primary-700 font-medium'
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                        >
                          {questionTag}
                        </Link>
                      ))}
                    </div>

                    {/* Author and Time */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Clock size={14} />
                        <span>
                          asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      
                      <Link
                        to={`/users/${question.author.username}`}
                        className="flex items-center space-x-2 hover:text-primary-600 transition-colors"
                      >
                        {question.author.avatar ? (
                          <img
                            src={question.author.avatar}
                            alt={question.author.username}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              {question.author.username[0].toUpperCase()}
                            </span>
                          </div>
                        )}
                        <span className="font-medium">{question.author.username}</span>
                        <span className="text-orange-600 font-medium">
                          {question.author.reputation.toLocaleString()}
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Related Tags */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Tags</h3>
        <div className="flex flex-wrap gap-2">
          {/* This would typically come from the API */}
          {['javascript', 'react', 'typescript', 'nodejs', 'css'].map((relatedTag) => (
            <Link
              key={relatedTag}
              to={`/tags/${relatedTag}`}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
            >
              #{relatedTag}
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TagDetailPage;