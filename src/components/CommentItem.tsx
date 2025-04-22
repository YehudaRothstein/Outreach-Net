import { format } from 'date-fns';
import { User } from 'lucide-react';
import { Comment } from '../services/threadService';

interface CommentItemProps {
  comment: Comment;
}

const CommentItem = ({ comment }: CommentItemProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0 mr-3">
          {comment.author.photoURL ? (
            <img
              className="h-10 w-10 rounded-full"
              src={comment.author.photoURL}
              alt={`${comment.author.displayName}'s profile`}
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-6 w-6 text-gray-500" />
            </div>
          )}
        </div>
        <div className="flex-grow">
          <div className="flex items-center">
            <h4 className="text-sm font-medium text-gray-900">{comment.author.displayName}</h4>
            <span className="ml-2 text-xs text-gray-500">
              {comment.createdAt && format(comment.createdAt, 'MMM d, yyyy h:mm a')}
            </span>
          </div>
          <div className="mt-1 text-sm text-gray-700">
            {comment.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;