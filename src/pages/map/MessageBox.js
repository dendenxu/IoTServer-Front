import React from 'react';
import {
  useTheme,
  makeStyles,
  fade,
  Typography,
  Button,
  IconButton,
} from '@material-ui/core';

import { ErrorOutline } from '@material-ui/icons';
import moment from 'moment';
import deviceColors from '../components/DeviceColors';

const useStyles = makeStyles(theme => ({
  line: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  lineTop: {
    marginTop: theme.spacing(1),
  },
  lineBottom: {
    marginBottom: theme.spacing(1),
  },
}));

export default function MessageBox(props) {
  const theme = useTheme();
  const classes = useStyles();
  const { message, device } = props;
  const { mqttId, info, value, alert, lat, lng, date } = message;

  return (
    <div
      style={{
        background: alert
          ? theme.palette.error.main
          : theme.palette.background.widget,
        padding: theme.spacing(2),
        maxWidth: 320,
      }}
    >
      <Typography
        variant="h4"
        style={{
          fontFamily: 'Teko',
          color: alert ? 'currentColor' : deviceColors(device.index),
        }}
      >
        {mqttId}
      </Typography>
      <Typography variant="body1" className={classes.line}>
        {' '}
        <strong>
          Message:
          <br />
        </strong>{' '}
        {info}
      </Typography>
      <Typography variant="body1" className={classes.line}>
        {' '}
        <strong>
          Value:
          <br />
        </strong>{' '}
        {value}
      </Typography>

      <Typography variant="body1" className={classes.lineTop}>
        <strong>
          Alert:
          <br />
        </strong>{' '}
      </Typography>
      <div
        className={classes.lineBottom}
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'start',
          alignItems: 'center',
        }}
      >
        <Typography variant="body1">{alert ? 'TRUE' : 'FALSE'}</Typography>
        {alert ? <ErrorOutline fontSize="small" /> : null}
      </div>
      <Typography variant="body1" className={classes.line}>
        {' '}
        <strong>
          Location(Lat, Lng):
          <br />
        </strong>{' '}
        {lat.toFixed(2)}, {lng.toFixed(2)}
      </Typography>
      <Typography variant="body1" className={classes.line}>
        {' '}
        <strong>
          Report Time:
          <br />
        </strong>{' '}
        {moment(date).format('yyyy-MM-DD HH:mm:ss')}
      </Typography>
    </div>
  );
}
