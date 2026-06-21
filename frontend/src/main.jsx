import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './app/store'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'

const dribbbleTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1', // Indigo
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#a855f7', // Purple
      contrastText: '#ffffff',
    },
    background: {
      default: '#0b0f19',
      paper: '#111827',
    },
    text: {
      primary: '#f3f4f6',
      secondary: '#9ca3af',
    },
  },
  typography: {
    fontFamily: "'Outfit', 'Inter', sans-serif",
    h4: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontFamily: "'Inter', sans-serif",
    },
    body2: {
      fontFamily: "'Inter', sans-serif",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0b0f19',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'none',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          WebkitBackdropFilter: 'blur(16px)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px 0 rgba(99, 102, 241, 0.18)',
            borderColor: 'rgba(99, 102, 241, 0.35)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'none',
          backgroundColor: 'rgba(17, 24, 39, 0.65)',
          WebkitBackdropFilter: 'blur(16px)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 20px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          border: 'none',
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
          border: 'none',
        },
        outlinedPrimary: {
          borderColor: 'rgba(99, 102, 241, 0.5)',
          '&:hover': {
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.08)',
          },
        },
        outlinedSecondary: {
          borderColor: 'rgba(168, 85, 247, 0.5)',
          '&:hover': {
            borderColor: '#a855f7',
            backgroundColor: 'rgba(168, 85, 247, 0.08)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.08)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.18)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6366f1',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(11, 15, 25, 0.75)',
          WebkitBackdropFilter: 'blur(20px)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: 'none',
        },
      },
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={dribbbleTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>
)
