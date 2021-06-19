import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';
import { useTheme, makeStyles } from '@material-ui/core/styles';

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
    // '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
    //   borderColor: theme.palette.text.secondary,
    // },
    // '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
    //   borderColor: theme.palette.primary.main,
    // },
    // '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    //   borderColor: theme.palette.primary.main,
    // },
  },
}));

export default function IoTextField(props) {
  const theme = useTheme();
  const { input } = useStyle();

  return <TextField className={input} {...props} />;
}
