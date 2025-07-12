import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Filter,
  Search,
  Clock,
  ThumbsUp,
  MessageSquare,
  Eye,
  Award,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';

interface Question {
  _id: string;
  title: string;
  content: string;
  author: {
    username: string;
    avatar: string;
    reputation: number;
    badges: Array<{ name: string; icon: string; color: string }>;
  };
  tags: string[];
  voteScore: number;
  answerCount: number;
  views: number;
  featured: boolean;
  acceptedAnswer?: any;
  createdAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalQuestions: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const QuestionsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const currentPage = parseInt(searchParams.get('page') || '1');
  const sortBy = searchParams.get('sort') || 'newest';
  const tagFilter = searchParams.get('tag') || '';
  const searchFilter = searchParams.get('search') || '';
  const statusFilter = searchParams.get('status') || 'open';
  const featuredFilter = searchParams.get('featured') || '';

  useEffect(() => {
    fetchQuestions();
  }, [currentPage, sortBy, tagFilter, searchFilter, statusFilter, featuredFilter]);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        sort: sortBy,
        ...(tagFilter && { tag: tagFilter }),
        ...(searchFilter && { search: searchFilter }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(featuredFilter && { featured: featuredFilter }),
      });

      const response = await axios.get(`/questions?${params}`);
      setQuestions(response.data.questions || []);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      setQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortChange = (newSort: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', newSort);
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      newParams.set('search', searchQuery.trim());
    } else {
      newParams.delete('search');
    }
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest', icon: Clock },
    { value: 'votes', label: 'Most Voted', icon: ThumbsUp },
    { value: 'views', label: 'Most Viewed', icon: Eye },
    { value: 'answers', label: 'Most Answers', icon: MessageSquare },
    { value: 'oldest', label: 'Oldest', icon: Calendar },
  ];

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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Questions</h1>
          <p className="text-gray-600 mt-1">
            {pagination && (
              <>
                {pagination.totalQuestions.toLocaleString()} questions
                {tagFilter && ` tagged with "${tagFilter}"`}
                {searchFilter && ` matching "${searchFilter}"`}
                {featuredFilter && ' that are featured'}
              </>
            )}
          </p>
        </div>

        {isAuthenticated && (
          <Link
            to="/ask"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            <Plus className="mr-2" size={20} />
            Ask Question
          </Link>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </form>

          {/* Sort Options */}
          <div className="flex flex-wrap gap-2">
            {sortOptions.map((option) => {
              const Icon = option.icon;
              const isActive = sortBy === option.value;
              
              return (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="mr-2" size={16} />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filters */}
        {(tagFilter || searchFilter || featuredFilter) && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
            {tagFilter && (
              <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                Tag: {tagFilter}
                <button
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('tag');
                    newParams.delete('page');
                    setSearchParams(newParams);
                  }}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  ×
                </button>
              </span>
            )}
            {searchFilter && (
              <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                Search: {searchFilter}
                <button
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('search');
                    newParams.delete('page');
                    setSearchParams(newParams);
                    setSearchQuery('');
                  }}
                  className="ml-2 text-green-500 hover:text-green-700"
                >
                  ×
                </button>
              </span>
            )}
            {featuredFilter && (
              <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                Featured only
                <button
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('featured');
                    newParams.delete('page');
                    setSearchParams(newParams);
                  }}
                  className="ml-2 text-yellow-500 hover:text-yellow-700"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
            <p className="text-gray-600 mb-4">
              {searchFilter || tagFilter
                ? 'Try adjusting your search criteria or filters.'
                : 'Be the first to ask a question!'}
            </p>
            {isAuthenticated && (
              <Link
                to="/ask"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="mr-2" size={16} />
                Ask the First Question
              </Link>
            )}
          </div>
        ) : (
          questions.map((question, index) => (
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
                    <span className={`font-medium ${question.voteScore > 0 ? 'text-green-600' : question.voteScore < 0 ? 'text-red-600' : ''}`}>
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
                    
                    {question.featured && (
                      <div className="flex items-center space-x-1 text-yellow-600 ml-4">
                        <Award size={16} />
                        <span className="text-xs font-medium">Featured</span>
                      </div>
                    )}
                  </div>

                  {question.acceptedAnswer && (
                    <div className="flex items-center space-x-1 text-green-600 text-sm mb-2">
                      <MessageSquare size={16} />
                      <span className="font-medium">Answered</span>
                    </div>
                  )}

                  <div className="text-gray-600 mb-3 line-clamp-2">
                    {question.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {question.tags.slice(0, 5).map((tag) => (
                      <Link
                        key={tag}
                        to={`/questions?tag=${tag}`}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md hover:bg-blue-200 transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                    {question.tags.length > 5 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                        +{question.tags.length - 5} more
                      </span>
                    )}
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
                      {question.author.badges.slice(0, 2).map((badge) => (
                        <span key={badge.name} title={badge.name}>
                          {badge.icon}
                        </span>
                      ))}
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-md">
          <div className="text-sm text-gray-600">
            Showing page {pagination.currentPage} of {pagination.totalPages}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            
            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const page = Math.max(1, pagination.currentPage - 2) + i;
                if (page > pagination.totalPages) return null;
                
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-md ${
                      page === pagination.currentPage
                        ? 'bg-primary-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionsPage;