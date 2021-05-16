import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { authenticate, isAuth } from 'helpers/auth';
import { Redirect } from 'react-router-dom';
import RegisterForm from 'components/RegisterForm';
import request from 'utils/request';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const handleSubmit = async formData => {
    console.log(formData);

    const res = await request({
      url: `/register`,
      method: 'POST',
      data: {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      },
    }).catch(error => {
      toast.error(error.response.data.error);
    });

    if (res) {
      toast.success(res.message);
    }
  };
  return (
    <div className='container'>
      <ToastContainer />
      {isAuth() ? <Redirect to='/' /> : null}
      <RegisterForm submit={data => handleSubmit(data)} />
      <p>Or sign with email or social login</p>
      <button className='signin-btn' onClick={() => toast.error('test')}>
        Sign In
      </button>
    </div>
  );
};

export default Register;
