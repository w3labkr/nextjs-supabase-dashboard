import * as yup from 'yup';

export const schema = yup.object().shape({
  verificationCode: yup.string().required().length(4),
});

export const defaultValues = {
  verificationCode: '',
};
