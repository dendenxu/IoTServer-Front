import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#fff',
    },
    error: {
      main: '#ed6663',
    },
    warning: {
      main: '#ffa372',
    },
    info: {
      main: '#878DA4',
    },
    background: {
      default: '#111',
      widget: '#222',
    },
    light: {
      main: '#eee',
      dark: '#ccc',
    },
    text: {
      primary: '#fff',
      secondary: '#ddd',
      dark: '#111',
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
