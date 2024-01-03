import * as yup from 'yup';

export const schema = yup.object().shape({
  password: yup.string().required().min(8).max(20),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref('password')], 'Passwords do not match.'),
});

export const defaultValues = {
  password: '',
  confirmPassword: '',
};
