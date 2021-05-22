import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ResetPasswordForm from 'components/FormikForm/ResetPasswordForm';
import request from 'utils/request';

const ResetPassword = ({ history, match }) => {
  const [isLoading, setLoading] = useState(false);

  const [data, setData] = useState({
    token: '',
  });

  useEffect(() => {
    let token = match.params.token;
    if (token) {
      setData({
        ...data,
        token,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.params]);

  const handleSubmit = async formData => {
    setLoading(true);
    const res = await request({
      url: `/password/reset`,
      method: 'PUT',
      data: {
        password: formData.password,
        resetPasswordLink: data.token,
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
      <ResetPasswordForm
        isLoading={isLoading}
        submit={data => handleSubmit(data)}
      />
      <p>Or login with email</p>
      <button onClick={() => history.push('/login')}>Sign In</button>
    </div>
  );
};

export default ResetPassword;
