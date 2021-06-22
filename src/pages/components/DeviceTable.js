/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import InputBase from '@material-ui/core/InputBase';
import Typography from '@material-ui/core/Typography';
import { DataGrid, GridToolbar } from '@material-ui/data-grid';
import { fade, makeStyles, useTheme } from '@material-ui/core/styles';
import IoTButton from './IoTButton';

const useStyles = makeStyles(theme => {
  const noOutline = {
    outline: 'none',
    background: fade(theme.palette.primary.main, 0.1),
  };

  return {
    table: {
      fontSize: '1rem',
      fontWeight: '500',
      borderRadius: '32px',
      margin: theme.spacing(3),
      padding: theme.spacing(2, 3, 4),
      background: theme.palette.background.widget,
      '& .MuiDataGrid-root': {
        border: 'none',
        borderRadius: '16px',
      },
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
      '& .MuiDataGrid-cell:focus-within': noOutline,
      '& .MuiDataGrid-columnHeader:focus-within': noOutline,
      '& .MuiDataGrid-editCellInputBase': {
        fontSize: '1.0rem',
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
  };
});

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

const TableButton = props => {
  const {
    disabled,
    style: { background, ...otherStyle },
    ...other
  } = props;

  return (
    <IoTButton
      disabled={disabled}
      style={{
        ...otherStyle,
        background: disabled ? fade(background, 0.5) : background,
      }}
      fullWidth
      typographyProps={{
        style: {
          fontSize: '0.8rem',
          fontWeight: 'bold',
        },
      }}
      {...other}
    >
      {props.children}
    </IoTButton>
  );
};

const handleSave = row => {
  row.modified = false;
  return row;
};

const checkSave = row => row.modified;

const renderSave = params => {
  const theme = useTheme();
  const disabled = !checkSave(params.row);

  return (
    <TableButton
      disabled={disabled}
      style={{
        background: theme.palette.primary.main,
      }}
      onClick={() => {
        const newValue = params.row;
        console.log('Clicking new value:');
        console.log(newValue);
        handleSave(newValue);
      }}
    >
      Save
    </TableButton>
  );
};

const handleCreate = row => {
  row.new = false;
  return row;
};

const checkCreate = row => row.id && row.name && row.type && row.desc;

const handleRowAction = row => {
  if (row.new && checkCreate(row)) {
    handleCreate(row);
  } else if (row.modified && checkSave(row)) {
    handleSave(row);
  }
};

const renderCreate = params => {
  const theme = useTheme();
  const disabled = !checkCreate(params.row);

  return (
    <TableButton
      style={{
        background: theme.palette.warning.main,
      }}
      disabled={disabled}
      onClick={() => {
        const newValue = params.row;
        console.log('Clicking new value:');
        console.log(newValue);
        handleCreate(params.row);
      }}
    >
      Create
    </TableButton>
  );
};

const columns = [
  {
    disableColumnMenu: true,
    align: 'center',
    headerAlign: 'center',
    field: 'action',
    headerName: 'Action',
    // flex: 0.058,
    width: 80,
    editable: false,
    sortable: false,
    filterable: false,
    renderCell: params => {
      if (params.row.new) {
        return renderCreate(params);
      } else {
        return renderSave(params);
      }
    },
  },
  {
    hide: true,
    field: 'id',
    headerName: 'Index',
    flex: 0.06,
    sortable: false,
    editable: false,
    filterable: false,
    // resizable: true,

    // type: 'number',
    // valueGetter: params => `${params.getValue(params.id, 'mqttId') || ''}`,
    renderCell: renderBold,
  },
  {
    field: 'mqttId',
    headerName: 'MqttId',
    flex: 0.08,

    editable: true,

    // type: 'number',
    // valueGetter: params => `${params.getValue(params.id, 'mqttId') || ''}`,
    renderCell: renderBold,
  },
  {
    field: 'name',
    headerName: 'Name',
    flex: 0.083,

    editable: true,
    // resizable: true,
    renderCell: renderBold,
  },
  {
    field: 'desc',
    headerName: 'Description',
    // type: 'number',
    // width: 160,
    flex: 0.12,

    editable: true,
    // resizable: true,
  },
  {
    field: 'type',
    headerName: 'Device Type',
    // description: 'This column has a value getter and is not sortable.',
    // sortable: false,
    flex: 0.1,

    editable: true,
    // resizable: true,
  },
  {
    field: 'createdDate',
    headerName: 'Created At',
    flex: 0.115,

    editable: false,
    type: 'dateTime',
  },

  {
    field: 'value',
    headerName: 'Value',
    flex: 0.087,

    editable: false,
    // resizable: true,
  },
  {
    field: 'status',
    headerName: 'Status',
    flex: 0.087,

    editable: false,
    sortable: true,
    valueGetter: params =>
      params.row.alert === undefined
        ? ''
        : params.row.alert
        ? 'ALERT'
        : 'NORMAL',
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
    flex: 0.12,

    editable: false,
    type: 'dateTime',
  },
  {
    field: 'new',
    headerName: 'New',
    flex: 0.08,
  },
  {
    field: 'modified',
    headerName: 'Modified',
    flex: 0.08,
  },
];

const rows = [
  {
    id: 0,
    mqttId: 'device-#0',
    name: 'First Device',
    desc: 'This is a strange device',
    type: ['Bot'],
    createdDate: new Date(),
    statusUpdateDate: new Date(),
    value: 250,
    alert: 0,
    new: false,
    modified: true,
  },
  {
    id: 1,
    mqttId: 'device-#1',
    name: 'Jon',
    desc: 'This is a strange device',
    type: ['Bot'],
    createdDate: new Date(),
    statusUpdateDate: new Date(),
    value: 250,
    alert: 0,
    new: false,
    modified: true,
  },
  {
    id: 2,
    mqttId: 'device-#2',
    name: 'Cersei',
    desc: 'This is a strange device',
    type: ['Bot', 'Car'],
    createdDate: new Date(),
    statusUpdateDate: new Date(),
    value: 100,
    alert: 1,
    new: false,
    modified: true,
  },
  {
    id: 3,
    mqttId: 'device-#3',
    name: 'Jaime',
    desc: 'This is a strange device',
    type: ['Drone'],
    createdDate: new Date(),
    statusUpdateDate: new Date(),
    value: 100,
    alert: 1,
    new: false,
    modified: true,
  },
  {
    id: 4,
    mqttId: 'device-#4',
    name: 'Arya',
    desc: 'This is a strange device',
    type: ['Bot', 'Car'],
    createdDate: new Date(),
    statusUpdateDate: new Date(),
    value: 100,
    alert: 0,
    new: false,
    modified: false,
  },
  {
    id: 5,
    mqttId: 'device-#5',
    name: 'Daenerys',
    desc: 'This is a strange device',
    type: ['Bot', 'Car'],
    createdDate: new Date(),
    statusUpdateDate: new Date(),
    alert: 0,
    new: false,
    modified: false,
  },
  {
    id: 6,
    mqttId: 'device-#6',
    name: "I've got no name",
    desc: 'This is a strange device',
    type: ['Car'],
    createdDate: new Date(),
    statusUpdateDate: new Date(),
    value: 50,
    new: false,
    modified: false,
  },
  {
    id: 7,
    mqttId: 'device-#7',
    name: 'Ferrara',
    desc: 'This is a strange device',
    type: ['Bot', 'Car'],
    createdDate: new Date(),
    statusUpdateDate: new Date(),
    value: 100,
    alert: 1,
    new: false,
    modified: true,
  },
  {
    id: 8,
    mqttId: 'device-#8',
    name: 'Rossini',
    desc: 'This is a strange device',
    type: ['Bot', 'Car'],
    createdDate: new Date(),
    statusUpdateDate: new Date(),
    value: 50,
    alert: 1,
    new: false,
    modified: true,
  },
  {
    id: 9,
    mqttId: 'device-#9',
    name: 'Harvey',
    desc: 'This is a strange device',
    type: ['Bot', 'Car'],
    new: true,
    modified: false,
  },
];

export default function DeviceDataGrid() {
  const theme = useTheme();
  const classes = useStyles();
  const [data, setData] = useState(rows);
  const [selection, setSelection] = useState([]);
  return (
    <div className={classes.table}>
      <DataGrid
        rows={data}
        columns={columns}
        // pageSize={6}
        // disableExtendRowFullWidth
        checkboxSelection
        disableSelectionOnClick
        autoHeight
        autoPageSize
        // hideFooterPagination
        getRowClassName={params => {
          if (params.row.new) {
            return classes.new;
          } else if (params.row.modified) {
            return classes.modified;
          } else if (params.row.alert) {
            return classes.error;
          } else {
            return classes.normal;
          }
        }}
        onEditCellChangeCommitted={params => {
          console.log('This edit has been committed');
          console.log(params);
          console.log('Is the const: rows, changed?');
          console.log(rows === params.rows);
        }}
        selectionModel={selection}
        onSelectionModelChange={newSelection => {
          console.log('Getting new selection');
          console.log(newSelection);
          setSelection(newSelection.selectionModel);
        }}
        components={{
          Toolbar: GridToolbar,
        }}
      />
      <IoTButton
        style={{
          marginLeft: 16,
        }}
        onClick={() => {
          const newId = data.length;
          setData([
            ...data,
            {
              id: newId,
              mqttId: `device-#${newId}`,
              new: true,
              modified: false,
            },
          ]);
        }}
      >
        Add Device
      </IoTButton>
      {selection.length !== 0 && (
        <>
          <IoTButton
            style={{
              marginLeft: 16,
              backgroundColor: theme.palette.warning.main,
            }}
            onClick={() => {
              // ! bad approach?
              selection.forEach(i => {
                const row = data[i];
                handleRowAction(row);
              });
              setSelection([]);
            }}
          >
            Perform Action
          </IoTButton>
          <IoTButton
            style={{
              marginLeft: 16,
              backgroundColor: theme.palette.error.main,
            }}
            onClick={() => {
              console.log('Trying to delete: ');
              console.log(selection);
              const newData = [];

              const pushData = (prev, next) => {
                for (let j = prev; j < next; j++) {
                  const newItem = data[j];
                  newItem.id = newData.length;
                  newData.push(data[j]);
                }
              };

              let prev = 0;
              let next = 0;
              for (let i = 0; i < selection.length; i++) {
                next = selection[i]; // selection model starts at 1
                pushData(prev, next);
                prev = next + 1;
              }
              next = data.length;
              console.log(`Current prev: ${prev}`);
              console.log(`Current newData: `);
              console.log(newData);
              pushData(prev, next);

              setData(newData);
              setSelection([]);

              console.log('Getting newData');
              console.log(newData);

              // what if?
            }}
          >
            Delete Selected
          </IoTButton>
        </>
      )}
    </div>
  );
}
