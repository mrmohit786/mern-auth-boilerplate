import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { authenticate, isAuth } from 'helpers/auth';
import LoginForm from 'components/LoginForm';
import { Redirect } from 'react-router-dom';
import request from 'utils/request';
import 'react-toastify/dist/ReactToastify.css';

const Login = ({ history }) => {
  const handleSubmit = async formData => {
    console.log(formData);

    const res = await request({
      url: `/login`,
      method: 'POST',
      data: {
        email: formData.email,
        password: formData.password,
      },
    }).catch(err => {
      toast.error(err.data.error);
    });

    if (res) {
      toast.success(`Welcome back, ${res.data.user.name}`);
      authenticate(res, () => {
        isAuth() && isAuth().role === 'admin'
          ? history.push('/admin')
          : history.push('/private');
      });
    }
  };
  return (
    <div>
      <ToastContainer />
      {isAuth() ? <Redirect to='/' /> : null}
      <LoginForm submit={data => handleSubmit(data)} />
      <button onClick={() => history.push('/users/password/forget')}>
      Forgotten password?
      </button>
      <p>New here!, please register first.</p>
      <button onClick={() => history.push('/register')}>Register</button>
    </div>
  );
};

export default Login;
