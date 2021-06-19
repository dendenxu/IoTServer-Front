import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(-2),
    padding: 0,
  },

  flex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default function ToggleBox(props) {
  const { text, className, ...other } = props;
  const classes = useStyles();

  return (
    <div className={`${classes.root} ${className}`} {...other}>
      <FormControlLabel
        control={<Checkbox value="remember" color="secondary" size="small" />}
        label={
          <div className={classes.flex}>
            <Typography
              variant="caption"
              style={{
                marginLeft: -5,
              }}
            >
              {text}
            </Typography>
          </div>
        }
        style={{
          marginRight: 0,
        }}
      />
    </div>
  );
}
