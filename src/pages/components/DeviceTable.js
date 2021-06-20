/* eslint-disable react/display-name */
import * as React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { DataGrid } from '@material-ui/data-grid';
import { fade, makeStyles, useTheme } from '@material-ui/core/styles';

const columns = [
  {
    field: 'id',
    headerName: 'MqttId',
    width: 125,
    editable: true,
    // resizable: true,

    // type: 'number',
    // valueGetter: params => `${params.getValue(params.id, 'mqttId') || ''}`,
    renderCell: params => {
      const theme = useTheme();
      console.log(params);
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
    },
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 120,
    editable: true,
    // resizable: true,
    renderCell: params => {
      const theme = useTheme();
      console.log(params);
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
    },
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
    field: 'value',
    headerName: 'Last Value',
    width: 150,
    editable: false,
    // resizable: true,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 130,
    editable: false,
    sortable: true,
    valueGetter: params =>
      params.getValue(params.id, 'alert') ? 'ALERT' : 'NORMAL',
    renderCell: params => {
      const theme = useTheme();
      console.log(params);
      return (
        <Typography
          style={{
            fontSize: '1.1rem',
            fontWeight: 'bold',
            color: params.getValue(params.id, 'alert')
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
];

const rows = [
  {
    id: 1,
    name: 'Jon',
    desc: 'This is a strange device',
    type: ['Bot'],
    value: 250,
    alert: 0,
  },
  {
    id: 2,
    name: 'Cersei',
    desc: 'This is a strange device',
    type: ['Bot', 'Car'],
    value: 100,
    alert: 1,
  },
  {
    id: 3,
    name: 'Jaime',
    desc: 'This is a strange device',
    type: ['Drone'],
    value: 100,
    alert: 1,
  },
  {
    id: 4,
    name: 'Arya',
    desc: 'This is a strange device',
    type: ['Bot', 'Car'],
    value: 100,
    alert: 0,
  },
  {
    id: 5,
    name: 'Daenerys',
    desc: 'This is a strange device',
    type: ['Bot', 'Car'],
    alert: 0,
  },
  {
    id: 6,
    name: "I've got no name",
    desc: 'This is a strange device',
    type: ['Car'],
    value: 50,
  },
  {
    id: 7,
    name: 'Ferrara',
    desc: 'This is a strange device',
    type: ['Bot', 'Car'],
    value: 100,
    alert: 1,
  },
  {
    id: 8,
    name: 'Rossini',
    desc: 'This is a strange device',
    type: ['Bot', 'Car'],
    value: 50,
    alert: 1,
  },
  {
    id: 9,
    name: 'Harvey',
    desc: 'This is a strange device',
    type: ['Bot', 'Car'],
    value: 50,
    alert: 0,
  },
];

const useStyles = makeStyles(theme => ({
  table: {
    fontSize: '1rem',
    fontWeight: '500',
    margin: theme.spacing(3),
    borderWidth: 0,
    background: theme.palette.background.widget,
    '& .MuiDataGrid-columnSeparator': {
      color: theme.palette.primary.main,
    },
    color: theme.palette.text.secondary,
    '& .MuiDataGrid-columnsContainer': {
      borderWidth: 0,
      color: theme.palette.text.primary,
      fontSize: '1.4rem',
      fontWeight: 'normal',
      fontFamily: 'Teko',
    },
    '& .MuiDataGrid-cell': {
      borderWidth: 0,
    },
  },

  normal: {
    background: '#0000',
  },
  error: {
    background: fade(theme.palette.error.main, 0.1),
  },
}));

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
          params.getValue(params.id, 'alert') ? classes.error : classes.normal
        }
      />
    </div>
  );
}
