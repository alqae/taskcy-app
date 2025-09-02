import { createTheme } from '@mui/material/styles'
import { ThemeProvider } from '@emotion/react'
import { SnackbarProvider } from 'notistack'
import { CssBaseline } from '@mui/material'

import RalewayMediumWoff2 from '@fonts/Raleway-Medium.woff2'
import RalewayRegWoff2 from '@fonts/Raleway-Regular.woff2'
import RalewayBoldWoff2 from '@fonts/Raleway-Bold.woff2'
import RalewayThinWoff2 from '@fonts/Raleway-Thin.woff2'

import { AuthProvider } from './context/AuthContext'
import { Router } from './Router'

const getDesignTokens = (mode: 'light' | 'dark') => ({
  palette: {
    mode,
    primary: {
      main: '#724C7D',
    },
    secondary: {
      main: '#CFDEDB',
    },
    background: {
      default: mode === 'light' ? '#F5F5F5' : '#212121',
      paper: mode === 'light' ? '#FFFFFF' : '#2C2C2C',
    },
    custom: {
      cardGreen: '#CFDEDB',
      cardGray: '#E9E9E9',
      cardPurple: '#724C7D',
    },
    text: {
      primary: mode === 'light' ? '#111111' : '#FFFFFF',
      secondary: mode === 'light' ? '#555555' : '#B0B0B0',
    },
  },
})

const theme = createTheme({
  colorSchemes: {
    dark: true,
    light: true,
  },
  ...getDesignTokens('light'),
  defaultColorScheme: 'light',
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
    fontFamily: 'Raleway, Arial',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Raleway';
          font-style: normal;
          font-display: swap;
          font-weight: 100;
          src: local('Raleway'), local('Raleway-Thin'), url(${RalewayThinWoff2}) format('woff2');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }

        @font-face {
          font-family: 'Raleway';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: local('Raleway'), local('Raleway-Regular'), url(${RalewayRegWoff2}) format('woff2');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }

        @font-face {
          font-family: 'Raleway';
          font-style: normal;
          font-display: swap;
          font-weight: 500;
          src: local('Raleway'), local('Raleway-Medium'), url(${RalewayMediumWoff2}) format('woff2');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }

        @font-face {
          font-family: 'Raleway';
          font-style: normal;
          font-display: swap;
          font-weight: 700;
          src: local('Raleway'), local('Raleway-Bold'), url(${RalewayBoldWoff2}) format('woff2');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
      `,
    },
  },
})

export const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <SnackbarProvider>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  )
}
