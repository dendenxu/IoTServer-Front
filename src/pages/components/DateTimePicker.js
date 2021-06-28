import React from 'react';
import { makeStyles, Popover } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker,
} from '@material-ui/pickers';

const useStyles = makeStyles(theme => ({
  picker: {
    paddingLeft: theme.spacing(1),
  },
}));

const DateTimePicker = props => {
  const { start, anchorEl, setAnchorEl, date, setDate, ...other } = props;
  const classes = useStyles();

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handlePopoverClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      {...other}
    >
      <div className={classes.picker}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            // disableToolbar
            variant="inline"
            format="yyyy/MM/dd"
            margin="normal"
            id="date-picker-inline"
            label={start ? 'Starting Date' : 'End Date'}
            value={date}
            onChange={newDate => {
              setDate(newDate);
            }}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
          <KeyboardTimePicker
            // disableToolbar
            variant="inline"
            margin="normal"
            id="time-picker"
            label={start ? 'Starting Time' : 'End Time'}
            value={date}
            onChange={newDate => {
              setDate(newDate);
            }}
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
          />
        </MuiPickersUtilsProvider>
      </div>
    </Popover>
  );
};

export default DateTimePicker;
