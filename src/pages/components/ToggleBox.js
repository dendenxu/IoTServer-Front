import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  checkboxContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: theme.spacing(-2),
    padding: 0,
  },

  centeredFlex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default function ToggleBox(props) {
  const { text, ...other } = props;
  const classes = useStyles();

  return (
    <div className={classes.checkboxContainer} {...other}>
      <FormControlLabel
        control={<Checkbox value="remember" color="secondary" size="small" />}
        label={
          <div className={classes.centeredFlex}>
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
