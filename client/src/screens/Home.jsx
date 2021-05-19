import React from 'react';

const Home = ({ history }) => {
  return (
    <div>
      <h1>Home</h1>
      <div>
        <h3>Register</h3>
        <button onClick={() => history.push('/register')}>Register</button>
      </div>
      <div>
        <h3>Login</h3>
        <button onClick={() => history.push('/login')}>Login</button>
      </div>
    </div>
  );
};

export default Home;
