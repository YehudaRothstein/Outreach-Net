import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';

const ActionInput = ({ label, placeholder, action, onAction, loading }: any) => {
    const [inputValue, setInputValue] = useState('');

    return (
        <div className="p-4 border rounded-md shadow-sm">
            <h2 className="text-lg font-semibold">{label}</h2>
            <p className="text-sm text-gray-600">{placeholder}</p>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={placeholder}
                className="w-full mt-2 p-2 border rounded-md"
            />
            <button
                onClick={() => onAction(inputValue)}
                className={`mt-2 px-4 py-2 text-white rounded-md ${
                    action === 'Ban' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                }`}
                disabled={loading}
            >
                {loading ? 'Processing...' : action}
            </button>
        </div>
    );
};

const AdminTools = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'users' | 'threads'>('users');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (user?.role !== 'admin') {
        return <p className="text-center text-red-500">You do not have access to this page.</p>;
    }

    const handleBanUser = async (userId: string) => {
        setLoading(true);
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, { status: 'banned' });
            setError(null);
            alert('User has been banned successfully.');
        } catch (err) {
            console.error('Error banning user:', err);
            setError('Failed to ban user.');
        } finally {
            setLoading(false);
        }
    };

    const handleUnbanUser = async (userId: string) => {
        setLoading(true);
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, { status: 'active' });
            setError(null);
            alert('User has been unbanned successfully.');
        } catch (err) {
            console.error('Error unbanning user:', err);
            setError('Failed to unban user.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-md">
            <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <div className="flex justify-center mb-6">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 font-medium ${
                        activeTab === 'users' ? 'text-white bg-blue-500' : 'text-blue-500 bg-gray-100'
                    } rounded-l-md`}
                >
                    Manage Users
                </button>
                <button
                    onClick={() => setActiveTab('threads')}
                    className={`px-4 py-2 font-medium ${
                        activeTab === 'threads' ? 'text-white bg-blue-500' : 'text-blue-500 bg-gray-100'
                    } rounded-r-md`}
                >
                    Manage Threads
                </button>
            </div>

            {activeTab === 'users' && (
                <div className="space-y-4">
                    <ActionInput
                        label="Ban a User"
                        placeholder="Enter the user ID to ban them."
                        action="Ban"
                        onAction={handleBanUser}
                        loading={loading}
                    />
                    <ActionInput
                        label="Unban a User"
                        placeholder="Enter the user ID to unban them."
                        action="Unban"
                        onAction={handleUnbanUser}
                        loading={loading}
                    />
                </div>
            )}
        </div>
    );
};

export default AdminTools;