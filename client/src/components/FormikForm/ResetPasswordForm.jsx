import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { resetPasswordFormSchema } from 'utils/validationSchema';

const initialValues = {
  password: '',
  confirmPassword: '',
};

const ResetPasswordForm = ({ submit, isLoading }) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={resetPasswordFormSchema}
      onSubmit={submit}
    >
      {formik => {
        // const { errors, touched } = formik;
        return (
          <div>
            <Form>
              <h1>RESET PASSWORD</h1>
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
              <button type='submit' disabled={isLoading}>{isLoading? 'Submitting...' : 'Submit'}</button>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
};

export default ResetPasswordForm;
