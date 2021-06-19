import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import React, { useState } from 'react';
import { useTheme, makeStyles } from '@material-ui/core/styles';

export default function IoTButton(props) {
  const theme = useTheme();

  return (
    <Button
      style={{
        // background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
        borderRadius: '10px',
        border: 0,
        padding: '30 30px',
        // boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
      }}
      type="submit"
      variant="contained"
      color="primary"
      {...props}
    >
      <Typography
        variant="body1"
        style={{
          fontWeight: 'bold',
        }}
      >
        {props.children}
      </Typography>
    </Button>
  );
}
