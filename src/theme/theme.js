import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#fff',
    },
    success: {
      main: '#4caf50',
    },
    error: {
      main: '#ed6663',
    },
    warning: {
      main: '#ffa372',
    },
    info: {
      main: '#1976d2',
    },
    background: {
      default: '#111',
      paper: '#222',
      widget: '#222',
      button: '#333',
      new: '#888',
      transparent: '#0000',
    },
    light: {
      main: '#eee',
      dark: '#ddd',
    },
    text: {
      primary: '#fff',
      secondary: '#ddd',
      dark: '#111',
    },
    action: {
      hover: '#333',
      active: '#ddd',
    },
  },
  status: {
    danger: 'orange',
  },
  typography: {
    fontFamily: [
      'Rajdhani',
      'Teko',
      'PT Sans',
      // 'Harlow Solid Italic',
      // 'Roboto',
      // 'Josefin Sans',
      // 'Josefin Slab',
      'Noto Sans SC',
      'PingFang SC',
      'sans-serif',
    ].join(', '),
  },
});

export default theme;
