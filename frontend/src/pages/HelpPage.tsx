import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, MessageSquare, FileQuestion, Book, Lightbulb, Code, Search, Mail } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const HelpPage: React.FC = () => {
  const faqs: FAQItem[] = [
    {
      question: 'How do I ask a good question?',
      answer: 'A good question is clear, specific, and shows research effort. Include details about what you\'re trying to accomplish, what you\'ve tried, and any error messages you\'ve encountered. Format your code properly and use relevant tags to help others find and answer your question.'
    },
    {
      question: 'How does the reputation system work?',
      answer: 'You earn reputation when your questions are upvoted, when your answers are upvoted, and when your answers are accepted. You can also earn badges for various achievements on the platform. Higher reputation unlocks more privileges, such as the ability to vote, comment, and moderate content.'
    },
    {
      question: 'How do I format code in my posts?',
      answer: 'You can format code by indenting it with 4 spaces or by wrapping it in backticks (`) for inline code. For code blocks, use triple backticks (```) followed by the language name, then your code, and close with triple backticks. This enables syntax highlighting for better readability.'
    },
    {
      question: 'What should I do if I find a bug or have a feature request?',
      answer: 'If you find a bug or have a feature request, please visit our Contact page and submit a detailed report. Include steps to reproduce the bug or a clear description of the feature you\'d like to see implemented.'
    },
    {
      question: 'How can I edit or delete my posts?',
      answer: 'You can edit your own posts by clicking the "Edit" button below the post. If you need to delete a post, click the "Delete" button. Note that posts with upvoted answers can\'t be deleted, and substantial edits to questions with existing answers are discouraged.'
    },
  ];

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center p-3 bg-primary-50 rounded-full mb-6">
          <HelpCircle className="h-10 w-10 text-primary-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Find answers to common questions and learn how to make the most of our platform.
        </p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-2xl mx-auto"
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl focus:ring-primary-500 focus:border-primary-500"
            placeholder="Search for help topics..."
          />
        </div>
      </motion.div>

      {/* Quick Links */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Quick Help Links</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a href="#faq" className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-primary-50 rounded-full mr-4">
                <FileQuestion className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">FAQs</h3>
            </div>
            <p className="text-gray-600">
              Browse our frequently asked questions for quick answers to common issues.
            </p>
          </a>
          
          <a href="/contact" className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-secondary-50 rounded-full mr-4">
                <MessageSquare className="h-6 w-6 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Contact Support</h3>
            </div>
            <p className="text-gray-600">
              Can't find what you're looking for? Reach out to our support team for assistance.
            </p>
          </a>
          
          <a href="#" className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-amber-50 rounded-full mr-4">
                <Book className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">User Guide</h3>
            </div>
            <p className="text-gray-600">
              Learn how to use our platform effectively with our comprehensive user guide.
            </p>
          </a>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        id="faq"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            >
              <div className="flex items-start">
                <div className="p-2 bg-blue-50 rounded-full mr-4 mt-1">
                  <Lightbulb className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Tips for New Users */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Tips for New Users</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-green-50 rounded-full mr-4">
                <Code className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Complete Your Profile</h3>
            </div>
            <p className="text-gray-600">
              Add a profile picture, bio, and relevant skills to help others understand your background and expertise.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-purple-50 rounded-full mr-4">
                <Search className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Search Before Asking</h3>
            </div>
            <p className="text-gray-600">
              Before posting a new question, search the platform to see if it's already been answered to save time.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Contact Support */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
        <p className="text-lg text-gray-700 mb-6">
          Our support team is ready to assist you with any questions or issues you may have.
        </p>
        <div className="flex justify-center">
          <a
            href="/contact"
            className="flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Mail className="h-5 w-5 mr-2" />
            Contact Support
          </a>
        </div>
      </motion.section>
    </div>
  );
};

export default HelpPage;