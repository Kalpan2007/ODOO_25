import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Tag, TrendingUp, Clock, Hash, Users } from 'lucide-react';
import axios from 'axios';

interface Tag {
  _id: string;
  name: string;
  description: string;
  color: string;
  questionCount: number;
  followers: string[];
  featured: boolean;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalTags: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const TagsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tags, setTags] = useState<Tag[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const currentPage = parseInt(searchParams.get('page') || '1');
  const sortBy = searchParams.get('sort') || 'popular';
  const searchFilter = searchParams.get('search') || '';

  useEffect(() => {
    fetchTags();
  }, [currentPage, sortBy, searchFilter]);

  const fetchTags = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        sort: sortBy,
        ...(searchFilter && { search: searchFilter }),
      });

      const response = await axios.get(`/tags?${params}`);
      setTags(response.data.tags || []);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
      setTags([]);
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
    { value: 'popular', label: 'Popular', icon: TrendingUp },
    { value: 'newest', label: 'Newest', icon: Clock },
    { value: 'name', label: 'Name', icon: Hash },
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
          Browse Tags
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover topics and technologies that interest you. Follow tags to get personalized question recommendations.
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tags..."
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
        {searchFilter && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
            <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              Search: {searchFilter}
              <button
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.delete('search');
                  newParams.delete('page');
                  setSearchParams(newParams);
                  setSearchQuery('');
                }}
                className="ml-2 text-blue-500 hover:text-blue-700"
              >
                ×
              </button>
            </span>
          </div>
        )}
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <Tag className="h-12 w-12 text-primary-600 mx-auto mb-2" />
          <div className="text-3xl font-bold text-gray-900">
            {pagination?.totalTags.toLocaleString() || '0'}
          </div>
          <div className="text-gray-600">Total Tags</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <TrendingUp className="h-12 w-12 text-secondary-600 mx-auto mb-2" />
          <div className="text-3xl font-bold text-gray-900">
            {tags.filter(tag => tag.questionCount > 100).length}
          </div>
          <div className="text-gray-600">Popular Tags</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <Users className="h-12 w-12 text-accent-600 mx-auto mb-2" />
          <div className="text-3xl font-bold text-gray-900">
            {tags.reduce((sum, tag) => sum + tag.followers.length, 0)}
          </div>
          <div className="text-gray-600">Total Followers</div>
        </div>
      </motion.div>

      {/* Tags Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tags.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-md">
            <Tag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tags found</h3>
            <p className="text-gray-600">
              {searchFilter
                ? 'Try adjusting your search criteria.'
                : 'No tags available at the moment.'}
            </p>
          </div>
        ) : (
          tags.map((tag, index) => (
            <motion.div
              key={tag._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border-l-4"
              style={{ borderLeftColor: tag.color }}
            >
              <div className="flex items-start justify-between mb-3">
                <Link
                  to={`/tags/${tag.name}`}
                  className="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                >
                  #{tag.name}
                </Link>
                {tag.featured && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                    Featured
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-4 line-clamp-2">
                {tag.description || 'No description available.'}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Hash size={14} className="mr-1" />
                    {tag.questionCount} questions
                  </span>
                  <span className="flex items-center">
                    <Users size={14} className="mr-1" />
                    {tag.followers.length} followers
                  </span>
                </div>
                
                <Link
                  to={`/questions?tag=${tag.name}`}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  View Questions →
                </Link>
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

export default TagsPage;