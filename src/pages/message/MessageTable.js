/* eslint-disable no-use-before-define */
/* eslint-disable no-bitwise */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-shadow */
/* eslint-disable no-return-await */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  TextField,
  Typography,
  Popover,
  Checkbox,
  IconButton,
  CircularProgress,
  Chip,
} from '@material-ui/core/';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  DataGrid,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
  GridOverlay,
} from '@material-ui/data-grid';
import { fade, makeStyles, useTheme } from '@material-ui/core/styles';
import { v4 as uuid } from 'uuid';
import _ from 'lodash';
import {
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  Refresh as RefreshIcon,
  CheckBox as CheckBoxIcon,
  FlightTakeoff as FlightTakeoffIcon,
  FlightLand as FlightLandIcon,
} from '@material-ui/icons';

import moment from 'moment';

import { ReactComponent as RobotIcon } from '../../assets/images/robot.svg';
import DatePickerButton from '../components/DatePickerButton';
import DateTimePicker from '../components/DateTimePicker';

import IoTButton from '../components/IoTButton';
import tempData from '../../assets/temp/tempData';
import Loading from '../components/LoadingMask';

const useStyles = makeStyles(theme => {
  const noOutline = {
    outline: 'none',
    border: 'none',

    background: fade(theme.palette.primary.main, 0.1),
  };

  const full = {
    width: '100%',
    height: '100%',
  };

  return {
    popover: {
      padding: theme.spacing(1),
      background: theme.palette.error.main,
      color: theme.palette.text.dark,
      fontWeight: 'bold',
    },

    table: {
      borderRadius: '32px',
      margin: theme.spacing(3),
      padding: theme.spacing(2, 3, 4),
      background: theme.palette.background.widget,
    },

    datagrid: {
      fontSize: '1.1rem',
      fontWeight: '500',
      border: 'none',

      '& .MuiDataGrid-root': {
        border: 'none',
        borderRadius: '16px',
      },
      '& .MuiDataGrid-columnSeparator': {
        color: theme.palette.primary.main,
      },
      color: theme.palette.text.secondary,
      '& .MuiDataGrid-columnsContainer': {
        // border: 'none',
        borderBottomColor: fade(theme.palette.light.dark, 0.5),
        color: theme.palette.text.primary,
        fontSize: '1.4rem',
        fontWeight: 'normal',
        fontFamily: 'Teko',
      },
      '& .MuiDataGrid-cell': {
        // border: 'none',
        borderBottomColor: fade(theme.palette.light.dark, 0.5),
      },
      '& .MuiDataGrid-cell:focus-within': noOutline,
      '& .MuiDataGrid-columnHeader:focus-within': noOutline,
      '& .MuiDataGrid-editInputCell': {
        fontSize: '1.1rem',
      },
    },

    normal: {
      background: 'transparent',
    },
    error: {
      background: `${fade(theme.palette.error.main, 0.1)} !important`,
    },
    new: {
      background: `${fade(theme.palette.warning.main, 0.5)} !important`,
    },
    modified: {
      background: `${fade(theme.palette.primary.main, 0.5)} !important`,
    },
    flex: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },

    input: {
      ...full,
      '& .MuiAutoComplete-root': full,
      '& .MuiFormControl-root': full,
      '& .MuiInputBase-root': {
        ...full,
        paddingTop: 0,
      },
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

    root: {
      width: '100%',
      height: '100%',
      position: 'relative',
    },

    tooltip: {
      position: 'absolute',
      bottom: theme.spacing(3),
      left: theme.spacing(3),
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      borderRadius: theme.spacing(4),
      // background: Color(theme.palette.background.widget).alpha(0.75),
      background: fade(theme.palette.background.widget, 0.75),
      padding: theme.spacing(2, 2),
    },

    refreshButton: {
      marginRight: theme.spacing(1),
    },

    refreshIndicator: {
      height: '70%',
      marginLeft: theme.spacing(1),
    },
  };
});

