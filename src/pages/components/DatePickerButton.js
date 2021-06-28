import React from 'react';
import { makeStyles, Button } from '@material-ui/core/';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
  pickerButton: {
    background: theme.palette.background.button,
  },
}));

const DatePickerButton = props => {
  const { date, setAnchorEl, ...other } = props;

  const classes = useStyles();
  return (
    <Button
      // variant="outlined"
      className={classes.pickerButton}
      onClick={e => {
        setAnchorEl(e.target);
      }}
      {...other}
    >
      {moment(date).format('yyyy-MM-DD hh:mm:ss')}
    </Button>
  );
};

export default DatePickerButton;
