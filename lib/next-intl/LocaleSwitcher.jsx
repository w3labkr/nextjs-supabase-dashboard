import { useState, useEffect, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/navigation';
import { locales } from '@/next-intl.config';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import languages from './data/languages.json';

function DialogRaw(props) {
  const { open, onClose, selectedValue, ...other } = props;
  const [newValue, setNewValue] = useState(selectedValue);

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();

  useEffect(() => {
    if (!open) setNewValue(selectedValue);
  }, [selectedValue, open]);

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(newValue);
    startTransition(() => {
      router.replace(pathname, { locale: newValue });
    });
  };

  const handleClose = () => {
    onClose(newValue);
  };

  const handleChange = (newValue) => {
    setNewValue(newValue);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      {...other}
    >
      <DialogTitle>{t('dialog-title')}</DialogTitle>
      <DialogContent dividers>
        <List>
          {locales.map((loc) => (
            <ListItem disablePadding key={loc}>
              <ListItemButton selected={newValue === loc} onClick={() => handleChange(loc)} disabled={isPending}>
                <ListItemText primary={languages[loc][locale]} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          {t('dialog-cancel')}
        </Button>
        <Button onClick={handleOk}>{t('dialog-ok')}</Button>
      </DialogActions>
    </Dialog>
  );
}

DialogRaw.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

// A Client Component that registers an event listener for
// the `change` event of the select, uses `useRouter`
// to change the locale and uses `useTransition` to display
// a loading state during the transition.

export default function LocaleSwitcher({ color = 'inherit', size = 'small', ...rest }) {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(locale);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (newValue) => {
    setOpen(false);
    if (newValue) setSelectedValue(newValue);
  };

  return (
    <>
      <Button onClick={handleClickOpen} color={color} size={size} {...rest}>
        {t('button')}
      </Button>
      <DialogRaw keepMounted open={open} onClose={handleClose} selectedValue={selectedValue} />
    </>
  );
}
