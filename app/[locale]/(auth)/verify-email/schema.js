'use client';

import * as yup from 'yup';
import { useTranslations } from 'next-intl';

export function useSchema() {
  const t = useTranslations('auth/verify-email/schema');

  const schema = yup.object().shape({
    verificationCode: yup.string().required(t('verificationCode/required')),
  });

  const defaultValues = {
    verificationCode: '',
  };

  return { schema, defaultValues };
}
