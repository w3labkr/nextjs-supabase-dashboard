import { useLocale, useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Link from '@/components/Link';

export default function Nav() {
  const locale = useLocale();
  const t = useTranslations('AuthNavigation');

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 2,
      }}
    >
      <Link href={`/${locale}/forgot-password`} variant="body2">
        {t('forgot-password')}
      </Link>
      <Link href={`/${locale}/signup`} variant="body2">
        {t('signup')}
      </Link>
    </Box>
  );
}
