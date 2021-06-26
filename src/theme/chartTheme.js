import { fade, makeStyles, useTheme } from '@material-ui/core/styles';
import theme from './theme';

export default {
  textColor: theme.palette.primary.main,
  // background: theme.palette.background.widget,
  fontFamily: theme.typography.fontFamily,
  // fontFamily: 'Teko',
  fontSize: 14,
  tooltip: {
    container: {
      background: theme.palette.background.default,
      fontWeight: 'bold',
    },
    tableCellValue: {},
  },
  axis: {
    ticks: {
      line: {},
      text: {
        fontWeight: 'bold',
      },
    },
  },
  labels: {
    text: {
      fontWeight: 'bold',
    },
  },
  grid: {
    line: {
      stroke: fade(theme.palette.primary.main, 0.2),
      strokeWidth: 3,
    },
  },
};
