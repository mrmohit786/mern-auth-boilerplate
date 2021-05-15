import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { authenticate, isAuth } from 'helpers/auth';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import RegisterForm from 'components/RegisterForm';

const Register = () => {
  const handleSubmit = data => {
    console.log(data);
  };
  return (
    <div>
      <RegisterForm submit={data => handleSubmit(data)} />
    </div>
  );
};

export default Register;
