import React, { useState } from 'react';
import { toast } from 'react-toastify';
import ForgottenPasswordForm from 'components/FormikForm/ForgottenPasswordForm';
import request from 'utils/request';

const ForgottenPassword = ({ history }) => {
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async formData => {
    console.log(formData);
    setLoading(true);
    const res = await request({
      url: `/password/forget`,
      method: 'PUT',
      data: {
        email: formData.email,
      },
    }).catch(err => {
      toast.error(err.data.errors);
      setLoading(false);
    });

    if (res) {
      toast.success(res.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <ForgottenPasswordForm
        isLoading={isLoading}
        submit={data => handleSubmit(data)}
      />
      <p>Or login with email</p>
      <button onClick={() => history.push('/login')}>Sign In</button>
    </div>
  );
};

export default ForgottenPassword;
