import { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';


const Navbar = () => {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-[var(--frc-blue)]">
          OutreachNet
        </Link>
        <nav className="flex space-x-4">
          <Link to="/" className="text-gray-700 hover:text-gray-900">
            Home
          </Link>
          <Link to="/profile" className="text-gray-700 hover:text-gray-900">
            Profile
          </Link>
          <Link to="/manage-users" className="text-gray-700 hover:text-gray-900">
            Manage Users
          </Link>
        </nav>
      </div>
    </header>
  );
};

const ManageUsers = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingUser, setEditingUser] = useState<any | null>(null);
    const [editForm, setEditForm] = useState({ displayName: '', email: '' });

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, 'users'));
                const usersData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsers(usersData);
            } catch (err) {
                console.error('Error fetching users:', err);
                setError('Failed to fetch users.');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleEditClick = (user: any) => {
        setEditingUser(user);
        setEditForm({ displayName: user.displayName || '', email: user.email || '' });
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSave = async () => {
        if (!editingUser) return;
        setLoading(true);
        try {
            const userRef = doc(db, 'users', editingUser.id);
            await updateDoc(userRef, { ...editForm });
            setUsers((prev) =>
                prev.map((u) => (u.id === editingUser.id ? { ...u, ...editForm } : u))
            );
            setEditingUser(null);
        } catch (err) {
            console.error('Error saving user edits:', err);
            setError('Failed to save user edits.');
        } finally {
            setLoading(false);
        }
    };

    const handleBanUnban = async (userId: string, newStatus: string) => {
        setLoading(true);
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, { status: newStatus });
            setUsers((prev) =>
                prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
            );
        } catch (err) {
            console.error('Error updating user status:', err);
            setError('Failed to update user status.');
        } finally {
            setLoading(false);
        }
    };

    const handleChangeRole = async (userId: string, newRole: string) => {
        setLoading(true);
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, { role: newRole });
            setUsers((prev) =>
                prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
            );
        } catch (err) {
            console.error('Error updating user role:', err);
            setError('Failed to update user role.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <Navbar />
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Manage Users</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {loading && <p>Loading...</p>}
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2">Name</th>
                            <th className="border border-gray-300 px-4 py-2">Email</th>
                            <th className="border border-gray-300 px-4 py-2">Role</th>
                            <th className="border border-gray-300 px-4 py-2">Status</th>
                            <th className="border border-gray-300 px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td className="border border-gray-300 px-4 py-2">{u.displayName || 'N/A'}</td>
                                <td className="border border-gray-300 px-4 py-2">{u.email}</td>
                                <td className="border border-gray-300 px-4 py-2">{u.role}</td>
                                <td className="border border-gray-300 px-4 py-2">{u.status}</td>
                                <td className="border border-gray-300 px-4 py-2 space-x-2">
                                    <button
                                        onClick={() =>
                                            handleBanUnban(u.id, u.status === 'banned' ? 'active' : 'banned')
                                        }
                                        className={`px-2 py-1 text-white rounded ${
                                            u.status === 'banned' ? 'bg-green-500' : 'bg-red-500'
                                        }`}
                                    >
                                        {u.status === 'banned' ? 'Unban' : 'Ban'}
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleChangeRole(u.id, u.role === 'admin' ? 'user' : 'admin')
                                        }
                                        className="px-2 py-1 bg-blue-500 text-white rounded"
                                    >
                                        {u.role === 'admin' ? 'Demote' : 'Promote'}
                                    </button>
                                    <button
                                        onClick={() => handleEditClick(u)}
                                        className="px-2 py-1 bg-gray-500 text-white rounded"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {editingUser && (
                    <div className="mt-4 p-4 border border-gray-300 rounded">
                        <h3 className="text-lg font-bold mb-2">Edit User</h3>
                        <div className="mb-2">
                            <label className="block text-sm font-medium">Name</label>
                            <input
                                type="text"
                                name="displayName"
                                value={editForm.displayName}
                                onChange={handleEditChange}
                                className="w-full border border-gray-300 rounded px-2 py-1"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-sm font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={editForm.email}
                                onChange={handleEditChange}
                                className="w-full border border-gray-300 rounded px-2 py-1"
                            />
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={handleEditSave}
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setEditingUser(null)}
                                className="px-4 py-2 bg-gray-500 text-white rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
            </>
    );
};

export default ManageUsers;