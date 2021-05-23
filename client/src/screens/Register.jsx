import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { isAuth } from 'helpers/auth';
import { Redirect } from 'react-router-dom';
import RegisterForm from 'components/FormikForm/RegisterForm';
import request from 'utils/request';

const Register = ({ history }) => {
  const [isLoading, setLoading] = useState(false);
  const [isSent, setSent] = useState(false);

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
      setSent(true);
      setLoading(false);
    }
  };
  return (
    <div>
      {isAuth() ? <Redirect to='/' /> : null}
      {!isSent ? (
        <RegisterForm
          isLoading={isLoading}
          submit={data => handleSubmit(data)}
        />
      ) : (
        <p>Please check your email for account activation.</p>
      )}
      <p>
        Already register,{' '}
        <strong onClick={() => history.push('/login')}>Login Here!</strong>
      </p>
    </div>
  );
};

export default Register;
