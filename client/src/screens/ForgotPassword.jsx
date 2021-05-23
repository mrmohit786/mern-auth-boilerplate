import React, { useState } from 'react';
import { toast } from 'react-toastify';
import ForgotPasswordForm from 'components/FormikForm/ForgotPasswordForm';
import request from 'utils/request';

const ForgottenPassword = ({ history }) => {
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async formData => {
    setLoading(true);
    const res = await request({
      url: `/password/forget`,
      method: 'PUT',
      data: {
        email: formData.email,
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
      <ForgotPasswordForm
        isLoading={isLoading}
        submit={data => handleSubmit(data)}
      />
    </div>
  );
};

export default ForgottenPassword;
