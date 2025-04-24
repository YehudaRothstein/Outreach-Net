// src/pages/AdminDashboard.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getBannedUsers, unbanUser } from '../services/threadService';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bannedUsers, setBannedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not admin
    if (user && user.role !== 'admin') {
      toast.error('You do not have permission to access this page');
      navigate('/');
      return;
    }

    const fetchBannedUsers = async () => {
      try {
        const users = await getBannedUsers();
        setBannedUsers(users);
      } catch (error) {
        console.error('Error fetching banned users:', error);
        toast.error('Failed to load banned users');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'admin') {
      fetchBannedUsers();
    }
  }, [user, navigate]);

  const handleUnban = async (userId) => {
    try {
      await unbanUser(userId);
      toast.success('User unbanned successfully');
      // Refresh the list
      setBannedUsers(bannedUsers.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error unbanning user:', error);
      toast.error('Failed to unban user');
    }
  };

  if (!user || loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Banned Users</h2>
        {bannedUsers.length === 0 ? (
          <p>No banned users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">User</th>
                  <th className="py-2 px-4 border-b text-left">Email</th>
                  <th className="py-2 px-4 border-b text-left">Ban Date</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bannedUsers.map(user => (
                  <tr key={user.id}>
                    <td className="py-2 px-4 border-b">
                      <div className="flex items-center">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full mr-2" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 mr-2" />
                        )}
                        {user.displayName}
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b">{user.email}</td>
                    <td className="py-2 px-4 border-b">
                      {user.banDate ? new Date(user.banDate).toLocaleString() : 'N/A'}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => handleUnban(user.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
                      >
                        Unban
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;