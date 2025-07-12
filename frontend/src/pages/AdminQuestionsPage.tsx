import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Search, Filter, ChevronLeft, ChevronRight, Star, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Question {
  _id: string;
  title: string;
  body: string;
  author: {
    _id: string;
    username: string;
    avatar: string;
  };
  tags: string[];
  createdAt: string;
  views: number;
  voteScore: number;
  answerCount: number;
  featured: boolean;
  status: 'open' | 'closed' | 'duplicate';
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalQuestions: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const AdminQuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalQuestions: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, [pagination.currentPage, statusFilter]);

  const fetchQuestions = async (search = searchQuery) => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/admin/questions', {
        params: {
          page: pagination.currentPage,
          limit: 10,
          search,
          status: statusFilter,
        },
      });

      if (response.data.success) {
        setQuestions(response.data.questions);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchQuestions(searchQuery);
  };

  const handleFeatureToggle = async (questionId: string, featured: boolean) => {
    try {
      setUpdateLoading(questionId);
      const response = await axios.put(`/api/admin/questions/${questionId}/feature`, {
        featured,
      });

      if (response.data.success) {
        setQuestions(questions.map(question => 
          question._id === questionId ? { ...question, featured } : question
        ));
      }
    } catch (error) {
      console.error('Failed to update question featured status:', error);
    } finally {
      setUpdateLoading(null);
    }
  };

  const changePage = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, currentPage: newPage });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading && questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Questions</h1>
          <p className="text-gray-600 mt-1">
            Review and moderate questions on the platform
          </p>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="duplicate">Duplicate</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Questions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Question
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stats
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {questions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No questions found
                  </td>
                </tr>
              ) : (
                questions.map((question) => (
                  <tr key={question._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        {question.featured && (
                          <Star className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0 mt-1" />
                        )}
                        <div>
                          <Link 
                            to={`/questions/${question._id}`}
                            className="text-base font-medium text-primary-600 hover:text-primary-700"
                          >
                            {question.title}
                          </Link>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {question.tags.map((tag, index) => (
                              <span 
                                key={index} 
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <img
                            className="h-8 w-8 rounded-full"
                            src={question.author.avatar || `https://ui-avatars.com/api/?name=${question.author.username}&background=random`}
                            alt={question.author.username}
                          />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {question.author.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center space-x-4">
                          <div>
                            <span className="font-medium">{question.voteScore}</span>
                            <span className="text-gray-500 ml-1">votes</span>
                          </div>
                          <div>
                            <span className="font-medium">{question.answerCount}</span>
                            <span className="text-gray-500 ml-1">answers</span>
                          </div>
                          <div>
                            <span className="font-medium">{question.views}</span>
                            <span className="text-gray-500 ml-1">views</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(question.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {updateLoading === question._id ? (
                        <div className="animate-pulse">Updating...</div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleFeatureToggle(question._id, !question.featured)}
                            className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded ${question.featured ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                          >
                            <Star className="h-3.5 w-3.5 mr-1" />
                            {question.featured ? 'Unfeature' : 'Feature'}
                          </button>
                          
                          <Link
                            to={`/questions/${question._id}`}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded bg-primary-100 text-primary-700 hover:bg-primary-200"
                          >
                            <MessageSquare className="h-3.5 w-3.5 mr-1" />
                            View
                          </Link>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(pagination.currentPage - 1) * 10 + 1}</span> to <span className="font-medium">{Math.min(pagination.currentPage * 10, pagination.totalQuestions)}</span> of <span className="font-medium">{pagination.totalQuestions}</span> questions
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => changePage(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </button>
              <button
                onClick={() => changePage(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminQuestionsPage;