import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {format} from 'date-fns';
import {
    User,
    FileText,
    Plus,
    Award,
    Users,
    MessageSquare,
    Eye,
    BarChart as ChartBar,
    Calendar,
    Edit2
} from 'lucide-react';
import {useAuth} from '../hooks/useAuth';
import {getUserThreads, Thread} from '../services/threadService';
import ThreadCard from '../components/ThreadCard';

interface UserStats {
    totalThreads: number;
    totalComments: number;
    totalViews: number;
    joinDate: Date;
    reputation: number;
}

const Profile = () => {
    const {user} = useAuth();
    const [threads, setThreads] = useState<Thread[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'threads' | 'activity' | 'stats'>('threads');
    const [userStats, setUserStats] = useState<UserStats>({
        totalThreads: 0,
        totalComments: 0,
        totalViews: 0,
        joinDate: new Date(),
        reputation: 0
    });

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) return;

            setLoading(true);
            setError(null);

            try {
                const userThreads = await getUserThreads(user.uid);
                setThreads(userThreads);

                // Calculate total views and set stats
                const totalViews = userThreads.reduce((sum, thread) => sum + (thread.viewCount || 0), 0);
                const totalComments = userThreads.reduce((sum, thread) => sum + (thread.commentCount || 0), 0);

                setUserStats({
                    totalThreads: userThreads.length,
                    totalComments: totalComments,
                    totalViews: totalViews,
                    joinDate: new Date(2024, 0, 1), // This should come from user metadata
                    reputation: totalViews + (totalComments * 5) // Simple reputation calculation
                });
            } catch (err: any) {
                console.error('Error fetching user data:', err);
                setError('Failed to load your profile data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user]);

    if (!user) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <User className="h-5 w-5 text-red-400"/>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">
                                You must be logged in to view your profile.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const StatCard = ({icon: Icon, label, value}: { icon: any, label: string, value: string | number }) => (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
                <div className="p-2 bg-blue-50 rounded-lg">
                    <Icon className="h-6 w-6 text-[var(--frc-blue)]"/>
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{label}</p>
                    <p className="text-xl font-semibold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Profile Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>
                <div className="px-6 pb-6">
                    <div
                        className="flex flex-col sm:flex-row items-center sm:items-end -mt-12 sm:-mt-16 space-y-4 sm:space-y-0 sm:space-x-6">
                        <div className="relative">
                            {user.photoURL ? (
                                <img
                                    src={user.photoURL}
                                    alt={user.displayName || 'Profile'}
                                    className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white shadow-md"
                                />
                            ) : (
                                <div
                                    className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-white shadow-md bg-gray-100 flex items-center justify-center">
                                    <User className="h-12 w-12 text-gray-400"/>
                                </div>
                            )}
                            <button
                                className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-sm border border-gray-200 hover:bg-gray-50">
                                <Edit2 className="h-4 w-4 text-gray-600"/>
                            </button>
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <h1 className="text-5xl font-bold text-gray-900">{user.displayName}</h1>
                            <p className="text-gray-600 ">{user.email}</p>
                            <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
                <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <Award className="h-3 w-3 mr-1"/>
                  Level {Math.floor(userStats.reputation / 100) + 1}
                </span>
                                <span
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <Calendar className="h-3 w-3 mr-1"/>
                  Joined {format(userStats.joinDate, 'MMM yyyy')}
                </span>
                                <span
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-200 text-yellow-700">
                  <User className="h-3 w-3 mr-1"/>
                                    {user.role === 'admin' ? 'Admin' : 'Team Member'}
                                </span>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <Link to="/settings" className="btn btn-secondary">
                                Edit Profile
                            </Link>
                            <Link to="/create" className="btn btn-primary">
                                <Plus className="h-4 w-4 mr-1"/>
                                New Thread
                            </Link>
                        </div>
                    </div>
                </div>
            </div>


            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <StatCard icon={FileText} label="Total Threads" value={userStats.totalThreads}/>
                <StatCard icon={MessageSquare} label="Total Comments" value={userStats.totalComments}/>
                <StatCard icon={Eye} label="Total Views" value={userStats.totalViews}/>
                <StatCard icon={ChartBar} label="Reputation" value={userStats.reputation}/>
            </div>

            {/* Content Tabs */}
            <div className="mt-8">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        {['threads', 'activity', 'stats'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab
                                    ? 'border-[var(--frc-blue)] text-[var(--frc-blue)]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }
                `}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="mt-6">
                    {activeTab === 'threads' && (
                        <div className="space-y-4">
                            {loading ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Loading threads...</p>
                                </div>
                            ) : threads.length > 0 ? (
                                threads.map((thread) => (
                                    <ThreadCard key={thread.id} thread={thread}/>
                                ))
                            ) : (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4"/>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No threads yet</h3>
                                    <p className="text-gray-500 mb-4">Share your outreach experiences or start a
                                        discussion!</p>
                                    <Link to="/create" className="btn btn-primary">
                                        Create Your First Thread
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'activity' && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="space-y-8">
                                {/* Recent Activity Timeline */}
                                <div className="flow-root">
                                    <ul className="-mb-8">
                                        {threads.slice(0, 5).map((thread, idx) => (
                                            <li key={thread.id}>
                                                <div className="relative pb-8">
                                                    {idx !== threads.length - 1 && (
                                                        <span
                                                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                                            aria-hidden="true"/>
                                                    )}
                                                    <div className="relative flex space-x-3">
                                                        <div>
                              <span
                                  className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center ring-8 ring-white">
                                <FileText className="h-4 w-4 text-[var(--frc-blue)]"/>
                              </span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div>
                                                                <div className="text-sm">
                                                                    Created thread{' '}
                                                                    <Link to={`/thread/${thread.id}`}
                                                                          className="font-medium text-gray-900 hover:text-[var(--frc-blue)]">
                                                                        {thread.title}
                                                                    </Link>
                                                                </div>
                                                                <p className="mt-0.5 text-sm text-gray-500">
                                                                    {thread.createdAt && format(thread.createdAt, 'MMM d, yyyy')}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'stats' && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Engagement Stats */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Engagement Statistics</h3>
                                    <dl className="space-y-4">
                                        <div className="flex justify-between">
                                            <dt className="text-sm text-gray-500">Average Comments per Thread</dt>
                                            <dd className="text-sm font-medium text-gray-900">
                                                {threads.length ? (userStats.totalComments / threads.length).toFixed(1) : '0'}
                                            </dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-sm text-gray-500">Average Views per Thread</dt>
                                            <dd className="text-sm font-medium text-gray-900">
                                                {threads.length ? (userStats.totalViews / threads.length).toFixed(1) : '0'}
                                            </dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-sm text-gray-500">Most Active Category</dt>
                                            <dd className="text-sm font-medium text-gray-900">
                                                {threads.length ? 'Community Events' : 'N/A'}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                {/* Achievement Progress */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Achievements Progress</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-500">Thread Master</span>
                                                <span
                                                    className="text-gray-900 font-medium">{userStats.totalThreads}/10</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-[var(--frc-blue)] h-2 rounded-full"
                                                    style={{width: `${Math.min((userStats.totalThreads / 10) * 100, 100)}%`}}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-500">Popular Creator</span>
                                                <span
                                                    className="text-gray-900 font-medium">{userStats.totalViews}/1000</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-[var(--frc-blue)] h-2 rounded-full"
                                                    style={{width: `${Math.min((userStats.totalViews / 1000) * 100, 100)}%`}}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;