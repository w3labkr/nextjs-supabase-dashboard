'use client';

import * as yup from 'yup';
import { useTranslations } from 'next-intl';

export function useSchema() {
  const t = useTranslations('auth/forgot-password/schema');

  const schema = yup.object().shape({
    email: yup.string().required(t('email/required')).email(t('email/valid')),
  });

  const defaultValues = {
    email: '',
  };

  return { schema, defaultValues };
}
