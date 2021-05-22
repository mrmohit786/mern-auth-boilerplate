import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { isAuth } from 'helpers/auth';
import { Redirect } from 'react-router-dom';
import RegisterForm from 'components/FormikForm/RegisterForm';
import request from 'utils/request';

const Register = ({ history }) => {
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async formData => {
    setLoading(true);
    const res = await request({
      url: `/register`,
      method: 'POST',
      data: {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      },
    }).catch(err => {
      toast.error(err?.data?.error || err);
      setLoading(false);
    });

    if (res) {
      toast.success(res.message);
      setLoading(false);
    }
  };
  return (
    <div>
      {isAuth() ? <Redirect to='/' /> : null}
      <RegisterForm isLoading={isLoading} submit={data => handleSubmit(data)} />
      <p>Or login with email</p>
      <button onClick={() => history.push('/login')}>Login</button>
    </div>
  );
};

export default Register;
