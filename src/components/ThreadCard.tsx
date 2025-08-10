import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { MessageSquare, Eye, Heart, User, Clock } from 'lucide-react';
import { Thread } from '../services/threadService';

interface ThreadCardProps {
  thread: Thread;
}

const ThreadCard = ({ thread }: ThreadCardProps) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      community_events: 'bg-blue-100 text-blue-800',
      stem_outreach: 'bg-green-100 text-green-800',
      fundraising: 'bg-purple-100 text-purple-800',
      mentorship: 'bg-orange-100 text-orange-800',
      team_management: 'bg-indigo-100 text-indigo-800',
      other: 'bg-neutral-100 text-neutral-800',
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      community_events: 'Community Events',
      stem_outreach: 'STEM Outreach',
      fundraising: 'Fundraising',
      mentorship: 'Mentorship',
      team_management: 'Team Management',
      other: 'Other',
    };
    return labels[category as keyof typeof labels] || category;
  };

  const likeCount = thread.likes?.length || 0;

  return (
    <article className="card group hover:shadow-lg transition-all duration-300">
      <div className="card-body">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            {thread.author.photoURL ? (
              <img
                src={thread.author.photoURL}
                alt={thread.author.displayName}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <User className="h-5 w-5 text-primary-600" />
              </div>
            )}
            <div>
              <p className="font-medium text-neutral-900">{thread.author.displayName}</p>
              <div className="flex items-center space-x-2 text-xs text-neutral-500">
                <Clock className="h-3 w-3" />
                <span>{thread.createdAt && format(thread.createdAt, 'MMM d, yyyy')}</span>
              </div>
            </div>
          </div>
          <span className={`badge ${getCategoryColor(thread.category)}`}>
            {getCategoryLabel(thread.category)}
          </span>
        </div>

        {/* Content */}
        <Link to={`/thread/${thread.id}`} className="block group-hover:text-primary-600 transition-colors">
          <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {thread.title}
          </h3>
          <p className="text-neutral-600 text-sm line-clamp-3 mb-4">
            {thread.content}
          </p>
        </Link>

        {/* Tags */}
        {thread.tags && thread.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {thread.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700"
              >
                #{tag}
              </span>
            ))}
            {thread.tags.length > 3 && (
              <span className="text-xs text-neutral-500">
                +{thread.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
          <div className="flex items-center space-x-4 text-sm text-neutral-500">
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span>{likeCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageSquare className="h-4 w-4" />
              <span>{thread.commentCount || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{thread.viewCount || 0}</span>
            </div>
          </div>
          
          <Link
            to={`/thread/${thread.id}`}
            className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ThreadCard;