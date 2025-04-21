import React from 'react';
import { Link } from 'react-router-dom';
import { Home, LogIn } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-error">403</h1>
          <div className="h-1 w-20 bg-error mx-auto my-6"></div>
          <h2 className="text-2xl font-semibold mb-4">Unauthorized Access</h2>
          <p className="text-base-content/70 mb-8">
            Sorry, you don’t have permission to view this page. Please log in with the appropriate credentials.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link to="/" className="btn bg-sky-600 text-white gap-2">
            <Home size={18} />
            Back to Home
          </Link>

          <Link to="/login" className="btn btn-ghost gap-2">
            <LogIn size={18} />
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
