'use client';

import * as yup from 'yup';
import { useTranslations } from 'next-intl';

export function useSchema() {
  const t = useTranslations('auth/signup/schema');

  const schema = yup.object().shape({
    email: yup.string().required(t('email/required')).email(t('email/valid')),
    password: yup.string().required(t('password/required')).min(8, t('password/min')).max(20, t('password/max')),
    confirmPassword: yup
      .string()
      .required(t('password/required'))
      .oneOf([yup.ref('password')], t('password/valid')),
    terms: yup.boolean().required().oneOf([true], t('terms/required')),
  });

  const defaultValues = {
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  };

  return { schema, defaultValues };
}
