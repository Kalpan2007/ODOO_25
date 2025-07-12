import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Plus, X, HelpCircle, BookOpen } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface QuestionForm {
  title: string;
  content: string;
  tags: string[];
}

const AskQuestionPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<QuestionForm>();

  const title = watch('title');

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase();
      if (tag && !tags.includes(tag) && tags.length < 5) {
        setTags([...tags, tag]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const onSubmit = async (data: QuestionForm) => {
    if (!content.trim()) {
      toast.error('Question content is required');
      return;
    }

    if (tags.length === 0) {
      toast.error('At least one tag is required');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post('/questions', {
        title: data.title,
        content,
        tags,
      });

      toast.success('Question posted successfully!');
      navigate(`/questions/${response.data.question._id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to post question');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to ask a question</h2>
        <button
          onClick={() => navigate('/login')}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Log In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
          Ask a Question
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get help from the community by asking a clear, detailed question with relevant tags.
        </p>
      </motion.div>

      {/* Tips Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-6"
      >
        <div className="flex items-start space-x-3">
          <HelpCircle className="text-blue-600 mt-1" size={20} />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Writing a good question</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Be specific and clear in your title</li>
              <li>• Provide context and what you've tried</li>
              <li>• Include relevant code snippets or examples</li>
              <li>• Use appropriate tags to help others find your question</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Question Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg shadow-md p-6 space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question Title *
          </label>
          <input
            {...register('title', {
              required: 'Title is required',
              minLength: {
                value: 10,
                message: 'Title must be at least 10 characters',
              },
              maxLength: {
                value: 200,
                message: 'Title must be less than 200 characters',
              },
            })}
            type="text"
            placeholder="e.g., How do I center a div in CSS?"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
          {title && (
            <p className="mt-1 text-sm text-gray-500">
              {title.length}/200 characters
            </p>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question Details *
          </label>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <ReactQuill
              value={content}
              onChange={setContent}
              placeholder="Provide detailed information about your question. Include what you've tried and any relevant code..."
              className="bg-white"
              style={{ minHeight: '200px' }}
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
          </div>
          {!content.trim() && (
            <p className="mt-1 text-sm text-red-600">Question content is required</p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags * (up to 5)
          </label>
          <div className="space-y-3">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={addTag}
              placeholder="Type a tag and press Enter (e.g., javascript, react, css)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              disabled={tags.length >= 5}
            />
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            {tags.length === 0 && (
              <p className="text-sm text-red-600">At least one tag is required</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/questions')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !content.trim() || tags.length === 0}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Posting...' : 'Post Question'}
          </button>
        </div>
      </motion.form>

      {/* Help Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-50 rounded-lg p-6"
      >
        <div className="flex items-center space-x-2 mb-4">
          <BookOpen className="text-gray-600" size={20} />
          <h3 className="font-semibold text-gray-900">Need help writing your question?</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Before you post:</h4>
            <ul className="space-y-1">
              <li>• Search for similar questions</li>
              <li>• Check the documentation</li>
              <li>• Try debugging on your own</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-800 mb-2">In your question:</h4>
            <ul className="space-y-1">
              <li>• Describe what you expected</li>
              <li>• Show what actually happened</li>
              <li>• Include minimal reproducible code</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AskQuestionPage;