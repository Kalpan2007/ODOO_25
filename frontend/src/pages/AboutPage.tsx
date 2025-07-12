import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Award, Code, BookOpen, Heart, Shield, Globe } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Our Platform</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          A community-driven platform for developers to ask questions, share knowledge, and build their careers.
        </p>
      </motion.div>

      {/* Mission Statement */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-8 text-center"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
        <p className="text-lg text-gray-700">
          We're on a mission to help developers write the script of the future by serving as a platform for developers 
          to learn, share their knowledge, and build their careers. We believe that programming knowledge should be 
          freely accessible to everyone, and that developers should help each other grow.
        </p>
      </motion.section>

      {/* Features */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">What We Offer</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-primary-50 rounded-full mr-4">
                <MessageSquare className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Q&A Platform</h3>
            </div>
            <p className="text-gray-600">
              Ask questions, get answers, and find solutions to your programming challenges from a community of experts.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-secondary-50 rounded-full mr-4">
                <Users className="h-6 w-6 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Community</h3>
            </div>
            <p className="text-gray-600">
              Connect with fellow developers, share knowledge, and collaborate on solving complex problems.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-green-50 rounded-full mr-4">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Reputation System</h3>
            </div>
            <p className="text-gray-600">
              Earn reputation and badges by contributing valuable content and helping others in the community.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-amber-50 rounded-full mr-4">
                <Code className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Knowledge Base</h3>
            </div>
            <p className="text-gray-600">
              Access a vast repository of programming knowledge, tutorials, and best practices.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Values */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Our Values</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-50 rounded-full">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Knowledge Sharing</h3>
            <p className="text-gray-600">
              We believe in the free exchange of knowledge and ideas to empower developers worldwide.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-50 rounded-full">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Community First</h3>
            <p className="text-gray-600">
              Our community is at the heart of everything we do, and we strive to create a welcoming environment for all.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-purple-50 rounded-full">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality & Integrity</h3>
            <p className="text-gray-600">
              We uphold high standards for content quality and promote respectful, honest interactions.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Team/Join Us */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-secondary-50 to-primary-50 rounded-xl p-8 text-center"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Our Community</h2>
        <p className="text-lg text-gray-700 mb-6">
          Whether you're a beginner looking for guidance or an expert willing to share your knowledge,
          there's a place for you in our community.
        </p>
        <div className="flex justify-center">
          <a
            href="/register"
            className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Sign Up Today
          </a>
        </div>
      </motion.section>

      {/* Global Impact */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center p-3 bg-gray-50 rounded-full mb-6">
          <Globe className="h-10 w-10 text-gray-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Global Impact</h2>
        <p className="text-lg text-gray-700">
          Our platform serves millions of developers from around the world, helping them solve problems,
          learn new skills, and build amazing software that powers our digital world.
        </p>
      </motion.section>
    </div>
  );
};

export default AboutPage;