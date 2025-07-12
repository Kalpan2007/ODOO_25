import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  MessageSquare,
  Users,
  Award,
  ArrowRight,
  Clock,
  Eye,
  ThumbsUp,
} from 'lucide-react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

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
  createdAt: string;
}

interface Stats {
  questions: number;
  answers: number;
  users: number;
  tags: number;
}

const HomePage: React.FC = () => {
  const [featuredQuestions, setFeaturedQuestions] = useState<Question[]>([]);
  const [hotQuestions, setHotQuestions] = useState<Question[]>([]);
  const [stats, setStats] = useState<Stats>({ questions: 0, answers: 0, users: 0, tags: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [featuredRes, hotRes] = await Promise.all([
          axios.get('/questions?featured=true&limit=3'),
          axios.get('/questions?sort=votes&limit=5'),
        ]);

        setFeaturedQuestions(featuredRes.data.questions || []);
        setHotQuestions(hotRes.data.questions || []);
        
        // Mock stats for demo
        setStats({
          questions: 12500,
          answers: 18200,
          users: 3100,
          tags: 450,
        });
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent mb-6"
          >
            Every Developer Needs Answers
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Join the largest community of developers sharing knowledge, solving problems, 
            and building the future together.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/questions"
              className="inline-flex items-center px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Browse Questions
              <ArrowRight className="ml-2" size={20} />
            </Link>
            <Link
              to="/ask"
              className="inline-flex items-center px-8 py-3 border-2 border-primary-600 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
            >
              Ask a Question
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <MessageSquare className="h-12 w-12 text-primary-600 mx-auto mb-2" />
          <div className="text-3xl font-bold text-gray-900">{stats.questions.toLocaleString()}</div>
          <div className="text-gray-600">Questions</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <Users className="h-12 w-12 text-secondary-600 mx-auto mb-2" />
          <div className="text-3xl font-bold text-gray-900">{stats.answers.toLocaleString()}</div>
          <div className="text-gray-600">Answers</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <Award className="h-12 w-12 text-accent-600 mx-auto mb-2" />
          <div className="text-3xl font-bold text-gray-900">{stats.users.toLocaleString()}</div>
          <div className="text-gray-600">Users</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <TrendingUp className="h-12 w-12 text-orange-600 mx-auto mb-2" />
          <div className="text-3xl font-bold text-gray-900">{stats.tags}</div>
          <div className="text-gray-600">Tags</div>
        </div>
      </motion.section>

      {/* Featured Questions */}
      {featuredQuestions.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Questions</h2>
            <Link
              to="/questions?featured=true"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View all featured
            </Link>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {featuredQuestions.map((question) => (
              <motion.div
                key={question._id}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-lg shadow-md border border-yellow-200"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <Award className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-700">Featured</span>
                </div>
                
                <Link
                  to={`/questions/${question._id}`}
                  className="text-lg font-semibold text-gray-900 hover:text-primary-600 line-clamp-2 mb-3"
                >
                  {question.title}
                </Link>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {question.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {question.voteScore}
                    </span>
                    <span className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {question.answerCount}
                    </span>
                  </div>
                  <span>{question.author.username}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Hot Questions */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Hot Questions</h2>
          <Link
            to="/questions?sort=votes"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            View all hot questions
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {hotQuestions.map((question, index) => (
            <div
              key={question._id}
              className={`p-6 ${index !== hotQuestions.length - 1 ? 'border-b border-gray-200' : ''}`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex flex-col items-center space-y-2 text-sm text-gray-500 min-w-0">
                  <div className="flex items-center space-x-2">
                    <ThumbsUp className="h-4 w-4" />
                    <span className="font-medium">{question.voteScore}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>{question.answerCount}</span>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/questions/${question._id}`}
                    className="text-lg font-medium text-gray-900 hover:text-primary-600 block mb-2"
                  >
                    {question.title}
                  </Link>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {question.tags.slice(0, 4).map((tag) => (
                      <Link
                        key={tag}
                        to={`/tags/${tag}`}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md hover:bg-blue-200"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {question.views}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <Link
                      to={`/users/${question.author.username}`}
                      className="flex items-center space-x-2 hover:text-primary-600"
                    >
                      {question.author.avatar ? (
                        <img
                          src={question.author.avatar}
                          alt={question.author.username}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                      )}
                      <span>{question.author.username}</span>
                      <span className="text-orange-600 font-medium">
                        {question.author.reputation}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 md:p-12 text-white text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Join Our Community?
        </h2>
        <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
          Get answers to your questions, help others solve their problems, 
          and build your reputation as a helpful member of the community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Sign Up Free
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;