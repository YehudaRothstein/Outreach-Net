import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="max-w-md mx-auto text-center py-12">
      <AlertTriangle className="h-16 w-16 text-[var(--frc-red)] mx-auto mb-4" />
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
      <p className="text-gray-600 mb-8">
        We couldn't find the page you're looking for. It might have been removed, renamed, or doesn't exist.
      </p>
      <Link 
        to="/"
        className="inline-flex items-center btn btn-primary"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;