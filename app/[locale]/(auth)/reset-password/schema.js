import * as yup from 'yup';

export const schema = yup.object().shape({
  password: yup.string().required('required').min(8, 'password-length').max(20, 'password-length'),
  confirmPassword: yup
    .string()
    .required('required')
    .oneOf([yup.ref('password')], 'password-match'),
});

export const defaultValues = {
  password: '',
  confirmPassword: '',
};
