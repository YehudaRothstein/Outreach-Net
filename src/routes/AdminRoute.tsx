// src/routes/AdminRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminRoute = ({ children }: { children: JSX.Element }) => {
    const { user } = useAuth();

    if (user?.role !== 'admin') {
        console.log("Unauthorized access attempt to admin route");
        return <Navigate to="/" />;
    }

    return children;
};

export default AdminRoute;