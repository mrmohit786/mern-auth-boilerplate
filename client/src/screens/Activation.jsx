import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { authenticate, isAuth } from 'helpers/auth';
import { Redirect } from 'react-router-dom';
import request from 'utils/request';
import jwt from 'jsonwebtoken';
import 'react-toastify/dist/ReactToastify.css';

const Activation = ({ match }) => {
  const [formData, setFormData] = useState({
    name: '',
    token: '',
    show: true,
  });

  useEffect(() => {
    let token = match.params.token;
    let { name } = jwt.decode(token);

    if (token) {
      setFormData({
        ...formData,
        name,
        token,
      });
    }

    console.log({ name, token });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.params]);

  const { name, token, show } = formData;

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await request({
      url: `/activation`,
      method: 'POST',
      data: { token },
    }).catch(error => {
      toast.error(error.data.errors);
    });

    if (res) {
      setFormData({ ...formData, show: false });
      toast.success(res.message);
    }
  };

  return (
    <div className='container'>
      <ToastContainer />
      {isAuth() ? <Redirect to='/' /> : null}
      <div>
        <h1>Welcome {name}</h1>
        <form onSubmit={handleSubmit}>
          <button type='submit'>Activate your account</button>
        </form>
      </div>
    </div>
  );
};

export default Activation;
