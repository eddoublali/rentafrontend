import React from 'react';
import { Link } from 'react-router-dom';
import { Home,  RefreshCw } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <div className="h-1 w-20 bg-primary mx-auto my-6"></div>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-base-content/70 mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been removed, 
            renamed, or didn't exist in the first place.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link to="/" className="btn bg-sky-600 text-white gap-2">
            <Home size={18} />
            Back to Home
          </Link>
        
          <button onClick={() => window.history.back()} className="btn btn-ghost gap-2">
            <RefreshCw size={18} />
            Go Back
          </button>
        </div>

      </div>
    </div>
  );
}