import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { createThread } from '../services/threadService';
import toast from 'react-hot-toast';

interface FormData {
  title: string;
  content: string;
  category: string;
  tags: string;
}

const ThreadCreate = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    if (!user) {
      setError('You must be logged in to create a thread');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const tags = data.tags.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
      
      const threadId = await createThread(
        data.title,
        data.content,
        user.uid,
        user.displayName || 'Anonymous',
        user.photoURL,
        data.category,
        tags
      );
      
      toast.success('Thread created successfully');
      navigate(`/thread/${threadId}`);
    } catch (err: any) {
      console.error('Thread creation error:', err);
      setError(err.message || 'Failed to create thread. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create a New Thread</h1>
        <p className="text-gray-600 mt-1">
          Share your outreach experiences or ask questions to the community.
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <div className="mt-1">
              <input
                id="title"
                type="text"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter a descriptive title"
                {...register('title', { 
                  required: 'Title is required',
                  minLength: {
                    value: 5,
                    message: 'Title must be at least 5 characters'
                  },
                  maxLength: {
                    value: 150,
                    message: 'Title must be less than 150 characters'
                  }
                })}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <div className="mt-1">
              <select
                id="category"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                {...register('category', { required: 'Please select a category' })}
              >
                <option value="">Select a category</option>
                <option value="community_events">Community Events</option>
                <option value="stem_outreach">STEM Outreach</option>
                <option value="fundraising">Fundraising</option>
                <option value="mentorship">Mentorship</option>
                <option value="team_management">Team Management</option>
                <option value="other">Other</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <div className="mt-1">
              <textarea
                id="content"
                rows={8}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Share your thoughts, experiences, or questions..."
                {...register('content', { 
                  required: 'Content is required',
                  minLength: {
                    value: 20,
                    message: 'Content must be at least 20 characters'
                  }
                })}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              Tags (comma separated)
            </label>
            <div className="mt-1">
              <input
                id="tags"
                type="text"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., workshop, robotics, elementary, fundraiser"
                {...register('tags')}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Add relevant tags to help others find your thread. Separate tags with commas.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-secondary mr-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Creating...' : 'Create Thread'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ThreadCreate;