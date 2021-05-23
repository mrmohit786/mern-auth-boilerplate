import { isAuth } from 'helpers/auth';
import React from 'react';

const Home = ({ history }) => {
  return (
    <div>
      
      {isAuth() ? (
        <div>
          <h1>Profile</h1>
          <p>UserName</p>
          <p>UserImage</p>
        </div>
      ):  <div>
      <h1>Welcome to M.E.R.N.</h1>
      <p>Its a mongoDB, Express, React and Node boilerplate application.</p>
      <h4>Features:</h4>
      <ul>
        <li>Jwt token based Registration and login.</li>
        <li>Email authentication using Gmail service via nodemailer.</li>
        <li>Google based sign up.</li>
        <li>Facebook based sign up.</li>
        <li>Mail checker for verify fake emails.</li>
      </ul>
      <button onClick={() => history.push('/register')}>Register</button>
      <button onClick={() => history.push('/login')}>Login</button>
    </div>}
    </div>
  );
};

export default Home;
