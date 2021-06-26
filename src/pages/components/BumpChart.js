/* eslint-disable no-shadow */
import { ResponsiveAreaBump } from '@nivo/bump';
import React, { useState, useEffect } from 'react';
import { fade, makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';

import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';

import moment from 'moment';

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker,
} from '@material-ui/pickers';

import tempBump from '../../assets/temp/tempBump';
import chartTheme from '../../theme/chartTheme';
import Loading from './LoadingMask';

const useStyles = makeStyles(theme => ({
  table: {
    height: '90%',
    width: '100%',
  },

  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: theme.palette.background.widget,
    margin: theme.spacing(3, 1.5, 1.5, 3),
    padding: theme.spacing(2, 0, 0),
    borderRadius: '32px',
    minWidth: 320,
    width: '60%',
  },

  picker: {
    paddingLeft: theme.spacing(1),
  },

  pickerButton: {
    background: theme.palette.background.button,
  },

  header: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    width: '100%',
    paddingLeft: theme.spacing(3),
  },

  headerTitle: {
    fontWeight: 'bold',
    display: 'flex',
  },

  headerDetail: {
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
  },

  headerDetailElement: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },

  resolutionInputWrapper: {
    width: 64,
    borderRadius: 10,
    background: theme.palette.background.button,
    paddingLeft: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },

  refreshButton: {
    marginRight: theme.spacing(1),
  },

  refreshIndicator: {
    height: '70%',
    marginLeft: theme.spacing(1),
  },
}));

const MyResponsiveAreaBump = ({ data /* see data tab */, theme }) => (
  <ResponsiveAreaBump
    theme={theme}
    data={data}
    margin={{ top: 72, right: 160, bottom: 32, left: 120 }}
    align="end"
    colors={{ scheme: 'set3' }}
    blendMode="normal"
    fillOpacity={0.7}
    activeFillOpacity={0.85}
    // spacing={4}
    xPadding={0.6}
    borderWidth={3}
    activeBorderWidth={6}
    borderColor={{ from: 'color', modifiers: [['darker', '1.8']] }}
    startLabel="id"
    startLabelTextColor={{ from: 'color', modifiers: [['brighter', '1.0']] }}
    endLabelTextColor={{ from: 'color', modifiers: [['brighter', '1.0']] }}
    axisTop={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: -20,
      legend: '',
      legendPosition: 'middle',
      legendOffset: -36,
    }}
    axisBottom={null}
  />
);

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

export default function BumpChart(props) {
  const theme = useTheme();
  const classes = useStyles();
  const [data, setData] = useState(tempBump);
  const [from, setFrom] = useState(new Date(1624666885920));
  const [to, setTo] = useState(new Date(1624673885920));
  const [tick, setTick] = useState(10);
  const [fromAnchorEl, setFromAnchorEl] = useState(null);
  const [toAnchorEl, setToAnchorEl] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);

  const fetchDataFromServer = async (fromMills, toMills, tick) => {
    setLoadingData(true);
    const res = await fetch(
      `/api/message/detailcount?fromMills=${fromMills}&toMills=${toMills}&tick=${tick}`,
    );

    if (res.ok) {
      const body = await res.json();
      setData(body);
    }
    setLoadingData(false);
    setNeedRefresh(false);
  };

  useEffect(() => {
    fetchDataFromServer(from.getTime(), to.getTime(), tick);
  }, []);

  useEffect(() => {
    setNeedRefresh(true);
  }, [from, to, tick]);

  const handleRefresh = () => {
    fetchDataFromServer(from.getTime(), to.getTime(), tick);
  };

  return (
    <div {...props} className={classes.root}>
      <div className={classes.header}>
        <Typography
          variant="h5"
          color="primary"
          className={classes.headerTitle}
        >
          Device Activity
        </Typography>

        <Typography variant="body1" className={classes.headerDetail}>
          Device activity rank from{` `}
          <DatePickerButton
            date={from}
            setAnchorEl={setFromAnchorEl}
            className={classes.headerDetailElement}
          />
          {` `}to{` `}
          <DatePickerButton
            date={to}
            setAnchorEl={setToAnchorEl}
            className={classes.headerDetailElement}
          />
          {` `}resolution: {` `}
          <div className={classes.resolutionInputWrapper}>
            <InputBase
              label="Resolution"
              id="outlined-size-small"
              defaultValue="Small"
              variant="outlined"
              size="small"
              type="number"
              value={tick}
              onChange={e => {
                setTick(e.target.value);
              }}
            />
          </div>
          <IconButton
            aria-label="search"
            onClick={handleRefresh}
            size="small"
            className={classes.refreshButton}
          >
            <RefreshIcon color={needRefresh ? 'primary' : 'default'} />
          </IconButton>
          {loadingData && (
            <CircularProgress className={classes.refreshIndicator} size={24} />
          )}
        </Typography>

        <DateTimePicker
          start
          anchorEl={fromAnchorEl}
          setAnchorEl={setFromAnchorEl}
          date={from}
          setDate={setFrom}
        />
        <DateTimePicker
          anchorEl={toAnchorEl}
          setAnchorEl={setToAnchorEl}
          date={to}
          setDate={setTo}
        />
      </div>

      <div className={classes.table}>
        <MyResponsiveAreaBump data={data} theme={chartTheme} />
      </div>
    </div>
  );
}
