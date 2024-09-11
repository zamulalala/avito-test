import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#283593',
      light: '#303f9f',
      dark: '#1a237e',
    },
    secondary: {
      main: '#ff1744',
      light: '#ff4569',
      dark: '#b2102f',
    },
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif',
  },
});

export default theme;