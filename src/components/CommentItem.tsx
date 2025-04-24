import { useState } from 'react';
import { format } from 'date-fns';
import { User, Heart, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Comment, toggleCommentLike, deleteComment } from '../services/threadService';
import toast from 'react-hot-toast';

interface CommentItemProps {
  comment: Comment;
  onCommentDeleted?: () => void;
}

const CommentItem = ({ comment, onCommentDeleted }: CommentItemProps) => {
  const { user } = useAuth();
  const [currentComment, setCurrentComment] = useState(comment);
  const [liking, setLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if current user has liked the comment
  const hasUserLiked = user && currentComment.likes?.includes(user.uid);
  const likeCount = currentComment.likes?.length || 0;

  // Check if user is an admin
  const isAdmin = user?.role === 'admin';
  // Check if comment is deleted
  const isDeleted = currentComment.isDeleted;

  const handleLikeToggle = async () => {
    if (!user || liking || isDeleted) return;

    setLiking(true);

    try {
      const updatedComment = await toggleCommentLike(comment.id, user.uid);
      setCurrentComment(updatedComment);

      if (hasUserLiked) {
        toast.success('Removed like');
      } else {
        toast.success('Added like');
      }
    } catch (err: any) {
      console.error('Error toggling comment like:', err);
      toast.error('Failed to update like status');
    } finally {
      setLiking(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!isAdmin || isDeleting) return;

    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    setIsDeleting(true);
    try {
      await deleteComment(comment.id);
      toast.success('Comment deleted successfully');
      if (onCommentDeleted) {
        onCommentDeleted();
      } else {
        setCurrentComment({
          ...currentComment,
          isDeleted: true,
          content: "[This comment has been removed by an administrator]"
        });
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
      toast.error('Failed to delete comment');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBanUser = async () => {
    if (!isAdmin) return;

    if (!window.confirm(`Are you sure you want to ban user ${comment.author.displayName}?`)) return;

    try {
      await banUser(comment.userId);
      toast.success(`User ${comment.author.displayName} has been banned`);
    } catch (err) {
      console.error('Error banning user:', err);
      toast.error('Failed to ban user');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex">
        <div className="flex-shrink-0 mr-3">
          {comment.author.photoURL ? (
            <img
              className="h-9 w-9 rounded-full"
              src={comment.author.photoURL}
              alt={`${comment.author.displayName}'s profile`}
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-5 w-5 text-gray-500" />
            </div>
          )}
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium text-gray-900">
                {comment.author.displayName}
                {comment.author.isBanned && (
                  <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Banned</span>
                )}
              </p>
              <p className="text-xs text-gray-500">
                {comment.createdAt && format(comment.createdAt, 'MMM d, yyyy h:mm a')}
              </p>
            </div>

            {isAdmin && !isDeleted && (
              <div className="flex space-x-2">
                <button
                  onClick={handleDeleteComment}
                  disabled={isDeleting}
                  className="text-red-500 hover:text-red-700"
                  title="Delete comment"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={handleBanUser}
                  className="text-orange-500 hover:text-orange-700"
                  title="Ban user"
                >
                  <AlertTriangle className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          <div className={`mt-2 ${isDeleted ? 'text-gray-500 italic' : 'text-gray-800'}`}>
            {currentComment.content.split('\n').map((paragraph, i) => (
              paragraph ? <p key={i}>{paragraph}</p> : <br key={i} />
            ))}
          </div>
          {!isDeleted && (
            <div className="mt-2 flex items-center">
              <button
                onClick={handleLikeToggle}
                disabled={!user || liking}
                className={`flex items-center transition-colors text-sm ${!user ? 'cursor-not-allowed opacity-60' : 'hover:text-[var(--frc-blue)]'} ${hasUserLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-500'}`}
                title={user ? (hasUserLiked ? "Unlike" : "Like") : "Sign in to like"}
              >
                <Heart className={`h-4 w-4 mr-1 ${hasUserLiked ? 'fill-current' : ''}`} />
                <span>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;