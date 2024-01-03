import * as yup from 'yup';

export const schema = yup.object().shape({
  email: yup.string().required().email(),
  password: yup.string().required().min(8).max(20),
  rememberMe: yup.boolean(),
});

export const defaultValues = {
  email: '',
  password: '',
  rememberMe: false,
};
