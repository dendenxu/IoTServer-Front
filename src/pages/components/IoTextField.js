import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import withWidth, { isWidthUp, isWidthDown } from '@material-ui/core/withWidth';

const useStyle = makeStyles(theme => ({
  input: {
    '& div': {
      borderRadius: 16,
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: theme.palette.text.secondary,
        // borderWidth: 1
      },
    },
  },
}));

function IoTextField(props) {
  const { width } = props;
  const theme = useTheme();
  const classes = useStyle();

  const IoTextFieldSize = isWidthDown('xs', width) ? 'small' : 'medium';
  const IoTextFieldClassProps = {
    InputProps: {
      classes: {
        root: classes.IoTextFieldInput,
      },
    },
    InputLabelProps: {
      classes: {
        root: classes.IoTextFieldInput,
        // focused: {},
      },
    },
    FormHelperTextProps: {
      classes: {
        root: classes.IoTextHelperText,
      },
    },
  };

  return (
    <TextField
      className={classes.input}
      size={IoTextFieldSize}
      {...IoTextFieldClassProps}
      {...props}
    />
  );
}

export default withWidth()(IoTextField);
