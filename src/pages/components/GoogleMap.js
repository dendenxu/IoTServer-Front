/* eslint-disable no-use-before-define */
/* eslint-disable no-return-await */
import React, { useState, useEffect } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import { fade, makeStyles, useTheme } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import { renderToString } from 'react-dom/server';

const useStyles = makeStyles(theme => ({
  popover: {
    padding: theme.spacing(1),
    background: theme.palette.error.main,
    color: theme.palette.text.dark,
    fontWeight: 'bold',
  },
  bubble: {
    // width: theme.spacing(4),
    // height: theme.spacing(4),
    width: '100%',
    height: '100%',
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

const deviceColors = [
  '#EFBB51',
  '#7F3CFF',
  '#4CC19B',
  '#0B5D74',
  '#E06AC4',
  '#223F9B',
  '#F15C1A',
  '#7A0FA6',
];

const BubbleMarker = props => {
  const { color, ...other } = props;
  const classes = useStyles();

  return (
    <div className={classes.bubble} {...other}>
      <IconButton
        size="small"
        style={{
          color,
        }}
      >
        <InfoIcon fontSize="small" />
      </IconButton>
    </div>
  );
};

let loca = null;
let map = null;
let AMap = null;
let Loca = null;

export default function SimpleMap(props) {
  const [fromMills, setFromMills] = useState(1624843660000);
  const [toMills, setToMills] = useState(1624844080000);
  const [detail, setDetail] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const classes = useStyles();

  const theme = useTheme();

  useEffect(async () => {
    if (!window.Loca && !window.AMap) {
      await loadAMap();
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
      pitch: 30,
    });

    console.log(map);

    loca = new Loca.Container({
      map,
    });

    fetchGeoFromServer();
    fetchDetailFromServer();
  }, []);

  // if (loading) {
  //   return <div id="map" />;
  // }

  const updateGeo = geo => {
    const layer = new Loca.PulseLineLayer({
      loca,
      zIndex: 100,
      opacity: 0.4,
      visible: true,
      zooms: [2, 22],
    });

    console.log('geo', geo);
    layer.setSource(geo, {
      // altitude: (index, feature) => feature.properties.type * 100,
      altitude: 0,
      lineWidth: 4,
      color: (index, feature) => deviceColors[feature.properties.type],
      // 脉冲头颜色
      headColor: (index, feature) => deviceColors[feature.properties.type],
      // 脉冲尾颜色
      trailColor: 'rgba(128, 128, 128, 0.5)',
      // 脉冲长度，0.25 表示一段脉冲占整条路的 1/4
      interval: 1,
      // 脉冲线的速度，几秒钟跑完整段路
      duration: 30000,
    });
    loca.add(layer);
    loca.animate.start();

    // // 图例
    // const lengend = new Loca.Legend({
    //   loca,
    //   title: {
    //     label: '公交类型',
    //     fontColor: 'rgba(255,255,255,0.4)',
    //     fontSize: '16px',
    //   },
    //   style: {
    //     backgroundColor: 'rgba(255,255,255,0.1)',
    //     left: '20px',
    //     bottom: '40px',
    //     fontSize: '12px',
    //   },
    //   dataMap: [
    //     { label: 'A类型', color: deviceColors[7] },
    //     { label: 'B类型', color: deviceColors[6] },
    //     { label: 'C类型', color: deviceColors[5] },
    //     { label: 'D类型', color: deviceColors[4] },
    //     { label: 'E类型', color: deviceColors[3] },
    //     { label: 'F类型', color: deviceColors[2] },
    //     { label: 'G类型', color: deviceColors[1] },
    //     { label: 'H类型', color: deviceColors[0] },
    //   ],
    // });
  };

  const fetchGeoFromServer = async () => {
    // Only load Loca and AMap on tab switch
    const geo = new Loca.GeoJSONSource({
      url: `/api/message/route?fromMills=${fromMills}&toMills=${toMills}`,
    });

    updateGeo(geo);
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
              <BubbleMarker color={fade(deviceColors[device.index], 0.7)} />,
            ),
            anchor: 'center', // 设置锚点
            offset: new AMap.Pixel(0, 0), // 设置偏移量
            // 以 icon 的 [center bottom] 为原点
            // offset: new AMap.Pixel(-13, -30)
            clickable: true,
            bubble: true,
          });

          map.add(marker);
          marker.on('click', e => {
            console.log(`Clicked marker`);
            console.log(e);
            setAnchorEl(e.originEvent.target);
          });
        });
      });
    }
  };

  const fetchDetailFromServer = async () => {
    const res = await fetch(
      `/api/message/structured?fromMills=${fromMills}&toMills=${toMills}`,
    );

    if (res.ok) {
      const devices = await res.json();
      updateMarkers(devices);
    }
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <div
      style={{
        padding: theme.spacing(2),
        width: '100%',
        height: '100%',
      }}
    >
      <Popover
        open={Boolean(anchorEl)}
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
        <Typography className={classes.popover}>Hello, world.</Typography>
      </Popover>

      <div
        id="map"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: theme.spacing(4),
        }}
      />
    </div>
  );
}
