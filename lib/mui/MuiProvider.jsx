'use client';

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { StyledEngineProvider, ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ColorModeContext } from './ColorModeContext.js';
import { lightTheme, darkTheme } from './themes';

function getDesignTokens(mode = 'light') {
  return mode === 'light' ? lightTheme : darkTheme;
}

export default function MuiProvider({ children, defaultMode = 'light' }) {
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
      <AppRouterCacheProvider>
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

MuiProvider.propTypes = {
  children: PropTypes.node.isRequired,
  defaultMode: PropTypes.string,
};
