import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ThreadCreate from './pages/ThreadCreate';
import ThreadView from './pages/ThreadView';
import NotFound from './pages/NotFound';

// Routes that require authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="p-8 flex justify-center"><p>Loading...</p></div>;
  
  if (!user) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
};

function App() {
  const { checkAuthState } = useAuth();
  
  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="thread/:id" element={<ThreadView />} />
        
        {/* Protected routes */}
        <Route path="create" element={
          <ProtectedRoute>
            <ThreadCreate />
          </ProtectedRoute>
        } />
        <Route path="profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Route>
      
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
      
      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;