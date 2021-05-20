import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { ForgotPasswordFormSchema } from 'utils/validationSchema';

const initialValues = {
  email: '',
};

const ForgotPasswordForm = ({ submit, isLoading }) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ForgotPasswordFormSchema}
      onSubmit={submit}
    >
      {formik => {
        // const { errors, touched } = formik;
        return (
          <div>
            <Form>
              <h1>Forgot Password</h1>
              <div>
                <label htmlFor='email'>Email</label>
                <Field type='email' name='email' id='email' />
                <ErrorMessage name='email' component='span' />
              </div>
              <button disabled={isLoading} type='submit'>
                {isLoading ? 'Submitting...' : 'Submit'}
              </button>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
};

export default ForgotPasswordForm;
