import * as yup from 'yup';

export const schema = yup.object().shape({
  verificationCode: yup.string().required('required'),
});

export const defaultValues = {
  verificationCode: '',
};
