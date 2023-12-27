'use client';

import React, { useState, useMemo } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ColorModeContext from './ColorModeContext';
import { lightTheme, darkTheme } from './themes';

function getDesignTokens(mode: 'light' | 'dark') {
  return mode === 'light' ? lightTheme : darkTheme;
}

export default function MuiProvider({ children, defaultMode }: { children: React.ReactNode; defaultMode: string }) {
  const [mode, setMode] = useState(defaultMode);
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    []
  );

  // Update the theme only if the mode changes
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <AppRouterCacheProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AppRouterCacheProvider>
  );
}
