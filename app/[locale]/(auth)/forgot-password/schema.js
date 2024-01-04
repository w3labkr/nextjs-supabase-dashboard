import * as yup from 'yup';

export const schema = yup.object().shape({
  email: yup.string().required('required').email('email-invalid'),
});

export const defaultValues = {
  email: '',
};
