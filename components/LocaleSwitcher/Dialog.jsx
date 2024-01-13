import { useState, useEffect, useTransition } from 'react';
import PropTypes from 'prop-types';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/navigation';
import { locales } from '@/next-intl.config';

import Button from '@mui/material/Button';
import MuiDialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

export default function Dialog({ open, onClose, selectedValue, ...rest }) {
  const [newValue, setNewValue] = useState(selectedValue);
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const languages = useTranslations('languages');
  const t = useTranslations('LocaleSwitcher');

  useEffect(() => {
    if (!open) setNewValue(selectedValue);
  }, [selectedValue, open]);

  const handleOk = () => {
    onClose(newValue);
    startTransition(() => {
      router.replace(pathname, { locale: newValue });
    });
  };

  return (
    <MuiDialog
      open={open}
      onClose={() => onClose(newValue)}
      maxWidth="xs"
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      {...rest}
    >
      <DialogTitle>{t('dialog-title')}</DialogTitle>
      <DialogContent dividers>
        <List>
          {locales.map((locale) => (
            <ListItem disablePadding key={locale}>
              <ListItemButton selected={newValue === locale} onClick={() => setNewValue(locale)} disabled={isPending}>
                <ListItemText primary={languages(locale)} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={() => onClose()}>
          {t('dialog-cancel')}
        </Button>
        <Button onClick={handleOk}>{t('dialog-ok')}</Button>
      </DialogActions>
    </MuiDialog>
  );
}

Dialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedValue: PropTypes.string.isRequired,
};
