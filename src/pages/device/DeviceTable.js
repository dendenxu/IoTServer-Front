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
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import EditIcon from '@material-ui/icons/Edit';
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
      margin: theme.spacing(1.5, 3, 3, 3),
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
    success: {
      background: `${fade(theme.palette.success.main, 0.1)} !important`,
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
  const { email, data, setData } = props;
  const theme = useTheme();
  const classes = useStyles();

  const [selection, setSelection] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    localStorage.setItem('device_table_data', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    fetchDataFromServer();
  }, []);

  const processPayload = (payload, i) => {
    payload.id = i;
    // mqttId
    // name
    // desc
    payload.type = payload.type.sort();
    payload.createdDate = new Date(payload.createdDate);
    payload.lastModifiedDate = new Date(payload.lastModifiedDate);
    payload.statusUpdateDate = payload.date ? new Date(payload.date) : null;
    // payload.value;
    // payload.alert;
    payload.new = false;
    payload.modified = false;
    // version

    // ! unused field
    // delete payload.recycled;
    // delete payload.user;
    // delete payload.lastModifiedDate;
  };

  useEffect(() => {
    if (!edit) {
      const it = setTimeout(() => {
        // for (let i = 0; i < data.length; i++) {
        //   updateDeviceFromServer(i);
        // }
        fetchDataFromServer();
      }, 1000);

      return () => {
        clearTimeout(it);
      };
    } else {
      return () => {};
    }
  }, [data, edit]);

  // Quitely and passively fetch data from the server
  const fetchDataFromServer = async () => {
    // Fetch full data from the server, including latest status
    const res = await fetch('/api/device/status');
    if (res.ok) {
      const body = await res.json();
      console.log('Getting data from server');
      console.log(body);
      for (let i = 0; i < body.length; i++) {
        processPayload(body[i], i);
      }
      setData(body);
    }
  };

  const updateDeviceFromServer = async id => {
    // fetch only the deta indicated by mqttId, ! not the parameter but data[id].id
    const res = await fetch(`/api/device/status?mqttId=${data[id].mqttId}`);
    if (res.ok) {
      const payload = await res.json();
      console.log('Getting data from server');
      console.log(payload);
      processPayload(payload, id);
      console.log('Processed payload');
      console.log(payload);
      setData([
        ...data.slice(0, id),
        // { ...data[id], ...payload }, // should not override
        payload,
        ...data.slice(id + 1, data.length),
      ]);
      // columns.forEach(column => {
      //   console.log('Updating column: ');
      //   console.log(column.field);
      //   data[id][column.field] = payload[column.field];
      // });
    }
  };

  // column type definition: options + renderEditCell + renderCell
  const options = ['Car', 'Bot', 'Drone', 'Monitor'];

  const renderTags = value => {
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
          newValue = newValue.sort();
          const editProps = {
            value: newValue,
          };

          event.key
            ? api.setEditCellProps(
                {
                  id,
                  field,
                  props: editProps,
                },
                event,
              )
            : (api.commitCellChange({
                id,
                field,
                props: editProps,
              }),
              api.setCellMode(id, field, 'view'));

          data[id][field] = newValue;

          api.commitCellChange({ id, field: 'modified', props: editProps });
          data[id].modified = true;
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

  const handleSave = async row => {
    const modifyDevice = async device => {
      console.log('Payload:');
      console.log(device);

      const res = await fetch(`/api/device/replace`, {
        method: 'PATCH',
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
        return true;
      } else {
        console.error('Cannot modify the device');
        console.error(`Response: `);
        console.error(body);
        setErrorMessage(body);
        return false;
      }
    };

    try {
      const result = await modifyDevice({
        mqttId: row.mqttId,
        name: row.name,
        desc: row.desc,
        type: row.type,
        version: row.version,
      });
      return result;
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const checkSave = row => row.modified;

  const renderSave = params => {
    const disabled = !checkSave(params.row);
    const { api, id, field, value } = params;

    return (
      <TableButton
        disabled={disabled}
        style={{
          background: theme.palette.primary.main,
        }}
        onClick={async event => {
          const result = await handleSave(params.row);
          if (!result) {
            setAnchorEl(event.target);
          } else {
            updateDeviceFromServer(id);
            const editProps = {
              value: false,
            };
            // creation successful, update the table by:
            api.commitCellChange({
              id,
              field: 'modified',
              props: editProps,
            });
            data[id].modified = false;
          }
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

      const res = await fetch(`/api/device/create`, {
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
        email,
      });
      return result;
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const checkCreate = row =>
    row.mqttId && row.name && row.type && row.type.length !== 0 && row.desc;

  const handlePopoverClose = () => {
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
          const { api, id, field, value } = params;
          const result = await handleCreate(params.row);
          if (!result) {
            setAnchorEl(event.target);
          } else {
            updateDeviceFromServer(id);
            const editProps = {
              value: false,
            };
            // creation successful, update the table by:
            api.commitCellChange({
              id,
              field: 'new',
              props: editProps,
            });
            data[id].new = false;
          }
        }}
      >
        Create
      </TableButton>
    );
  };

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

  const renderOnline = params => (
    <Typography
      style={{
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: params.row.online
          ? theme.palette.success.main
          : theme.palette.error.main,
      }}
    >
      {params.value}
    </Typography>
  );

  const columns = [
    {
      disableColumnMenu: true,
      hide: !edit,
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
      editable: edit,
      renderCell: renderBold,
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 0.083,
      editable: edit,
      renderCell: renderBold,
    },
    {
      field: 'desc',
      headerName: 'Description',
      flex: 0.12,
      editable: edit,
    },
    {
      field: 'type',
      headerName: 'Device Type',
      flex: 0.13,
      editable: edit,
      // type: 'array',
      // valueFormatter: params => params.row.type.join(', '),
      renderCell: params => renderTags(params.row.type),
      renderEditCell: renderTagsEdit,
    },
    {
      field: 'createdDate',
      headerName: 'Created At',
      flex: 0.115,
      hide: true,
      editable: false,
      type: 'dateTime',
    },
    {
      field: 'lastModifiedDate',
      headerName: 'Last Modified',
      flex: 0.115,
      editable: false,
      type: 'dateTime',
    },

    {
      field: 'value',
      headerName: 'Value',
      type: 'number',

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
      renderCell: renderStatus,
    },
    {
      field: 'online',
      headerName: 'Online',
      flex: 0.087,
      editable: false,
      sortable: true,
      valueGetter: params =>
        params.row.online === undefined
          ? ''
          : params.row.online
          ? 'ONLINE'
          : 'OFFLINE',
      renderCell: renderOnline,
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
    {
      field: 'version',
      hide: true,
      headerName: 'Version',
      flex: 0.08,
    },
  ];

  const handleDeviceAction = async row => {
    if (row.new && checkCreate(row)) {
      return await handleCreate(row);
    } else if (row.modified && checkSave(row)) {
      return await handleSave(row);
    } else {
      return true;
    }
  };

  const handleAddRow = () => {
    const newId = data.length;
    setData([
      ...data,
      {
        id: newId,
        mqttId: `device${newId.toString().padStart(4, '0')}`,
        name: 'Device Name',
        desc: 'Description',
        type: ['Bot'],
        new: true,
        modified: false,
      },
    ]);
  };

  const handleDeleteDevice = async row => {
    const deleteDevice = async device => {
      console.log('Payload:');
      console.log(device);

      const res = await fetch(`/api/device/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(device),
      });

      const body = await res.text();

      if (res.ok) {
        console.log('Device deleted');
        console.log(`Response: `);
        console.log(body);
        return true;
      } else {
        console.error('Cannot delete the device');
        console.error(`Response: `);
        console.error(body);
        setErrorMessage(body);
        return false;
      }
    };

    try {
      const result = await deleteDevice({
        mqttId: row.mqttId,
        version: row.version,
      });
      return result;
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const handleSelectionAction = async (handle, event) => {
    // ! row action will change the data in the background
    let results = [];
    selection.forEach(i => {
      const row = data[i];
      results.push(
        handle(row)
          .then(() => {})
          .catch(() => {
            console.log('Errors');
          }),
      );
    });
    results = (await Promise.all(results)).map(item => item | 0);
    if (!results.every(item => item)) {
      setAnchorEl(event.target);
    }

    // the status array of all current data
    const status = Array(data.length).fill(-1);

    // update status according to networking results
    for (let i = 0; i < selection.length; i++) {
      status[selection[i]] = results[i];
    }

    // 0 would be not ok results
    const retained = [...Array(status.length).keys()].filter(
      item => !status[item],
    );

    return [status, retained];
  };

  const [loading, setLoading] = useState(false);

  const CustomLoadingOverlay = () => <Loading loadingData />;

  const handleRefresh = async e => {
    setLoading(true);
    await fetchDataFromServer();
    setLoading(false);
  };

  const handleEdit = e => {
    setEdit(!edit);
  };

  const CustomToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
      <Button color="primary" size="small" onClick={handleRefresh}>
        <RefreshIcon fontSize="small" />
        Refresh
      </Button>
      <Button color="primary" size="small" onClick={handleEdit}>
        {edit ? (
          <HighlightOffIcon fontSize="small" />
        ) : (
          <EditIcon fontSize="small" />
        )}
        {edit ? 'Quit Editting' : 'Start Editting'}
      </Button>
    </GridToolbarContainer>
  );

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
        // pageSize={5}
        checkboxSelection
        disableSelectionOnClick
        autoHeight
        autoPageSize
        loading={loading}
        // hideFooterPagination
        getRowClassName={params => {
          if (params.row.new) {
            return classes.new;
          } else if (params.row.modified) {
            return classes.modified;
          } else if (params.row.alert) {
            return classes.error;
            // } else if (params.row.online) {
            //   return classes.success;
          } else {
            return classes.normal;
          }
        }}
        onEditCellChangeCommitted={params => {
          console.log(params);
          const {
            id,
            field,
            props: { value },
          } = params;
          data[id][field] = value;
          if (field === 'mqttId') {
            data[id].new = true;
          } else {
            data[id].modified = true;
          }
        }}
        selectionModel={selection}
        onSelectionModelChange={newSelection => {
          console.log('Getting new selection');
          console.log(newSelection);
          setSelection(newSelection.selectionModel);
        }}
        components={{
          Toolbar: CustomToolbar,
          LoadingOverlay: CustomLoadingOverlay,
        }}
      />
      {edit && (
        <IoTButton
          style={{
            marginLeft: 16,
            background: theme.palette.primary.main,
          }}
          onClick={handleAddRow}
        >
          Add Device
        </IoTButton>
      )}
      {selection.length !== 0 && (
        <>
          {edit && (
            <IoTButton
              style={{
                marginLeft: 16,
                // background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.warning.main} 70%)`,
                background: theme.palette.warning.main,
              }}
              onClick={async event => {
                console.log('Trying to perform action: ');
                console.log(selection);

                const [status, retained] = await handleSelectionAction(
                  handleDeviceAction,
                  event,
                );

                fetchDataFromServer();
                setSelection(retained);
              }}
            >
              Perform Action
            </IoTButton>
          )}
          <IoTButton
            style={{
              marginLeft: 16,
              background: theme.palette.error.main,
            }}
            onClick={async event => {
              console.log('Trying to delete: ');
              console.log(selection);

              // networking results, true for ok, false for not
              const [status, retained] = await handleSelectionAction(
                handleDeleteDevice,
                event,
              );
              // 1 would be successful deletion
              const newData = data.filter(item => status[item.id] !== 1);
              for (let i = 0; i < newData.length; i++) {
                newData[i].id = i;
              }

              console.log(newData);
              setData(newData);
              setSelection(retained);
            }}
          >
            Delete Selected
          </IoTButton>
        </>
      )}
    </div>
  );
}
