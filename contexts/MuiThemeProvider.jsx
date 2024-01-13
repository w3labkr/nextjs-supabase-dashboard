'use client';

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { StyledEngineProvider, ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ColorModeContext } from '@/contexts/ColorModeContext';
import { lightTheme, darkTheme } from '@/app/theme';

function getDesignTokens(mode = 'light') {
  return mode === 'light' ? lightTheme : darkTheme;
}

export default function MuiThemeProvider({ children, defaultMode = 'light' }) {
  const [mode, setMode] = useState(defaultMode);
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [setMode]
  );

  // Update the theme only if the mode changes
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <StyledEngineProvider injectFirst>
      <AppRouterCacheProvider options={{ enableCssLayer: true }}>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </ColorModeContext.Provider>
      </AppRouterCacheProvider>
    </StyledEngineProvider>
  );
}

MuiThemeProvider.propTypes = {
  children: PropTypes.any.isRequired,
  defaultMode: PropTypes.string,
};
