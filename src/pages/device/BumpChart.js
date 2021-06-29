/* eslint-disable no-shadow */
import { ResponsiveAreaBump } from '@nivo/bump';
import React, { useState, useEffect } from 'react';
import { fade, makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';

import CircularProgress from '@material-ui/core/CircularProgress';

import tempBump from '../../assets/temp/tempBump';
import chartTheme from '../../theme/chartTheme';

import DatePickerButton from '../components/DatePickerButton';
import DateTimePicker from '../components/DateTimePicker';

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

export default function BumpChart(props) {
  const theme = useTheme();
  const classes = useStyles();
  const [data, setData] = useState(tempBump);

  const [fromAnchorEl, setFromAnchorEl] = useState(null);
  const [toAnchorEl, setToAnchorEl] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);

  const [from, setFrom] = useState(new Date(1624666885920));
  const [to, setTo] = useState(new Date(1624673885920));
  const [tick, setTick] = useState(10);

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
    if (!needRefresh) {
      const it = setTimeout(() => {
        fetchDataFromServer(from.getTime(), to.getTime(), tick);
      }, 1000);

      return () => {
        clearTimeout(it);
      };
    }
    return () => {};
  }, [data, from, to, tick, needRefresh]);

  useEffect(() => {
    fetchDataFromServer(from.getTime(), to.getTime(), tick);
  }, []);

  useEffect(() => {
    // we'd like the user to click refresh manually since it might introduce too much load if not
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

        <Typography
          component="span"
          variant="body1"
          className={classes.headerDetail}
        >
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
            <RefreshIcon
              style={{
                color: needRefresh
                  ? theme.palette.warning.main
                  : theme.palette.primary.main,
              }}
            />
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
