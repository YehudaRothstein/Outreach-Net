import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

interface FormData {
  email: string;
  password: string;
}

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to log in. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-neutral-900">Welcome back</h2>
        <p className="text-neutral-600 mt-2">Sign in to your account to continue</p>
      </div>
      
      {error && (
        <div className="alert alert-error mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="form-input"
            placeholder="Enter your email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Please enter a valid email address'
              }
            })}
          />
          {errors.email && (
            <p className="mt-2 text-sm text-secondary-600">{errors.email.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className="form-input pr-10"
              placeholder="Enter your password"
              {...register('password', { required: 'Password is required' })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-neutral-400" />
              ) : (
                <Eye className="h-4 w-4 text-neutral-400" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-secondary-600">{errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link
              to="#"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-neutral-600">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;