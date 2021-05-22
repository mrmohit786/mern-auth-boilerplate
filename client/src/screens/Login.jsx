import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { authenticate, isAuth } from 'helpers/auth';
import LoginForm from 'components/FormikForm/LoginForm';
import { Redirect } from 'react-router-dom';
import request from 'utils/request';

const Login = ({ history }) => {
  const [isLoading, setLoading] = useState(false);
  const handleSubmit = async formData => {
    setLoading(true);
    const res = await request({
      url: `/login`,
      method: 'POST',
      data: {
        email: formData.email,
        password: formData.password,
      },
    }).catch(err => {
      toast.error(err?.data?.error || err);
      setLoading(false);
    });

    if (res) {
      toast.success(`Welcome back, ${res.data.user.name}`);
      setLoading(false);
      authenticate(res, () => {
        isAuth() && isAuth().role === 'admin'
          ? history.push('/admin')
          : history.push('/private');
      });
    }
  };
  return (
    <div>
      {isAuth() ? <Redirect to='/' /> : null}
      <LoginForm isLoading={isLoading} submit={data => handleSubmit(data)} />
      <button onClick={() => history.push('/users/password/forget')}>
        Forgotten password?
      </button>
      <p>New here!, please register first.</p>
      <button onClick={() => history.push('/register')}>Register</button>
    </div>
  );
};

export default Login;
