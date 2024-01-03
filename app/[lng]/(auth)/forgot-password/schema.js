import * as yup from 'yup';

export const schema = yup.object().shape({
  email: yup.string().required().email(),
});

export const defaultValues = {
  email: '',
};
