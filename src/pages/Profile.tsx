import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, AlertCircle, FileText, Plus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getUserThreads, Thread } from '../services/threadService';
import ThreadCard from '../components/ThreadCard';

const Profile = () => {
  const { user } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserThreads = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const userThreads = await getUserThreads(user.uid);
        setThreads(userThreads);
      } catch (err: any) {
        console.error('Error fetching user threads:', err);
        setError('Failed to load your threads. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserThreads();
  }, [user]);

  if (!user) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
          <p className="text-sm text-red-700">You must be logged in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex sm:items-center">
            <div className="mb-4 sm:mb-0 sm:mr-4">
              {user.photoURL ? (
                <img
                  className="h-24 w-24 rounded-full"
                  src={user.photoURL}
                  alt={`${user.displayName}'s profile`}
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-12 w-12 text-gray-500" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.displayName}</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0">
            <button className="btn btn-secondary">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">My Threads</h2>
          <Link to="/create" className="btn btn-primary">
            <Plus className="h-4 w-4 mr-1" />
            New Thread
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="mt-4">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading your threads...</p>
            </div>
          ) : threads.length > 0 ? (
            threads.map((thread) => (
              <ThreadCard key={thread.id} thread={thread} />
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-700 font-medium mb-2">You haven't created any threads yet</p>
              <p className="text-gray-500 mb-4">Start sharing your outreach experiences or ask questions to the community</p>
              <Link to="/create" className="btn btn-primary">
                Create Your First Thread
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;