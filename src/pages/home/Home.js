import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory, useLocation } from 'react-router-dom';
import withWidth, { isWidthUp, isWidthDown } from '@material-ui/core/withWidth';
import CircularProgress from '@material-ui/core/CircularProgress';
import Toolbar from '@material-ui/core/Toolbar';
import BottomBar from '../components/BottomBar';
import Copyright from '../components/Copyright';
import AvatarBar from '../components/AvatarBar';
import IoTextField from '../components/IoTextField';
import IoTButton from '../components/IoTButton';
import SearchAppBar from '../components/SearchAppBar';
import SectionDrawer from '../components/SectionDrawer';
import DeviceTable from '../components/DeviceTable';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  growWidth: {
    display: 'flex',
    flexGrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
  },
}));

function Home(props) {
  const { width } = props;

  const theme = useTheme();
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  return (
    <div className={classes.growWidth}>
      <CssBaseline />
      <SearchAppBar position="fixed" className={classes.appBar} />
      <SectionDrawer className={classes.drawer} />
      <div
        style={{
          width: '100%',
        }}
      >
        <Toolbar />
        <div className={classes.content}>
          {/* <Typography variant="h1">Hello, world.</Typography> */}
          <DeviceTable />
        </div>
      </div>
    </div>
  );
}

export default Home;
