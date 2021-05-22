import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { isAuth } from 'helpers/auth';
import { Redirect } from 'react-router-dom';
import request from 'utils/request';
import jwt from 'jsonwebtoken';

const Activation = ({ match, history }) => {
  const [formData, setFormData] = useState({
    name: '',
    token: '',
    show: true,
  });

  useEffect(() => {
    let token = match.params.token;
    let tokenData = jwt.decode(token);

    if (token && tokenData && tokenData.name) {
      setFormData({
        ...formData,
        name: tokenData.name,
        token,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.params]);

  const { name, token } = formData;

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await request({
      url: `/activation`,
      method: 'POST',
      data: { token },
    }).catch(err => {
      toast.error(err?.data?.error || err);
    });

    if (res) {
      setFormData({ ...formData, show: false });
      toast.success(res.message);
    }
  };

  return (
    <div>
      {isAuth() ? <Redirect to='/' /> : null}
      <div>
        <h1>Welcome {name} to React-app</h1>
        <form onSubmit={handleSubmit}>
          <button type='submit'>Activate your account</button>
        </form>
        <p>Or sign up again</p>
        <button onClick={() => history.push('/')}>Sign Up</button>
      </div>
    </div>
  );
};

export default Activation;
