import * as yup from 'yup';

export const schema = yup.object().shape({
  email: yup.string().required().email(),
  password: yup.string().required().min(8).max(20),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref('password')], 'Passwords do not match.'),
  agreeTerms: yup.boolean().required().oneOf([true], 'The terms of service must be accepted.'),
});

export const defaultValues = {
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false,
};
