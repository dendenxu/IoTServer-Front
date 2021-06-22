/* eslint-disable no-shadow */
/* eslint-disable arrow-body-style */
/* eslint-disable no-return-await */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import InputBase from '@material-ui/core/InputBase';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import Checkbox from '@material-ui/core/Checkbox';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { DataGrid, GridToolbar } from '@material-ui/data-grid';
import { fade, makeStyles, useTheme } from '@material-ui/core/styles';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import Chip from '@material-ui/core/Chip';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import IoTButton from '../components/IoTButton';
import tempData from '../../assets/temp/tempData';

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

export default function DeviceDataGrid(props) {
  const { email } = props;
  const theme = useTheme();
  const classes = useStyles();
  const [data, setData] = useState(tempData);
  const [selection, setSelection] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [editRowsModel, setEditRowsModel] = useState({});

  const handleEditRowModelChange = React.useCallback(params => {
    setEditRowsModel(params.model);
  }, []);

  const options = ['Car', 'Bot', 'Drone', 'Monitor'];

  const renderTags = value => {
    // console.log('Rendering tags: ');
    // console.log(value);
    if (!value) {
      value = [];
    }
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          fontWeight: 'bold',
        }}
      >
        {value.map((option, index) => (
          <Chip
            variant="outlined"
            key={option}
            style={{
              // borderColor: theme.palette.primary.main,
              // borderWidth: 1,
              background: fade(theme.palette.background.widget, 0.2),
              color: theme.palette.text.secondary,
              marginRight: theme.spacing(1),
            }}
            label={option}
          />
        ))}
      </div>
    );
  };

  const renderTagsEdit = params => {
    const { id, field, value, api, row } = params;
    console.log(params);
    return (
      <Autocomplete
        className={classes.input}
        multiple
        options={options}
        value={value || []}
        autoSelect
        disableClearable
        onKeyDown={event => {
          console.log('Key down');
          if (event.key === 'Backspace') {
            console.log('Stopped');
            event.stopPropagation();
          }
        }}
        onChange={(event, newValue) => {
          console.log('Commiting changes');
          const editProps = {
            value: newValue,
          };

          console.log(newValue);
          // data[id][field] = newValue;
          // row[field] = newValue;
          api.setCellValue({ id, field, value: newValue });
          // api.commitCellChange({ id, field, props: editProps });
          api.setCellMode(id, field, 'view');
          // api.setCellMode(id, field, 'edit');
        }}
        renderTags={(value, getTagProps) => renderTags(value)}
        renderInput={params => (
          <TextField
            {...params}
            autoFocus
            InputProps={{ ...params.InputProps, disableUnderline: true }}
            variant="filled"
            placeholder="Favorites"
          />
        )}
      />
    );
  };

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

  const handleSave = async row => {
    row.modified = false;
    return row;
  };

  const checkSave = row => row.modified;

  const renderSave = params => {
    const disabled = !checkSave(params.row);

    return (
      <TableButton
        disabled={disabled}
        style={{
          background: theme.palette.primary.main,
        }}
        onClick={() => {
          handleSave(params.row);
        }}
      >
        Save
      </TableButton>
    );
  };

  const handleCreate = async row => {
    const createDevice = async device => {
      console.log('Payload:');
      console.log(device);

      const res = await fetch(`/api/device/create?email=${email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(device),
      });

      const body = await res.text();

      if (res.ok) {
        console.log('Device created');
        console.log(`Response: `);
        console.log(body);
        row.new = false;
        return true;
      } else {
        console.error('Cannot create the device');
        console.error(`Response: `);
        console.error(body);
        setErrorMessage(body);
        return false;
      }
    };

    try {
      const result = await createDevice({
        mqttId: row.mqttId,
        name: row.name,
        desc: row.desc,
        type: row.type,
      });
      return result;
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const checkCreate = row =>
    row.mqttId && row.name && row.type && row.type.length !== 0 && row.desc;

  const handleRowAction = async row => {
    if (row.new && checkCreate(row)) {
      return await handleCreate(row);
    } else if (row.modified && checkSave(row)) {
      return await handleSave(row);
    } else {
      return true;
    }
  };

  const handlePopverClose = () => {
    setAnchorEl(null);
  };

  const renderCreate = params => {
    const disabled = !checkCreate(params.row);

    return (
      <TableButton
        style={{
          background: theme.palette.warning.main,
        }}
        disabled={disabled}
        onClick={async event => {
          // async update with server
          const result = await handleCreate(params.row);
          if (!result) {
            setAnchorEl(event.target);
          }
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
      field: 'name',
      headerName: 'Name',
      flex: 0.083,
      editable: true,
      renderCell: renderBold,
    },
    {
      field: 'desc',
      headerName: 'Description',
      flex: 0.12,
      editable: true,
    },
    {
      field: 'type',
      headerName: 'Device Type',
      flex: 0.13,
      editable: true,
      // type: 'array',
      // valueFormatter: params => params.row.type.join(', '),
      renderCell: params => renderTags(params.row.type),
      renderEditCell: renderTagsEdit,
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
      renderCell: params => (
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
      ),
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
      hide: true,
      headerName: 'New',
      flex: 0.08,
    },
    {
      field: 'modified',
      hide: true,
      headerName: 'Modified',
      flex: 0.08,
    },
  ];

  return (
    <div className={classes.table}>
      <Popover
        open={Boolean(anchorEl && errorMessage)}
        anchorEl={anchorEl}
        onClose={handlePopverClose}
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
        onEditCellChange={params => {
          console.log('This edit happens');
          console.log(params);
          console.log('Is the const: rows, changed?');
          console.log(tempData === data);
        }}
        onEditCellChangeCommitted={params => {
          console.log('This edit has been committed');
          console.log(params);
          console.log('Is the const: rows, changed?');
          console.log(tempData === data);
          const { id, field, props } = params;

          data[id][field] = props.value;

          console.log(data);
          // setData(state => [...state, ...data]);
          setData(data);
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
        // editRowsModel={editRowsModel}
        // onEditRowModelChange={handleEditRowModelChange}
      />
      <IoTButton
        style={{
          marginLeft: 16,
          background: theme.palette.primary.main,
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
              // background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.warning.main} 70%)`,
              background: theme.palette.warning.main,
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
              background: theme.palette.error.main,
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
