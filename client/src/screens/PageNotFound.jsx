import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div>
      <h1>Page Not Found: Error 404</h1>
      <p>
        Go to <Link to='/'>Home</Link>
      </p>
    </div>
  );
};

export default PageNotFound;
