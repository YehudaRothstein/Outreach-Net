import { Outlet, Link } from 'react-router-dom';
import { Trophy, ArrowLeft } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-neutral-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Back to Home Link */}
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-neutral-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <Link to="/" className="flex justify-center mb-8">
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <Trophy className="h-12 w-12 text-primary-600 transition-transform group-hover:scale-110" />
              <div className="absolute -inset-2 bg-primary-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-neutral-900">OutreachNet</span>
              <span className="text-sm text-neutral-500 -mt-1">FRC Community</span>
            </div>
          </div>
        </Link>

        {/* Subtitle */}
        <div className="text-center mb-8">
          <p className="text-neutral-600 max-w-sm mx-auto">
            Join thousands of FRC teams sharing outreach experiences and building stronger communities together.
          </p>
        </div>
      </div>

      {/* Auth Form Container */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-neutral-200">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-neutral-500">
          By continuing, you agree to our{' '}
          <Link to="#" className="text-primary-600 hover:text-primary-700">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="#" className="text-primary-600 hover:text-primary-700">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;