export default function MessageDataGrid(props) {
  const { email } = props;
  const theme = useTheme();
  const classes = useStyles();
  const [data, setData] = useState(
    JSON.parse(localStorage.getItem('message_table_data')) || [],
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [curPage, setCurPage] = useState(0);
  const [curPageSize, setCurPageSize] = useState(100);

  const [loadingData, setLoadingData] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);

  const [fromAnchorEl, setFromAnchorEl] = useState(null);
  const [toAnchorEl, setToAnchorEl] = useState(null);

  const [from, setFrom] = useState(new Date(1624774564339));
  const [to, setTo] = useState(new Date(1624947224752));

  useEffect(() => {
    // we'd like the user to click refresh manually since it might introduce too much load if not
    setNeedRefresh(true);
  }, [from, to]);

  const handleRefresh = async e => {
    setLoadingData(true);
    await fetchDataFromServer(curPage, curPageSize);
    setLoadingData(false);
    setNeedRefresh(false);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const CustomToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
      <Button color="primary" size="small" onClick={handleRefresh}>
        <RefreshIcon />
        Refresh
      </Button>
    </GridToolbarContainer>
  );

  const defaultPageSize = 100;

  useEffect(() => {
    try {
      localStorage.setItem('message_table_data', JSON.stringify(data));
    } catch (e) {
      // console.log(e);
      console.log("You've got too much data to store...");
    }
  }, [data]);

  useEffect(() => {
    (async () => {
      setLoadingData(true);
      console.log('Setting loading data...');
      await fetchDataFromServer();
      setLoadingData(false);
    })();
  }, []);

  const processPayload = payload => {
    payload.date = new Date(payload.date);
  };

  // Quitely and passively fetch data from the server
  const fetchDataFromServer = async () => {
    // Fetch full data from the server, including latest status
    const res = await fetch(
      `/api/message/query?fromMills=${from.getTime()}&toMills=${to.getTime()}`,
    );
    if (res.ok) {
      const body = await res.json();
      console.log('Getting data from server');
      console.log(body);
      body.forEach(processPayload);
      setData(body);
    } else {
      const text = await res.text();
      setErrorMessage(text);
      setAnchorEl(document.getElementById('root'));
    }
  };
  // render some bold font to display important stuff
  const renderBold = params => (
    <Typography
      style={{
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: theme.palette.text.secondary,
      }}
    >
      {params.value}
    </Typography>
  );
  const renderStatus = params => (
    <Typography
      style={{
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: params.row.alert
          ? theme.palette.error.main
          : theme.palette.info.main,
      }}
    >
      {params.value}
    </Typography>
  );

  const columns = [
    {
      hide: true,
      field: 'id',
      headerName: 'Index',
      flex: 0.06,
      sortable: true,
      editable: false,
      filterable: true,
      renderCell: renderBold,
    },
    {
      field: 'mqttId',
      headerName: 'MqttId',
      flex: 0.08,
      editable: true,
      renderCell: renderBold,
    },
    {
      field: 'info',
      headerName: 'Infomation',
      flex: 0.14,
      editable: false,
    },
    {
      field: 'lng',
      headerName: 'Longitude',
      type: 'number',

      flex: 0.087,
      editable: false,
    },
    {
      field: 'lat',
      headerName: 'Latitude',
      type: 'number',

      flex: 0.087,
      editable: false,
    },
    {
      field: 'value',
      headerName: 'Value',
      type: 'number',
      flex: 0.06,
      editable: false,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.075,
      editable: false,
      sortable: true,
      valueGetter: params =>
        params.row.alert === undefined
          ? ''
          : params.row.alert
          ? 'ALERT'
          : 'NORMAL',
      renderCell: renderStatus,
    },
    {
      field: 'date',
      headerName: 'Timestamp',
      flex: 0.12,
      editable: false,
      type: 'dateTime',
    },
  ];

  return (
    <div className={classes.table}>
      <div className={classes.header}>
        <Typography
          variant="h5"
          color="primary"
          className={classes.headerTitle}
        >
          Device Activity
        </Typography>

        <Typography
          variant="body1"
          component="span"
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
      </div>

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

      <Popover
        open={Boolean(anchorEl && errorMessage)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        onClick={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Typography className={classes.popover}>{errorMessage}</Typography>
      </Popover>

      <DataGrid
        className={classes.datagrid}
        rows={data}
        columns={columns}
        disableSelectionOnClick
        autoHeight
        pagination
        density="compact"
        pageSize={defaultPageSize}
        components={{
          Toolbar: CustomToolbar,
        }}
      />
    </div>
  );
}
