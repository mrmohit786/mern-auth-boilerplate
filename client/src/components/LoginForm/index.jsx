import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { loginFormSchema } from 'utils/validationSchema';

const initialValues = {
  name: '',
  email: '',
};

const LoginForm = ({ submit }) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={loginFormSchema}
      onSubmit={submit}
    >
      {formik => {
        // const { errors, touched } = formik;
        return (
          <div>
            <Form>
              <h1>LOGIN</h1>
              <div>
                <label htmlFor='email'>Email</label>
                <Field type='email' name='email' id='email' />
                <ErrorMessage name='email' component='span' />
              </div>

              <div className='form-row'>
                <label htmlFor='password'>Password</label>
                <Field type='password' name='password' id='password' />
                <ErrorMessage name='password' component='span' />
              </div>
              <button type='submit'>login</button>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
};

export default LoginForm;
