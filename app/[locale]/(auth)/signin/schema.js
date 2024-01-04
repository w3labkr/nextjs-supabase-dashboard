import * as yup from 'yup';

export const schema = yup.object().shape({
  email: yup.string().required('required').email('email-invalid'),
  password: yup.string().required('required').min(8, 'password-length').max(20, 'password-length'),
  rememberMe: yup.boolean(),
});

export const defaultValues = {
  email: '',
  password: '',
  rememberMe: false,
};
