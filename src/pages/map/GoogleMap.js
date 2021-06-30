/* eslint-disable no-use-before-define */
/* eslint-disable no-return-await */
import React, { useState, useEffect } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import { fade, makeStyles, useTheme } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import RefreshIcon from '@material-ui/icons/Refresh';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import CircularProgress from '@material-ui/core/CircularProgress';
import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff';
import FlightLandIcon from '@material-ui/icons/FlightLand';
import Color from 'color';

import { ReactComponent as RobotIcon } from '../../assets/images/robot.svg';
import DatePickerButton from '../components/DatePickerButton';
import DateTimePicker from '../components/DateTimePicker';

import MessageBox from './MessageBox';

import deviceColors from '../components/DeviceColors';

const useStyles = makeStyles(theme => ({
  popover: {
    padding: theme.spacing(1),
    background: theme.palette.error.main,
    color: theme.palette.text.dark,
    fontWeight: 'bold',
  },

  header: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    flexDirection: 'row',
    // width: '100%',
    padding: theme.spacing(1, 2),
    position: 'absolute',
    top: theme.spacing(3),
    left: theme.spacing(3),
    zIndex: 2000,
    borderRadius: theme.spacing(4),
    // background: Color(theme.palette.background.widget).alpha(0.75),
    background: fade(theme.palette.background.widget, 0.75),
    // height: '6%',
  },

  map: {
    width: '100%',
    height: '100%',
    borderRadius: theme.spacing(4),
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

  flex: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'start',
    alignItems: 'center',
  },

  refreshButton: {
    marginRight: theme.spacing(1),
  },

  refreshIndicator: {
    height: '70%',
    marginLeft: theme.spacing(1),
  },
}));

// ! this function should be awaited
// it's async and it modifies windows.Loca and windows.AMap directly
const loadAMap = async () => {
  await AMapLoader.load({
    key: 'c0e09fc65ece185ee473aab8c33e1c6e', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ['Map3D'],
    Loca: {
      version: '2.0.0', // Loca 版本，缺省 1.3.2
    },
  });
};

const BubbleMarker = props => {
  const { message, ...other } = props;
  let { color } = props;
  if (message.alert) {
    // color = color;
  } else {
    color = fade(color, 0.8);
  }

  const large = {
    width: 36,
    height: 36,
    borderRadius: 18,
  };

  const main = {
    width: 24,
    height: 24,
    borderRadius: 12,
  };

  return (
    <div
      style={{
        ...(message.alert ? large : main),
        color,
        background: message.alert ? 'transparent' : fade(color, 0.1),
        boxShadow: `0 0px 5px 1px ${message.alert ? 'transparent' : color}`,
        padding: 0,
      }}
      {...other}
    >
      {message.alert ? (
        <div
          style={{
            widht: '100%',
            height: '100%',
          }}
        >
          <ErrorOutlineIcon
            style={{
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              filter: `drop-shadow( 0px 0px 3px ${color}  )`,
              position: 'absolute',
            }}
          />
        </div>
      ) : (
        <HelpOutlineIcon
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      )}
    </div>
  );
};

const LeftUpPopover = props => {
  const { anchorEl, handleClose, isOpen, ...other } = props;
  return (
    <Popover
      open={isOpen}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      {...other}
    >
      {props.children}
    </Popover>
  );
};

let loca = null;
let map = null;
let AMap = null;
let Loca = null;
let layer = null;

