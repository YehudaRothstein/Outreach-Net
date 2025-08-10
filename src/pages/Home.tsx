import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { DocumentSnapshot } from 'firebase/firestore';
import { AlertCircle, Plus, TrendingUp, Users, MessageSquare, Sparkles } from 'lucide-react';
import ThreadCard from '../components/ThreadCard';
import { getThreads, getThreadsByCategory, Thread } from '../services/threadService';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const { user } = useAuth();
  
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

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
        setHasMore(result.threads.length === 10);
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
    if (!lastVisible || !hasMore || loadingMore) return;
    
    setLoadingMore(true);
    
    try {
      let result;
      
      if (category) {
        result = await getThreadsByCategory(category, lastVisible);
      } else {
        result = await getThreads(lastVisible);
      }
      
      setThreads([...threads, ...result.threads]);
      setLastVisible(result.lastVisible);
      setHasMore(result.threads.length === 10);
    } catch (err) {
      console.error('Error loading more threads:', err);
      setError('Failed to load more threads. Please try again later.');
    } finally {
      setLoadingMore(false);
    }
  };

  const getCategoryInfo = () => {
    const categoryMap = {
      community_events: {
        title: 'Community Events',
        description: 'Discover and share community engagement initiatives that bring FIRST values to your local area.',
        icon: Users,
        color: 'text-blue-600'
      },
      stem_outreach: {
        title: 'STEM Outreach',
        description: 'Explore educational programs and workshops that inspire the next generation of innovators.',
        icon: Sparkles,
        color: 'text-green-600'
      },
      fundraising: {
        title: 'Fundraising',
        description: 'Share creative fundraising strategies and learn from successful team campaigns.',
        icon: TrendingUp,
        color: 'text-purple-600'
      },
      mentorship: {
        title: 'Mentorship',
        description: 'Connect with mentors and mentees to build stronger, more supportive FRC communities.',
        icon: MessageSquare,
        color: 'text-orange-600'
      }
    };

    if (!category) {
      return {
        title: 'Latest Discussions',
        description: 'Join the conversation about FRC outreach initiatives, share your experiences, and learn from the community.',
        icon: MessageSquare,
        color: 'text-primary-600'
      };
    }

    return categoryMap[category as keyof typeof categoryMap] || {
      title: category.replace('_', ' '),
      description: 'Browse discussions in this category.',
      icon: MessageSquare,
      color: 'text-primary-600'
    };
  };

  const categoryInfo = getCategoryInfo();
  const IconComponent = categoryInfo.icon;

  return (
    <div className="min-h-screen bg-neutral-50 pt-16">
      {/* Hero Section */}
      <section className="bg-white border-b border-neutral-200">
        <div className="container py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 mb-6`}>
              <IconComponent className={`h-8 w-8 ${categoryInfo.color}`} />
            </div>
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">
              {categoryInfo.title}
            </h1>
            <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
              {categoryInfo.description}
            </p>
            
            {user && (
              <Link to="/create" className="btn btn-primary btn-lg">
                <Plus className="h-5 w-5 mr-2" />
                Start a Discussion
              </Link>
            )}
            
            {!user && (
              <div className="flex items-center justify-center space-x-4">
                <Link to="/register" className="btn btn-primary btn-lg">
                  Join the Community
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section">
        <div className="container">
          {error && (
            <div className="alert alert-error mb-8">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Category Filter Pills */}
          {!category && (
            <div className="mb-8">
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  to="/"
                  className="badge badge-primary px-4 py-2 hover:scale-105 transition-transform"
                >
                  All Discussions
                </Link>
                <Link
                  to="/?category=community_events"
                  className="badge badge-secondary px-4 py-2 hover:scale-105 transition-transform"
                >
                  Community Events
                </Link>
                <Link
                  to="/?category=stem_outreach"
                  className="badge badge-secondary px-4 py-2 hover:scale-105 transition-transform"
                >
                  STEM Outreach
                </Link>
                <Link
                  to="/?category=fundraising"
                  className="badge badge-secondary px-4 py-2 hover:scale-105 transition-transform"
                >
                  Fundraising
                </Link>
                <Link
                  to="/?category=mentorship"
                  className="badge badge-secondary px-4 py-2 hover:scale-105 transition-transform"
                >
                  Mentorship
                </Link>
              </div>
            </div>
          )}

          {/* Threads Grid */}
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="card loading">
                    <div className="card-body">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="h-10 w-10 bg-neutral-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-neutral-200 rounded w-1/4 mb-2"></div>
                          <div className="h-3 bg-neutral-200 rounded w-1/6"></div>
                        </div>
                      </div>
                      <div className="h-6 bg-neutral-200 rounded w-3/4 mb-3"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-neutral-200 rounded"></div>
                        <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : threads.length > 0 ? (
              <>
                <div className="space-y-6">
                  {threads.map((thread) => (
                    <ThreadCard key={thread.id} thread={thread} />
                  ))}
                </div>
                
                {hasMore && (
                  <div className="text-center mt-12">
                    <button
                      onClick={loadMoreThreads}
                      disabled={loadingMore}
                      className="btn btn-secondary btn-lg"
                    >
                      {loadingMore ? 'Loading...' : 'Load More Discussions'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="h-12 w-12 text-neutral-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                    No discussions yet
                  </h3>
                  <p className="text-neutral-600 mb-6">
                    {category 
                      ? `Be the first to start a conversation in the ${categoryInfo.title} category!`
                      : 'Start a new conversation by creating a thread.'}
                  </p>
                  {user ? (
                    <Link to="/create" className="btn btn-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Thread
                    </Link>
                  ) : (
                    <div className="space-x-3">
                      <Link to="/register" className="btn btn-primary">
                        Join Community
                      </Link>
                      <Link to="/login" className="btn btn-secondary">
                        Sign In
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;