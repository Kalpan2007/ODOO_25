import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bell,
  Check,
  CheckCircle,
  MessageSquare,
  ThumbsUp,
  Award,
  User,
  AlertCircle,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationsPage: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead, fetchNotifications } = useNotifications();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      setIsLoading(true);
      await fetchNotifications();
      setIsLoading(false);
    };

    loadNotifications();
  }, [fetchNotifications]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'answer':
        return <MessageSquare className="text-primary-500" />;
      case 'comment':
        return <MessageSquare className="text-secondary-500" />;
      case 'vote':
        return <ThumbsUp className="text-green-500" />;
      case 'accept':
        return <CheckCircle className="text-green-600" />;
      case 'mention':
        return <User className="text-blue-500" />;
      case 'badge':
        return <Award className="text-amber-500" />;
      case 'system':
        return <AlertCircle className="text-purple-500" />;
      default:
        return <Bell className="text-gray-500" />;
    }
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleRefresh = () => {
    fetchNotifications();
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            Stay updated with your activity and interactions
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
          
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Check size={16} />
            <span>Mark All as Read</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <Bell size={48} className="text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No notifications yet</h3>
            <p className="text-gray-500 max-w-md">
              When you receive notifications about your questions, answers, or other activities,
              they will appear here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <motion.li
                key={notification._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-primary-50' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-gray-100">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{notification.title}</h4>
                        <p className="text-gray-600 mt-1">{notification.message}</p>
                        
                        {notification.sender && (
                          <div className="flex items-center mt-2 text-sm text-gray-500">
                            <img
                              src={notification.sender.avatar}
                              alt={notification.sender.username}
                              className="w-5 h-5 rounded-full mr-2"
                            />
                            <span>{notification.sender.username}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </span>
                        
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification._id)}
                            className="mt-2 text-xs text-primary-600 hover:text-primary-700 flex items-center"
                          >
                            <Check size={12} className="mr-1" />
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {notification.link && (
                      <div className="mt-2">
                        <Link
                          to={notification.link}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          View details
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;