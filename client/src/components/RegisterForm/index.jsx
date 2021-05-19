import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { registerFormSchema } from 'utils/validationSchema';

const initialValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const RegisterForm = ({ submit }) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={registerFormSchema}
      onSubmit={submit}
    >
      {formik => {
        // const { errors, touched } = formik;
        return (
          <div>
            <Form>
              <h1>REGISTER</h1>
              <div className='form-row'>
                <label htmlFor='email'>Name</label>
                <Field type='name' name='name' id='name' />
                <ErrorMessage name='name' component='span' />
              </div>
              <div className='form-row'>
                <label htmlFor='email'>Email</label>
                <Field type='email' name='email' id='email' />
                <ErrorMessage name='email' component='span' />
              </div>

              <div className='form-row'>
                <label htmlFor='password'>Password</label>
                <Field type='password' name='password' id='password' />
                <ErrorMessage name='password' component='span' />
              </div>
              <div>
                <label htmlFor='confirmPassword'>confirmPassword</label>
                <Field
                  type='password'
                  name='confirmPassword'
                  id='confirmPassword'
                />
                <ErrorMessage name='confirmPassword' component='span' />
              </div>
              <button type='submit'>Register</button>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
};

export default RegisterForm;
