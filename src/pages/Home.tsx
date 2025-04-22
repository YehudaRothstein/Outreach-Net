import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DocumentSnapshot } from 'firebase/firestore';
import { AlertCircle } from 'lucide-react';
import ThreadCard from '../components/ThreadCard';
import { getThreads, getThreadsByCategory, Thread } from '../services/threadService';

const Home = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchThreads = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let result;
        
        if (category) {
          result = await getThreadsByCategory(category);
        } else {
          result = await getThreads();
        }
        
        setThreads(result.threads);
        setLastVisible(result.lastVisible);
        setHasMore(result.threads.length === 10); // Assuming we fetch 10 items per page
      } catch (err: any) {
        console.error('Error fetching threads:', err);
        setError('Failed to load threads. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchThreads();
  }, [category]);

  const loadMoreThreads = async () => {
    if (!lastVisible || !hasMore) return;
    
    setLoading(true);
    
    try {
      let result;
      
      if (category) {
        result = await getThreadsByCategory(category, lastVisible);
      } else {
        result = await getThreads(lastVisible);
      }
      
      setThreads([...threads, ...result.threads]);
      setLastVisible(result.lastVisible);
      setHasMore(result.threads.length === 10); // Assuming we fetch 10 items per page
    } catch (err) {
      console.error('Error loading more threads:', err);
      setError('Failed to load more threads. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryTitle = () => {
    if (!category) return 'Recent Discussions';
    
    switch (category) {
      case 'community_events':
        return 'Community Events';
      case 'stem_outreach':
        return 'STEM Outreach';
      case 'fundraising':
        return 'Fundraising';
      case 'mentorship':
        return 'Mentorship';
      default:
        return category.replace('_', ' ');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{getCategoryTitle()}</h1>
        <p className="text-gray-600 mt-1">
          {category 
            ? `Browse and discuss ${getCategoryTitle().toLowerCase()} outreach initiatives.`
            : 'Join the conversation about FRC outreach initiatives, share your experiences, and learn from the community.'}
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

      <div className="mt-4">
        {threads.length > 0 ? (
          <>
            {threads.map((thread) => (
              <ThreadCard key={thread.id} thread={thread} />
            ))}
            
            {hasMore && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={loadMoreThreads}
                  disabled={loading}
                  className="btn btn-secondary"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            {loading ? (
              <p className="text-gray-500">Loading threads...</p>
            ) : (
              <>
                <p className="text-gray-700 text-lg font-medium">No threads found</p>
                <p className="text-gray-500 mt-1">
                  {category 
                    ? `Be the first to start a conversation in the ${getCategoryTitle()} category!`
                    : 'Start a new conversation by creating a thread.'}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;