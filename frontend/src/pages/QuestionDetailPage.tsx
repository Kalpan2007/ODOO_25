import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Eye,
  Clock,
  Award,
  Check,
  Edit,
  Trash2,
  Flag,
  Share2,
  Bookmark,
  User,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface Question {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    username: string;
    avatar: string;
    reputation: number;
    badges: Array<{ name: string; icon: string; color: string }>;
    role: string;
  };
  tags: string[];
  voteScore: number;
  views: number;
  featured: boolean;
  acceptedAnswer?: string;
  createdAt: string;
  hasVoted?: { up: boolean; down: boolean };
  answers: Answer[];
}

interface Answer {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
    avatar: string;
    reputation: number;
    badges: Array<{ name: string; icon: string; color: string }>;
    role: string;
  };
  voteScore: number;
  isAccepted: boolean;
  createdAt: string;
  hasVoted?: { up: boolean; down: boolean };
}

interface AnswerForm {
  content: string;
}

const QuestionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<AnswerForm>();

  const answerContent = watch('content');

  useEffect(() => {
    if (id) {
      fetchQuestion();
    }
  }, [id]);

  const fetchQuestion = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/questions/${id}`);
      setQuestion(response.data.question);
    } catch (error) {
      console.error('Failed to fetch question:', error);
      toast.error('Failed to load question');
      navigate('/questions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (type: 'up' | 'down', targetType: 'question' | 'answer', targetId?: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to vote');
      return;
    }

    try {
      const endpoint = targetType === 'question' 
        ? `/questions/${id}/vote` 
        : `/answers/${targetId}/vote`;
      
      const response = await axios.put(endpoint, { type });
      
      if (targetType === 'question' && question) {
        setQuestion({
          ...question,
          voteScore: response.data.voteScore,
          hasVoted: response.data.hasVoted,
        });
      } else if (targetType === 'answer' && question) {
        setQuestion({
          ...question,
          answers: question.answers.map(answer =>
            answer._id === targetId
              ? {
                  ...answer,
                  voteScore: response.data.voteScore,
                  hasVoted: response.data.hasVoted,
                }
              : answer
          ),
        });
      }
      
      toast.success('Vote recorded');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to vote');
    }
  };

  const handleAcceptAnswer = async (answerId: string) => {
    if (!isAuthenticated || !question || question.author._id !== user?.id) {
      toast.error('Only the question author can accept answers');
      return;
    }

    try {
      await axios.put(`/answers/${answerId}/accept`);
      setQuestion({
        ...question,
        acceptedAnswer: answerId,
        answers: question.answers.map(answer => ({
          ...answer,
          isAccepted: answer._id === answerId,
        })),
      });
      toast.success('Answer accepted');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to accept answer');
    }
  };

  const onSubmitAnswer = async (data: AnswerForm) => {
    if (!isAuthenticated) {
      toast.error('Please login to answer');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post('/answers', {
        content: data.content,
        questionId: id,
      });

      if (question) {
        setQuestion({
          ...question,
          answers: [...question.answers, response.data.answer],
        });
      }

      reset();
      toast.success('Answer posted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to post answer');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Question not found</h2>
        <Link to="/questions" className="text-primary-600 hover:text-primary-700">
          Back to Questions
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Question */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        {/* Question Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900 flex-1 mr-4">
              {question.title}
            </h1>
            {question.featured && (
              <div className="flex items-center space-x-1 text-yellow-600">
                <Award size={20} />
                <span className="text-sm font-medium">Featured</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock size={16} />
              <span>Asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye size={16} />
              <span>{question.views} views</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageSquare size={16} />
              <span>{question.answers.length} answers</span>
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="p-6">
          <div className="flex items-start space-x-6">
            {/* Voting */}
            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={() => handleVote('up', 'question')}
                disabled={!isAuthenticated}
                className={`p-2 rounded-full transition-colors ${
                  question.hasVoted?.up
                    ? 'bg-green-100 text-green-600'
                    : 'hover:bg-gray-100 text-gray-600'
                } disabled:opacity-50`}
              >
                <ThumbsUp size={24} />
              </button>
              
              <span className={`text-xl font-bold ${
                question.voteScore > 0 ? 'text-green-600' : 
                question.voteScore < 0 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {question.voteScore}
              </span>
              
              <button
                onClick={() => handleVote('down', 'question')}
                disabled={!isAuthenticated}
                className={`p-2 rounded-full transition-colors ${
                  question.hasVoted?.down
                    ? 'bg-red-100 text-red-600'
                    : 'hover:bg-gray-100 text-gray-600'
                } disabled:opacity-50`}
              >
                <ThumbsDown size={24} />
              </button>

              <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                <Bookmark size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div 
                className="prose max-w-none mb-6"
                dangerouslySetInnerHTML={{ __html: question.content }}
              />

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {question.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/tags/${tag}`}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-primary-600">
                    <Share2 size={16} />
                    <span>Share</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-primary-600">
                    <Flag size={16} />
                    <span>Report</span>
                  </button>
                  {isAuthenticated && user?.id === question.author._id && (
                    <button className="flex items-center space-x-1 text-gray-600 hover:text-primary-600">
                      <Edit size={16} />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                {/* Author Info */}
                <Link
                  to={`/users/${question.author._id}`}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {question.author.avatar ? (
                    <img
                      src={question.author.avatar}
                      alt={question.author.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                      <User size={20} className="text-white" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-gray-900">{question.author.username}</div>
                    <div className="text-sm text-gray-600">
                      {question.author.reputation.toLocaleString()} reputation
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Answers */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {question.answers.length} Answer{question.answers.length !== 1 ? 's' : ''}
        </h2>

        {question.answers.map((answer, index) => (
          <motion.div
            key={answer._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-lg shadow-md overflow-hidden ${
              answer.isAccepted ? 'ring-2 ring-green-500' : ''
            }`}
          >
            <div className="p-6">
              <div className="flex items-start space-x-6">
                {/* Voting */}
                <div className="flex flex-col items-center space-y-2">
                  <button
                    onClick={() => handleVote('up', 'answer', answer._id)}
                    disabled={!isAuthenticated}
                    className={`p-2 rounded-full transition-colors ${
                      answer.hasVoted?.up
                        ? 'bg-green-100 text-green-600'
                        : 'hover:bg-gray-100 text-gray-600'
                    } disabled:opacity-50`}
                  >
                    <ThumbsUp size={20} />
                  </button>
                  
                  <span className={`text-lg font-bold ${
                    answer.voteScore > 0 ? 'text-green-600' : 
                    answer.voteScore < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {answer.voteScore}
                  </span>
                  
                  <button
                    onClick={() => handleVote('down', 'answer', answer._id)}
                    disabled={!isAuthenticated}
                    className={`p-2 rounded-full transition-colors ${
                      answer.hasVoted?.down
                        ? 'bg-red-100 text-red-600'
                        : 'hover:bg-gray-100 text-gray-600'
                    } disabled:opacity-50`}
                  >
                    <ThumbsDown size={20} />
                  </button>

                  {isAuthenticated && user?.id === question.author._id && !answer.isAccepted && (
                    <button
                      onClick={() => handleAcceptAnswer(answer._id)}
                      className="p-2 rounded-full hover:bg-green-100 text-gray-600 hover:text-green-600"
                      title="Accept this answer"
                    >
                      <Check size={20} />
                    </button>
                  )}

                  {answer.isAccepted && (
                    <div className="p-2 rounded-full bg-green-100 text-green-600" title="Accepted answer">
                      <Check size={20} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  {answer.isAccepted && (
                    <div className="flex items-center space-x-2 text-green-600 mb-4">
                      <Check size={16} />
                      <span className="font-medium">Accepted Answer</span>
                    </div>
                  )}

                  <div 
                    className="prose max-w-none mb-6"
                    dangerouslySetInnerHTML={{ __html: answer.content }}
                  />

                  {/* Answer Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-1 text-gray-600 hover:text-primary-600">
                        <Share2 size={16} />
                        <span>Share</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-600 hover:text-primary-600">
                        <Flag size={16} />
                        <span>Report</span>
                      </button>
                      {isAuthenticated && user?.id === answer.author._id && (
                        <button className="flex items-center space-x-1 text-gray-600 hover:text-primary-600">
                          <Edit size={16} />
                          <span>Edit</span>
                        </button>
                      )}
                    </div>

                    {/* Answer Author */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 mr-4">
                        answered {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
                      </span>
                      <Link
                        to={`/users/${answer.author._id}`}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        {answer.author.avatar ? (
                          <img
                            src={answer.author.avatar}
                            alt={answer.author.username}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                            <User size={16} className="text-white" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{answer.author.username}</div>
                          <div className="text-xs text-gray-600">
                            {answer.author.reputation.toLocaleString()}
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Answer Form */}
      {isAuthenticated ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">Your Answer</h3>
          
          <form onSubmit={handleSubmit(onSubmitAnswer)} className="space-y-4">
            <div>
              <ReactQuill
                value={answerContent || ''}
                onChange={(content) => setValue('content', content)}
                placeholder="Write your answer here..."
                className="bg-white"
                modules={{
                  toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['blockquote', 'code-block'],
                    ['link', 'image'],
                    ['clean']
                  ],
                }}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">Answer content is required</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !answerContent?.trim()}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Posting...' : 'Post Your Answer'}
              </button>
            </div>
          </form>
        </motion.div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Want to answer?</h3>
          <p className="text-gray-600 mb-4">Please log in to post an answer.</p>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Log In
          </Link>
        </div>
      )}
    </div>
  );
};

export default QuestionDetailPage;