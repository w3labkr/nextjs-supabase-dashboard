import { useContext } from 'react';
import PropTypes from 'prop-types';
import { useTranslations } from 'next-intl';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { ColorModeContext } from '@/contexts/ColorModeContext';

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

ToggleColorMode.propTypes = {
  color: PropTypes.string,
  size: PropTypes.string,
};
