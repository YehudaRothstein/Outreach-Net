import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { MessageSquare, Eye } from 'lucide-react';
import { Thread } from '../services/threadService';

interface ThreadCardProps {
  thread: Thread;
}

const ThreadCard = ({ thread }: ThreadCardProps) => {
  return (
    <Link to={`/thread/${thread.id}`} className="block mb-4">
      <div className="card p-4 hover:border-[var(--frc-blue)]">
        <div className="flex items-start">
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-[var(--frc-blue)]">
              {thread.title}
            </h3>
            <p className="text-sm text-gray-700 line-clamp-2 mt-1">
              {thread.content.substring(0, 150)}
              {thread.content.length > 150 ? '...' : ''}
            </p>
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                {thread.category.replace('_', ' ')}
              </span>
              <span className="mx-2">•</span>
              <span>
                Posted by {thread.author.displayName}
              </span>
              <span className="mx-2">•</span>
              <span>
                {thread.createdAt && format(thread.createdAt, 'MMM d, yyyy')}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center text-sm text-gray-500">
          <div className="flex items-center mr-4">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{thread.commentCount || 0} comments</span>
          </div>
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            <span>{thread.viewCount || 0} views</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ThreadCard;