export default function SimpleMap(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [errorAnchorEl, setErrorAnchorEl] = useState(null);

  const [loadingData, setLoadingData] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);

  const [fromAnchorEl, setFromAnchorEl] = useState(null);
  const [toAnchorEl, setToAnchorEl] = useState(null);

  const [from, setFrom] = useState(new Date(1624944564339));
  const [to, setTo] = useState(new Date(1624989224752));

  const [deviceStore, setDeviceStore] = useState(null);
  const [geoStore, setGeoStore] = useState(null);

  const [showPath, setShowPath] = useState(true);

  const [displayMessage, setDisplayMessage] = useState('');
  const [displayDevice, setDisplayDevice] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const classes = useStyles();

  const theme = useTheme();

  useEffect(() => {
    // we'd like the user to click refresh manually since it might introduce too much load if not
    setNeedRefresh(true);
  }, [from, to]);

  useEffect(() => {
    const setJob = async () => {
      setLoadingData(true);

      try {
        await loadAMap();
      } catch (e) {
        setErrorMessage(e);
        setErrorAnchorEl(document.getElementById('root'));
      }

      AMap = window.AMap;
      Loca = window.Loca;

      // Extract the global variable
      // ? what t f? does the variable name need to be exactly map???

      map = new AMap.Map('map', {
        zoom: 11.2,
        center: [119.9, 30.1],
        // showLabel: false,
        viewMode: '3D',
        mapStyle: 'amap://styles/dark',
        pitch: 0,
      });

      console.log(map);

      loca = new Loca.Container({
        map,
      });
      console.log(loca);

      const fetchGeo = fetchGeoFromServer();
      const fetchDetail = fetchDetailFromServer();
      await Promise.all([fetchGeo, fetchDetail]);
      setLoadingData(false);
      setNeedRefresh(false);
    };

    setJob();

    return () => {
      // 虽然这样是可以了，但是你会发现，切换页面以后，再切换回来，3D图没有了，水波图也没有了！！
      // 这已经是一个很严重的bug了，但是官方问答貌似没有很明确的说明。
      // 原因是：loca实例只能创建一个，虽然这里创建loca实例时只是使用了局部变量，但是高德地图生成了全局的loca实例。当我们切换页面再切回来时，又去创建一个实例，这时就有两个了，然后就是看到的效果，图出不来。
      // 最终的解决方案是，当前页面离开时，销毁loca实例。销毁不是直接置为Null就可以，而是要调loca的destroy方法。
      console.log('Destorying the loca variable');
      loca.remove(layer);
      loca.destroy();
    };
  }, []);

  const updateGeo = geo => {
    // ! it looks like calling PulseLineLayer with loca will add it to loca
    layer = new Loca.PulseLineLayer({
      // loca,
      zIndex: 100,
      opacity: 0.7,
      visible: true,
      zooms: [2, 22],
    });

    console.log('geo', geo);

    console.log(loca.layers);

    layer.setSource(geo, {
      // altitude: (index, feature) => feature.properties.type * 100,
      altitude: 0,
      lineWidth: 4,
      color: (index, feature) => deviceColors(feature.properties.type),
      // 脉冲头颜色
      headColor: (index, feature) => deviceColors(feature.properties.type),
      // 脉冲尾颜色
      trailColor: 'rgba(128, 128, 128, 0.5)',
      // 脉冲长度，0.25 表示一段脉冲占整条路的 1/4
      interval: 1,
      // 脉冲线的速度，几秒钟跑完整段路
      duration: 30000,
    });

    console.log(
      `%cCurrent showPath: ${showPath}`,
      'background: #222; color: #bada55',
    );
    if (showPath) {
      loca.add(layer);
      loca.animate.start();
    }
  };

  const fetchGeoFromServer = async () => {
    // Only load Loca and AMap on tab switch
    const geo = new Loca.GeoJSONSource({
      url: `/api/message/route?fromMills=${from.getTime()}&toMills=${to.getTime()}`,
    });

    updateGeo(geo);
    setGeoStore(geo);
  };

  const updateMarkers = devices => {
    if (map && loca) {
      // console.log('PLACEHOLDER');
      devices.forEach(device => {
        device.messages.forEach(message => {
          // const marker = AMap;
          const marker = new AMap.Marker({
            position: new AMap.LngLat(message.lng, message.lat),
            // 将 html 传给 content
            content: renderToString(
              <BubbleMarker
                color={deviceColors(device.index)}
                message={message}
              />,
            ),
            anchor: 'center', // 设置锚点
            offset: new AMap.Pixel(0, 0), // 设置偏移量
            // 以 icon 的 [center bottom] 为原点
            // offset: new AMap.Pixel(-13, -30)
            clickable: true,
            bubble: true,
            // zIndex: 1301,
            altitude: 100 * device.index,
          });

          map.add(marker);
          marker.on('click', e => {
            console.log(`Clicked marker`);
            console.log(e);
            setDisplayMessage(message);
            setDisplayDevice(device);
            setAnchorEl(e.originEvent.target);
          });
        });
      });
    }
  };

  const fetchDetailFromServer = async () => {
    const res = await fetch(
      `/api/message/structured?fromMills=${from.getTime()}&toMills=${to.getTime()}`,
    );

    if (res.ok) {
      const devices = await res.json();
      // deviceStore = devices;
      setDeviceStore(devices);
      updateMarkers(devices);
    } else {
      const text = await res.text();
      setErrorMessage(text);
      setErrorAnchorEl(document.getElementById('root'));
    }
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  const handleErrorPopoverClose = () => {
    setErrorAnchorEl(null);
  };

  const handleRefresh = async () => {
    setLoadingData(true);
    map.clearMap();
    if (layer) {
      loca.remove(layer);
    }
    loca.viewControl.clearAnimates();

    const fetchGeo = fetchGeoFromServer();
    const fetchDetail = fetchDetailFromServer();
    await Promise.all([fetchGeo, fetchDetail]);
    setLoadingData(false);
    setNeedRefresh(false);
  };

  const handleChangeShowPath = async () => {
    const curShowPath = !showPath;
    setShowPath(curShowPath);
    if (curShowPath) {
      loca.add(layer);
      loca.animate.start();
    } else {
      if (layer) {
        loca.remove(layer);
      }
      loca.viewControl.clearAnimates();
    }
  };

  return (
    <div className={classes.root}>
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
          <IconButton
            aria-label="search"
            onClick={handleChangeShowPath}
            size="small"
            className={classes.refreshButton}
          >
            {/* <RefreshIcon
              style={{
                color: showPath
                  ? theme.palette.primary.main
                  : theme.palette.warning.main,
              }}
            /> */}
            {showPath ? (
              <FlightLandIcon
                style={{
                  color: theme.palette.error.main,
                }}
              />
            ) : (
              <FlightTakeoffIcon
                style={{
                  color: theme.palette.warning.main,
                }}
              />
            )}
          </IconButton>
          {loadingData && (
            <CircularProgress className={classes.refreshIndicator} size={24} />
          )}
        </Typography>
      </div>

      <LeftUpPopover
        isOpen={Boolean(anchorEl && displayMessage)}
        anchorEl={anchorEl}
        handleClose={handlePopoverClose}
      >
        <MessageBox message={displayMessage} device={displayDevice} />
      </LeftUpPopover>

      <LeftUpPopover
        isOpen={Boolean(errorAnchorEl && errorMessage)}
        anchorEl={errorAnchorEl}
        handleClose={handleErrorPopoverClose}
      >
        <Typography className={classes.popover}>{errorMessage}</Typography>
      </LeftUpPopover>

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

      <div id="map" className={classes.map} />
      <div className={classes.tooltip}>
        <div className={classes.flex}>
          <HelpOutlineIcon
            fontSize="small"
            style={{
              color: theme.palette.primary.main,
              filter: `drop-shadow( 0px 0px 3px ${theme.palette.primary.main} )`,
            }}
          />
          <Typography
            variant="body1"
            style={{
              marginLeft: theme.spacing(1),
              color: theme.palette.primary.main,
              fontWeight: 'bold',
            }}
          >
            {' '}
            Regular Messages{' '}
          </Typography>
        </div>
        <div className={classes.flex}>
          <ErrorOutlineIcon
            fontSize="small"
            style={{
              color: theme.palette.error.main,
              filter: `drop-shadow( 0px 0px 3px ${theme.palette.error.main} )`,
            }}
          />
          <Typography
            variant="body1"
            style={{
              marginLeft: theme.spacing(1),
              color: theme.palette.error.main,
              fontWeight: 'bold',
            }}
          >
            {' '}
            Alert Messages{' '}
          </Typography>
        </div>
        <div
          style={{
            height: theme.spacing(1),
          }}
        />

        {deviceStore &&
          deviceStore.map(device => (
            <div className={classes.flex} key={device.mqttId}>
              <HelpOutlineIcon
                fontSize="small"
                style={{
                  color: deviceColors(device.index),
                  filter: `drop-shadow( 0px 0px 3px ${deviceColors(
                    device.index,
                  )} )`,
                }}
              />
              <Typography
                variant="body1"
                style={{
                  marginLeft: theme.spacing(1),
                  color: deviceColors(device.index),
                  fontWeight: 'bold',
                }}
              >
                {device.mqttId}
              </Typography>
            </div>
          ))}
      </div>
    </div>
  );
}
