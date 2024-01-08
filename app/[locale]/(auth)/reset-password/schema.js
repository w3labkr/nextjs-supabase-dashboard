'use client';

import * as yup from 'yup';
import { useTranslations } from 'next-intl';

export function useSchema() {
  const t = useTranslations('auth/reset-password/schema');

  const schema = yup.object().shape({
    password: yup.string().required(t('password/required')).min(8, t('password/min')).max(20, t('password/max')),
    confirmPassword: yup
      .string()
      .required(t('password/required'))
      .oneOf([yup.ref('password')], t('password/valid')),
  });

  const defaultValues = {
    password: '',
    confirmPassword: '',
  };

  return { schema, defaultValues };
}
