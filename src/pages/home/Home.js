import React, { useState, useEffect } from 'react';
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
import { fade, makeStyles, useTheme } from '@material-ui/core/styles';
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
import PieChart from '../device/PieChart';
import BumpChart from '../device/BumpChart';
import FunnelChart from '../device/FunnelChart';
import SearchAppBar from './SearchAppBar';
import SectionDrawer from './SectionDrawer';
import DeviceTable from '../device/DeviceTable';
import MessageTable from '../message/MessageTable';
import GoogleMap from '../map/GoogleMap';

const useStyles = makeStyles(theme => ({
  growWidth: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    flexShrink: 1,
  },
  content: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1),
    overflow: 'auto',
    height: '100vh',
    border: 'none',
  },
}));

const IndexedWrapper = props => {
  const { index, selected, ...other } = props;
  return <>{index === selected && props.children}</>;
};

function Home(props) {
  const { width } = props;

  const theme = useTheme();
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const [countDown, setCountDown] = useState(5);
  const [email, setEmail] = useState(location.state && location.state.email);
  const [loadingData, setLoadingData] = useState(true);
  const [selected, setSelected] = useState(0);

  const [deviceData, setDeviceData] = useState(
    JSON.parse(localStorage.getItem('device_table_data')) || [],
  );

  const handleRefresh = e => {
    // e.preventDefault();
    setLoadingData(true);
  };

  useEffect(() => {
    window.addEventListener('beforeunload', handleRefresh);
    return () => {
      window.removeEventListener('beforeunload', handleRefresh);
    };
  }, []);

  useEffect(async () => {
    if (!email) {
      const response = await fetch('/api/account/auth');
      if (response.ok) {
        const body = await response.json();
        setEmail(body.email); // update email
      }
      setLoadingData(false);
    } else {
      setLoadingData(false);
    }
  }, []); // no dependency

  useEffect(async () => {
    let timer = null;
    if (!email) {
      timer = setTimeout(() => {
        console.log(`Counting down from ${countDown}`);
        if (!countDown) {
          history.push('/signin');
          return;
        }
        setCountDown(countDown - 1);
      }, 1000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [countDown, email]); // depends on countDown and email

  if (!loadingData && !email) {
    return (
      <div>
        <CssBaseline />
        <Typography variant="h2">Access Denied, login first</Typography>
        <Typography variant="h4">
          You will be redirected to{' '}
          <span
            style={{
              fontFamily: ['Cascadia Code', 'monospace'],
            }}
          >
            /signin
          </span>{' '}
          in {countDown} seconds...
        </Typography>
      </div>
    );
  }
  return (
    <div
      className={classes.growWidth}
      style={{ filter: loadingData ? 'blur(5px)' : 'blur(0)' }}
    >
      <CssBaseline />
      <SearchAppBar position="fixed" className={classes.appBar} email={email}>
        <SectionDrawer selected={selected} setSelected={setSelected} />
      </SearchAppBar>
      <div
        style={{
          display: 'flex',
        }}
      >
        <div className={classes.content}>
          <Toolbar />

          <IndexedWrapper index={0} selected={selected}>
            <div
              style={{
                display: 'flex',
                width: '100%',
                minHeight: 400,
              }}
            >
              <BumpChart />
              <FunnelChart data={deviceData} />
              <PieChart />
            </div>

            <DeviceTable
              email={email}
              data={deviceData}
              setData={setDeviceData}
            />
          </IndexedWrapper>
          <IndexedWrapper index={1} selected={selected}>
            <GoogleMap />
          </IndexedWrapper>
          <IndexedWrapper index={2} selected={selected}>
            <MessageTable />
          </IndexedWrapper>
        </div>
      </div>
    </div>
  );
}

export default Home;
