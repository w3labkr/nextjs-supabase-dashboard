'use client';

import * as yup from 'yup';
import { useTranslations } from 'next-intl';

export function useSchema() {
  const t = useTranslations('auth/signin/schema');

  const schema = yup.object().shape({
    email: yup.string().required(t('email/required')).email(t('email/valid')),
    password: yup.string().required(t('password/required')).min(8, t('password/min')).max(20, t('password/max')),
    rememberMe: yup.boolean(),
  });

  const defaultValues = {
    email: '',
    password: '',
    rememberMe: false,
  };

  return { schema, defaultValues };
}
