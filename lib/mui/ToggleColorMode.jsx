import { useContext } from 'react';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import LightModeIcon from '@mui/icons-material/LightMode';
import ModeNightIcon from '@mui/icons-material/ModeNight';
import { ColorModeContext } from './ColorModeContext';

export default function ToggleColorMode({ ...rest }) {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <IconButton onClick={colorMode.toggleColorMode} color="inherit" {...rest}>
      {theme.palette.mode === 'dark' ? <LightModeIcon /> : <ModeNightIcon />}
    </IconButton>
  );
}
