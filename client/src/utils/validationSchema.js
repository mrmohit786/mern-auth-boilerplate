import * as Yup from 'yup';

export const registerFormSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(30, 'Too Long!')
    .required('Name is required'),

  email: Yup.string()
    .email('Must be a valid email address')
    .required('Email is required'),

  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password is too short - should be 6 chars minimum'),

  confirmPassword: Yup.string()
    .required('Confirm password')
    .when('password', {
      is: val => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf([Yup.ref('password')], 'Password not match'),
    }),
});

export const loginFormSchema = Yup.object().shape({
  email: Yup.string()
    .email('Must be a valid email address')
    .required('Email is required'),

  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password is too short - should be 6 chars minimum'),
});

export const ForgotPasswordFormSchema = Yup.object().shape({
  email: Yup.string()
    .required('Email is required')
    .email('Must be a valid email address'),
});

export const resetPasswordFormSchema = Yup.object().shape({
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password is too short - should be 6 chars minimum'),

  confirmPassword: Yup.string()
    .required('Confirm password')
    .when('password', {
      is: val => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf([Yup.ref('password')], 'Password not match'),
    }),
});
