import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div>
      <div className="flex items-center justify-center min-h-[60vh] text-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">404 - Page Not Found</h1>
          <p className="text-sm text-muted-foreground mb-4">
            The page you are looking for does not exist.
          </p>
          <Link to="/" className="text-blue-500 hover:underline text-sm">
            Go back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
