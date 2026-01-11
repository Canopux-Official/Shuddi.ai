import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#134e4a', 
      light: '#2dd4bf',
      dark: '#115e59',
      contrastText: '#fff',
    },
    background: {
      default: '#ffffff',
      paper: '#f8fafc', 
    },
    text: {
      primary: '#0f172a', 
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Plus Jakarta Sans", sans-serif', 
    h3: { fontWeight: 800, letterSpacing: '-0.02em' },
    h4: { fontWeight: 700, letterSpacing: '-0.01em' },
    button: { fontWeight: 600, textTransform: 'none', fontSize: '1rem' },
  },
  shape: {
    borderRadius: 16, 
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '12px 24px',
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 4px 12px rgba(19, 78, 74, 0.2)' },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#f8fafc',
            '& fieldset': { borderColor: '#e2e8f0' },
            '&:hover fieldset': { borderColor: '#cbd5e1' },
            '&.Mui-focused fieldset': { borderColor: '#134e4a' },
          },
        },
      },
    },
  },
});