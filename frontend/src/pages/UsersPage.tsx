import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Users, 
  Award, 
  Calendar, 
  TrendingUp,
  User,
  MapPin,
  Globe,
  Github,
  Linkedin
} from 'lucide-react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

interface UserProfile {
  _id: string;
  username: string;
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
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const UsersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const currentPage = parseInt(searchParams.get('page') || '1');
  const sortBy = searchParams.get('sort') || 'reputation';
  const searchFilter = searchParams.get('search') || '';

  useEffect(() => {
    fetchUsers();
  }, [currentPage, sortBy, searchFilter]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        sort: sortBy,
        ...(searchFilter && { search: searchFilter }),
      });

      const response = await axios.get(`/users?${params}`);
      setUsers(response.data.users || []);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
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
    { value: 'reputation', label: 'Reputation', icon: Award },
    { value: 'newest', label: 'Newest', icon: Calendar },
    { value: 'oldest', label: 'Oldest', icon: Calendar },
    { value: 'name', label: 'Name', icon: Users },
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
          Community Members
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover talented developers, learn from their expertise, and connect with the community.
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
                placeholder="Search users by name or bio..."
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
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <Users className="h-12 w-12 text-primary-600 mx-auto mb-2" />
          <div className="text-3xl font-bold text-gray-900">
            {pagination?.totalUsers.toLocaleString() || '0'}
          </div>
          <div className="text-gray-600">Total Users</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <Award className="h-12 w-12 text-secondary-600 mx-auto mb-2" />
          <div className="text-3xl font-bold text-gray-900">
            {users.filter(user => user.reputation > 1000).length}
          </div>
          <div className="text-gray-600">High Rep Users</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <TrendingUp className="h-12 w-12 text-accent-600 mx-auto mb-2" />
          <div className="text-3xl font-bold text-gray-900">
            {users.filter(user => user.badges.length > 0).length}
          </div>
          <div className="text-gray-600">Badge Holders</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <Calendar className="h-12 w-12 text-orange-600 mx-auto mb-2" />
          <div className="text-3xl font-bold text-gray-900">
            {users.filter(user => 
              new Date(user.joinedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            ).length}
          </div>
          <div className="text-gray-600">New This Month</div>
        </div>
      </motion.div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-md">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600">
              {searchFilter
                ? 'Try adjusting your search criteria.'
                : 'No users available at the moment.'}
            </p>
          </div>
        ) : (
          users.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              <div className="text-center mb-4">
                <Link to={`/users/${user._id}`} className="block">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-primary-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <User size={32} className="text-white" />
                    </div>
                  )}
                  
                  <h3 className="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                    {user.username}
                  </h3>
                </Link>
                
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <span className="text-orange-600 font-bold">
                    {user.reputation.toLocaleString()}
                  </span>
                  <span className="text-gray-500 text-sm">reputation</span>
                </div>

                {user.role !== 'user' && (
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                    user.role === 'admin' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                )}
              </div>

              {user.bio && (
                <p className="text-gray-600 text-sm text-center mb-4 line-clamp-2">
                  {user.bio}
                </p>
              )}

              {/* Badges */}
              {user.badges.length > 0 && (
                <div className="flex justify-center space-x-1 mb-4">
                  {user.badges.slice(0, 3).map((badge, badgeIndex) => (
                    <span
                      key={badgeIndex}
                      title={badge.name}
                      className="text-lg"
                    >
                      {badge.icon}
                    </span>
                  ))}
                  {user.badges.length > 3 && (
                    <span className="text-gray-500 text-sm">
                      +{user.badges.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Location and Social Links */}
              <div className="space-y-2 text-sm text-gray-500">
                {user.location && (
                  <div className="flex items-center justify-center space-x-1">
                    <MapPin size={14} />
                    <span>{user.location}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-center space-x-3">
                  {user.website && (
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-primary-600 transition-colors"
                    >
                      <Globe size={16} />
                    </a>
                  )}
                  {user.github && (
                    <a
                      href={`https://github.com/${user.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-primary-600 transition-colors"
                    >
                      <Github size={16} />
                    </a>
                  )}
                  {user.linkedin && (
                    <a
                      href={`https://linkedin.com/in/${user.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-primary-600 transition-colors"
                    >
                      <Linkedin size={16} />
                    </a>
                  )}
                </div>
              </div>

              <div className="text-center text-xs text-gray-500 mt-4">
                Joined {formatDistanceToNow(new Date(user.joinedAt), { addSuffix: true })}
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

export default UsersPage;