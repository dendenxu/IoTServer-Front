/* eslint-disable no-use-before-define */
/* eslint-disable no-bitwise */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-shadow */
/* eslint-disable no-return-await */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import Checkbox from '@material-ui/core/Checkbox';
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
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import Chip from '@material-ui/core/Chip';
import RefreshIcon from '@material-ui/icons/Refresh';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
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
    fetchDataFromServer();
  }, []);

  const processPayload = payload => {
    payload.date = new Date(payload.date);
  };

  // Quitely and passively fetch data from the server
  const fetchDataFromServer = async (pageIndex, pageSize) => {
    // Fetch full data from the server, including latest status
    const res = await fetch(
      // `/api/message/query?page=${pageIndex || 0}&size=${
      // pageSize || defaultPageSize
      // }`,
      `/api/message/query`,
    );
    if (res.ok) {
      const body = await res.json();
      console.log('Getting data from server');
      console.log(body);
      body.forEach(processPayload);
      setData(body);
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
    // {
    //   field: 'name',
    //   headerName: 'Device',
    //   flex: 0.08,
    //   editable: false,
    //   renderCell: renderBold,
    // },
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

  const [loading, setLoading] = useState(false);

  const CustomLoadingOverlay = () => <Loading loadingData />;

  const handleRefresh = async e => {
    setLoading(true);
    await fetchDataFromServer(curPage, curPageSize);
    setLoading(false);
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

  const handlePageChange = async params => {
    console.log(params);
    const { page, pageSize } = params;
    setLoading(true);
    setCurPage(page);
    setCurPageSize(pageSize);
    await fetchDataFromServer(page, pageSize);
    setLoading(false);
  };

  return (
    <div className={classes.table}>
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
        // checkboxSelection
        disableSelectionOnClick
        autoHeight
        pagination
        density="compact"
        pageSize={defaultPageSize}
        // rowCount={16384}
        // paginationMode="server"
        // onPageChange={handlePageChange}
        loading={loading}
        components={{
          Toolbar: CustomToolbar,
          LoadingOverlay: CustomLoadingOverlay,
        }}
      />
    </div>
  );
}
