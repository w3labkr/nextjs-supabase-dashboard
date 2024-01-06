import { useTranslations } from 'next-intl';
import { useContext } from 'react';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import { ColorModeContext } from './ColorModeContext';

export default function ToggleColorMode({ color = 'inherit', size = 'small', ...rest }) {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const t = useTranslations('ToggleColorMode');

  return (
    <Button onClick={colorMode.toggleColorMode} color={color} size={size} {...rest}>
      {t('mode')}: {theme.palette.mode === 'dark' ? t('on') : t('off')}
    </Button>
  );
}
