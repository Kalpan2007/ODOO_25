import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, MessageSquare } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mx-auto"
      >
        {/* 404 Animation */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="text-9xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            404
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            The page you're looking for seems to have wandered off into the digital void. 
            Don't worry, even the best developers encounter 404s!
          </p>
        </motion.div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Search className="h-8 w-8 text-primary-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Search Questions</h3>
            <p className="text-gray-600 text-sm mb-4">
              Find answers to your coding questions in our extensive database.
            </p>
            <Link
              to="/questions"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              Browse Questions
              <ArrowLeft className="ml-1 h-4 w-4 rotate-180" />
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <MessageSquare className="h-8 w-8 text-secondary-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Ask a Question</h3>
            <p className="text-gray-600 text-sm mb-4">
              Can't find what you're looking for? Ask the community!
            </p>
            <Link
              to="/ask"
              className="inline-flex items-center text-secondary-600 hover:text-secondary-700 font-medium"
            >
              Ask Question
              <ArrowLeft className="ml-1 h-4 w-4 rotate-180" />
            </Link>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            <Home className="mr-2" size={20} />
            Go Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 border-2 border-primary-600 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            <ArrowLeft className="mr-2" size={20} />
            Go Back
          </button>
        </motion.div>

        {/* Fun Element */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-gray-500"
        >
          <p className="text-sm">
            "There are only 10 types of people in the world: those who understand binary and those who don't." 
            <br />
            Unfortunately, this page falls into the latter category. 😄
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;