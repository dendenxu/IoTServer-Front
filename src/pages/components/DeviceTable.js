/* eslint-disable react/display-name */
import * as React from 'react';
import Button from '@material-ui/core/Button';
import InputBase from '@material-ui/core/InputBase';
import Typography from '@material-ui/core/Typography';
import { DataGrid } from '@material-ui/data-grid';
import { fade, makeStyles, useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  table: {
    fontSize: '1rem',
    fontWeight: '500',
    margin: theme.spacing(3),
    border: 'none',
    background: theme.palette.background.widget,
    '& .MuiDataGrid-columnSeparator': {
      color: theme.palette.primary.main,
    },
    color: theme.palette.text.secondary,
    '& .MuiDataGrid-columnsContainer': {
      border: 'none',
      color: theme.palette.text.primary,
      fontSize: '1.4rem',
      fontWeight: 'normal',
      fontFamily: 'Teko',
    },
    '& .MuiDataGrid-cell': {
      border: 'none',
    },
    '& .MuiDataGrid-cell:focus': {
      outline: 'none',
      background: fade(theme.palette.primary.main, 0.1),
    },
    '& .MuiDataGrid-editCellInputBase': {
      fontSize: '1.0rem',
    },
  },

  normal: {
    background: '#0000',
  },
  error: {
    background: fade(theme.palette.error.main, 0.1),
  },
  flex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const renderBold = params => {
  const theme = useTheme();
  return (
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
};

const columns = [
  {
    field: 'id',
    headerName: 'MqttId',
    width: 125,
    editable: true,
    // resizable: true,

    // type: 'number',
    // valueGetter: params => `${params.getValue(params.id, 'mqttId') || ''}`,
    renderCell: renderBold,
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 120,
    editable: true,
    // resizable: true,
    renderCell: renderBold,
  },
  {
    field: 'desc',
    headerName: 'Description',
    // type: 'number',
    // width: 160,
    width: 250,
    editable: true,
    // resizable: true,
  },
  {
    field: 'type',
    headerName: 'Device Type',
    // description: 'This column has a value getter and is not sortable.',
    // sortable: false,
    width: 165,
    editable: true,
    // resizable: true,
  },
  {
    field: 'createdDate',
    headerName: 'Created At',
    width: 170,
    editable: false,
    type: 'dateTime',
  },

  {
    field: 'value',
    headerName: 'Value',
    width: 120,
    editable: false,
    // resizable: true,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
    editable: false,
    sortable: true,
    valueGetter: params => (params.row.alert ? 'ALERT' : 'NORMAL'),
    renderCell: params => {
      const theme = useTheme();
      return (
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
    },
    // resizable: true,
  },
  {
    field: 'statusUpdateDate',
    headerName: 'Status Update',
    width: 180,
    editable: false,
    type: 'dateTime',
  },
];

const rows = [
  {
    id: 1,
    name: 'Jon',
    desc: 'This is a strange device',
    type: ['Bot'],
    createdDate: new Date(),
    statusUpdateDate: new Date(),
    value: 250,
    alert: 0,
  },
  {
    id: 2,
    name: 'Cersei',
    desc: 'This is a strange device',
    type: ['Bot', 'Car'],
    createdDate: new Date(),
    statusUpdateDate: new Date(),
    value: 100,
    alert: 1,
  },
  {
    id: 3,
    name: 'Jaime',
    desc: 'This is a strange device',
    type: ['Drone'],
    createdDate: new Date(),
    statusUpdateDate: new Date(),
    value: 100,
    alert: 1,
  },
  {
    id: 4,
    name: 'Arya',
    desc: 'This is a strange device',
    type: ['Bot', 'Car'],
    createdDate: new Date(),
    statusUpdateDate: new Date(),
    value: 100,
    alert: 0,
  },
  {
    id: 5,
    name: 'Daenerys',
    desc: 'This is a strange device',
    type: ['Bot', 'Car'],
    createdDate: new Date(),
    statusUpdateDate: new Date(),
    alert: 0,
  },
  {
    id: 6,
    name: "I've got no name",
    desc: 'This is a strange device',
    type: ['Car'],
    createdDate: new Date(),
    statusUpdateDate: new Date(),
    value: 50,
  },
  {
    id: 7,
    name: 'Ferrara',
    desc: 'This is a strange device',
    type: ['Bot', 'Car'],
    createdDate: new Date(),
    statusUpdateDate: new Date(),
    value: 100,
    alert: 1,
  },
  {
    id: 8,
    name: 'Rossini',
    desc: 'This is a strange device',
    type: ['Bot', 'Car'],
    createdDate: new Date(),
    statusUpdateDate: new Date(),
    value: 50,
    alert: 1,
  },
  {
    id: 9,
    name: 'Harvey',
    desc: 'This is a strange device',
    type: ['Bot', 'Car'],
    createdDate: new Date(),
    statusUpdateDate: new Date(),
    value: 50,
    alert: 0,
  },
];

export default function DataGridDemo() {
  const theme = useTheme();
  const classes = useStyles();
  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <DataGrid
        className={classes.table}
        rows={rows}
        columns={columns}
        // pageSize={6}
        // disableExtendRowFullWidth
        checkboxSelection
        disableSelectionOnClick
        autoHeight
        autoPageSize
        getRowClassName={params =>
          params.row.alert ? classes.error : classes.normal
        }
        onEditCellChangeCommitted={params => {
          console.log('This edit has been committed');
          console.log(params);
        }}
      />
    </div>
  );
}
