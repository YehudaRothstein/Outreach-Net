import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { AlertCircle, User, MessageSquare, Eye, Tag, ArrowLeft, Flag, Trash2, Heart } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import {
  getThreadById,
  getCommentsByThreadId,
  addComment,
  toggleThreadLike,
  Thread,
  Comment
} from '../services/threadService';
import CommentItem from '../components/CommentItem';
import toast from 'react-hot-toast';

interface FormData {
  content: string;
}

const ThreadView = () => {
  const { id } = useParams<{ id: string }>();
  const [thread, setThread] = useState<Thread | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commenting, setCommenting] = useState(false);
  const [liking, setLiking] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const { user } = useAuth();

  // Check if current user has liked the thread
  const hasUserLiked = user && thread?.likes?.includes(user.uid);

  useEffect(() => {
    const fetchThreadAndComments = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const threadData = await getThreadById(id);
        setThread(threadData);

        const commentsData = await getCommentsByThreadId(id);
        setComments(commentsData);
      } catch (err: any) {
        console.error('Error fetching thread:', err);
        setError(err.message || 'Failed to load the thread. It may have been removed or does not exist.');
      } finally {
        setLoading(false);
      }
    };

    fetchThreadAndComments();
  }, [id]);

  const onSubmitComment = async (data: FormData) => {
    if (!id || !user) return;

    setCommenting(true);

    try {
      await addComment(
        id,
        data.content,
        user.id,
        user.displayName || 'Anonymous',
        user.photoURL
      );

      // Fetch updated comments
      const updatedComments = await getCommentsByThreadId(id);
      setComments(updatedComments);

      // Update thread with new comment count
      if (thread) {
        setThread({
          ...thread,
          commentCount: (thread.commentCount || 0) + 1
        });
      }

      // Reset form
      reset();
      toast.success('Comment added successfully');
    } catch (err: any) {
      console.error('Error adding comment:', err);
      toast.error('Failed to add comment. Please try again.');
    } finally {
      setCommenting(false);
    }
  };

  const handleLikeToggle = async () => {
    if (!id || !user || !thread || liking) return;

    setLiking(true);

    try {
      const updatedThread = await toggleThreadLike(id, user.uid);
      setThread(updatedThread);

      if (hasUserLiked) {
        toast.success('Removed like');
      } else {
        toast.success('Added like');
      }
    } catch (err: any) {
      console.error('Error toggling like:', err);
      toast.error('Failed to update like status');
    } finally {
      setLiking(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
          <div className="mt-6 h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !thread) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
            <p className="text-red-700 font-medium">
              {error || 'Thread not found. It may have been removed or does not exist.'}
            </p>
          </div>
          <div className="mt-6">
            <Link to="/" className="inline-flex items-center btn btn-secondary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isAuthor = user && thread.userId === user.uid;
  const likeCount = thread.likes?.length || 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4">
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-[var(--frc-blue)]">
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to threads
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="mb-4">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-gray-900">{thread.title}</h1>
            <div className="flex space-x-2">
              {user && !isAuthor && (
                <button className="text-gray-400 hover:text-gray-600" title="Report thread">
                  <Flag className="h-5 w-5" />
                </button>
              )}
              {isAuthor && (
                <button className="text-gray-400 hover:text-red-500" title="Delete thread">
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
          <div className="mt-2 flex flex-wrap items-center text-sm text-gray-500">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2 mb-1">
              {thread.category.replace('_', ' ')}
            </span>
            <span className="mr-2 mb-1">
              Posted by <span className="font-medium">{thread.author.displayName}</span>
            </span>
            <span className="mb-1">
              {thread.createdAt && format(thread.createdAt, 'MMM d, yyyy h:mm a')}
            </span>
          </div>
        </div>

        <div className="prose max-w-none text-gray-800 mb-6">
          {thread.content.split('\n').map((paragraph, i) => (
            paragraph ? <p key={i}>{paragraph}</p> : <br key={i} />
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between text-sm text-gray-500 border-t border-gray-200 pt-4">
          <div className="flex items-center space-x-4 mb-2 sm:mb-0">
            <button
              onClick={handleLikeToggle}
              disabled={!user || liking}
              className={`flex items-center transition-colors ${!user ? 'cursor-not-allowed opacity-60' : 'hover:text-[var(--frc-blue)]'} ${hasUserLiked ? 'text-red-500 hover:text-red-600' : ''}`}
              title={user ? (hasUserLiked ? "Unlike" : "Like") : "Sign in to like"}
            >
              <Heart className={`h-5 w-5 mr-1 ${hasUserLiked ? 'fill-current' : ''}`} />
              <span>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
            </button>

            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>{thread.commentCount || 0} comments</span>
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              <span>{thread.viewCount || 0} views</span>
            </div>
          </div>
          {thread.tags && thread.tags.length > 0 && (
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-1" />
              <div className="flex flex-wrap">
                {thread.tags.map((tag, index) => (
                  <span key={index} className="mr-1 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Comments ({comments.length})</h2>

        {user ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <form onSubmit={handleSubmit(onSubmitComment)}>
              <div className="flex">
                <div className="flex-shrink-0 mr-3">
                  {user.photoURL ? (
                    <img
                      className="h-10 w-10 rounded-full"
                      src={user.photoURL}
                      alt={`${user.displayName}'s profile`}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <textarea
                    placeholder="Add a comment..."
                    rows={3}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    {...register('content', {
                      required: 'Comment cannot be empty',
                      minLength: {
                        value: 5,
                        message: 'Comment must be at least 5 characters'
                      }
                    })}
                  />
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                  )}
                  <div className="mt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={commenting}
                      className="btn btn-primary"
                    >
                      {commenting ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-center">
            <p className="text-gray-700 mb-2">You need to be signed in to comment</p>
            <div className="flex justify-center space-x-4">
              <Link to="/login" className="btn btn-secondary">
                Sign in
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign up
              </Link>
            </div>
          </div>
        )}

        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <p className="text-gray-500">No comments yet. Be the first to start the conversation!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreadView;