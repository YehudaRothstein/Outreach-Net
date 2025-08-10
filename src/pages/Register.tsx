import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AlertCircle, Eye, EyeOff, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

interface FormData {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const password = watch('password');

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    
    return {
      strength,
      label: labels[strength - 1] || '',
      color: colors[strength - 1] || 'bg-neutral-200'
    };
  };

  const passwordStrength = getPasswordStrength(password || '');

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    
    try {
      await registerUser(data.email, data.password, data.displayName);
      toast.success('Account created successfully! Welcome to OutreachNet!');
      navigate('/');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to create account. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-neutral-900">Join OutreachNet</h2>
        <p className="text-neutral-600 mt-2">Create your account and start connecting with the FRC community</p>
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
          <label htmlFor="displayName" className="form-label">
            Display Name
          </label>
          <input
            id="displayName"
            type="text"
            autoComplete="name"
            className="form-input"
            placeholder="How should we call you?"
            {...register('displayName', { 
              required: 'Display name is required',
              minLength: {
                value: 2,
                message: 'Display name must be at least 2 characters'
              },
              maxLength: {
                value: 50,
                message: 'Display name must be less than 50 characters'
              }
            })}
          />
          {errors.displayName && (
            <p className="mt-2 text-sm text-secondary-600">{errors.displayName.message}</p>
          )}
        </div>

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
              autoComplete="new-password"
              className="form-input pr-10"
              placeholder="Create a strong password"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                }
              })}
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
          
          {password && (
            <div className="mt-2">
              <div className="flex items-center space-x-2 mb-1">
                <div className="flex-1 bg-neutral-200 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full transition-all ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-neutral-600">{passwordStrength.label}</span>
              </div>
            </div>
          )}
          
          {errors.password && (
            <p className="mt-2 text-sm text-secondary-600">{errors.password.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className="form-input pr-10"
              placeholder="Confirm your password"
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: (val: string) => {
                  if (watch('password') !== val) {
                    return "Passwords do not match";
                  }
                }
              })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-neutral-400" />
              ) : (
                <Eye className="h-4 w-4 text-neutral-400" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-2 text-sm text-secondary-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="form-group">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="agreeToTerms"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                {...register('agreeToTerms', {
                  required: 'You must agree to the terms and conditions'
                })}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="agreeToTerms" className="text-neutral-700">
                I agree to the{' '}
                <Link to="#" className="text-primary-600 hover:text-primary-500">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="#" className="text-primary-600 hover:text-primary-500">
                  Privacy Policy
                </Link>
              </label>
            </div>
          </div>
          {errors.agreeToTerms && (
            <p className="mt-2 text-sm text-secondary-600">{errors.agreeToTerms.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-neutral-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;