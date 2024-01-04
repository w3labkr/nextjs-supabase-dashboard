import * as yup from 'yup';

export const schema = yup.object().shape({
  email: yup.string().required('required').email('email-invalid'),
  password: yup.string().required('required').min(8, 'password-length').max(20, 'password-length'),
  confirmPassword: yup
    .string()
    .required('required')
    .oneOf([yup.ref('password')], 'password-match'),
  terms: yup.boolean().required().oneOf([true], 'required'),
});

export const defaultValues = {
  email: '',
  password: '',
  confirmPassword: '',
  terms: false,
};
