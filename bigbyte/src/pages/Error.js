import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ErrorPage = () => {
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setRedirect(true);
    }, 5000); // Timeout after 5 seconds

    return () => clearTimeout(timeout); // Clean up the timeout on unmount

  }, []);

  useEffect(() => {
    if (redirect) {
      <Navigate to="/Home" />
    }
  }, [redirect]);

  return (
    <div>
      <h1>Something went wrong!</h1>
      <p>Redirecting back to the home page...</p>
    </div>
  );
};

export default ErrorPage;