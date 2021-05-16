import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { registerFormSchema } from 'utils/validationSchema';
import './styles.scss';

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
        const { errors, touched } = formik;
        return (
          <div className='register-container'>
            <Form>
              <h1>REGISTER</h1>
              <div className='form-row'>
                <label htmlFor='email'>Name</label>
                <Field
                  type='name'
                  name='name'
                  id='name'
                  className={errors.name && touched.name ? 'input-error' : null}
                />
                <ErrorMessage name='name' component='span' className='error' />
              </div>
              <div className='form-row'>
                <label htmlFor='email'>Email</label>
                <Field
                  type='email'
                  name='email'
                  id='email'
                  className={
                    errors.email && touched.email ? 'input-error' : null
                  }
                />
                <ErrorMessage name='email' component='span' className='error' />
              </div>

              <div className='form-row'>
                <label htmlFor='password'>Password</label>
                <Field
                  type='password'
                  name='password'
                  id='password'
                  className={
                    errors.password && touched.password ? 'input-error' : null
                  }
                />
                <ErrorMessage
                  name='password'
                  component='span'
                  className='error'
                />
              </div>
              <div className='form-row'>
                <label htmlFor='confirmPassword'>confirmPassword</label>
                <Field
                  type='password'
                  name='confirmPassword'
                  id='confirmPassword'
                  className={
                    errors.confirmPassword && touched.confirmPassword
                      ? 'input-error'
                      : null
                  }
                />
                <ErrorMessage
                  name='confirmPassword'
                  component='span'
                  className='error'
                />
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
