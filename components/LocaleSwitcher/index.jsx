import { useState } from 'react';
import PropTypes from 'prop-types';
import { useLocale, useTranslations } from 'next-intl';
import Button from '@mui/material/Button';
import Dialog from './Dialog';

// A Client Component that registers an event listener for
// the `change` event of the select, uses `useRouter`
// to change the locale and uses `useTransition` to display
// a loading state during the transition.

export default function LocaleSwitcher({ color = 'inherit', size = 'small', ...rest }) {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(locale);
  const t = useTranslations('LocaleSwitcher');

  const handleClose = (newValue) => {
    setOpen(false);
    if (newValue) setSelectedValue(newValue);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} color={color} size={size} {...rest}>
        {t('button')}
      </Button>
      <Dialog keepMounted open={open} onClose={handleClose} selectedValue={selectedValue} />
    </>
  );
}

LocaleSwitcher.propTypes = {
  color: PropTypes.string,
  size: PropTypes.string,
};
