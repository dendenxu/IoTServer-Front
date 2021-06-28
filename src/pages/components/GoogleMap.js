/* eslint-disable no-return-await */
import React, { useState, useEffect } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import { fade, makeStyles, useTheme } from '@material-ui/core/styles';

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

export default function SimpleMap(props) {
  const [fromMills, setFromMills] = useState(1624843660000);
  const [toMills, setToMills] = useState(1624844080000);
  const [stateGeo, setGeo] = useState(null);
  const [stateMap, setMap] = useState(null);
  const [stateLoca, setLoca] = useState(null);
  const [detailed, setDetailed] = useState([]);

  const theme = useTheme();

  const fetchGeoFromServer = async () => {
    // Only load Loca and AMap on tab switch
    if (!window.Loca || !window.AMap) {
      await loadAMap();
    }
    // Extract the global variable
    const { Loca, AMap } = window;

    const geo = new Loca.GeoJSONSource({
      url: `/api/message/route?fromMills=${fromMills}&toMills=${toMills}`,
    });

    setGeo(geo);
  };

  // after first render effect
  useEffect(async () => {
    // Only load Loca and AMap on tab switch
    if (!window.Loca || !window.AMap) {
      await loadAMap();
    }
    // Extract the global variable
    const { Loca, AMap } = window;

    // ? what t f? does the variable name need to be exactly map???
    const map = new AMap.Map('map', {
      zoom: 11.2,
      center: [119.9, 30.1],
      // showLabel: false,
      viewMode: '3D',
      mapStyle: 'amap://styles/dark',
      pitch: 30,
    });

    console.log(map);

    const loca = new Loca.Container({
      map,
    });

    setMap(map);
    setLoca(loca);

    fetchGeoFromServer();
  }, []);

  useEffect(() => {
    // // currently getting the geo data from the backend directly

    // Extract the global variable
    const { Loca, AMap } = window;

    if (Loca && AMap && stateLoca && stateGeo && stateMap) {
      const layer = new Loca.PulseLineLayer({
        loca: stateLoca,
        zIndex: 100,
        opacity: 0.4,
        visible: true,
        zooms: [2, 22],
      });

      console.log('geo', stateGeo);
      layer.setSource(stateGeo, {
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
      stateLoca.add(layer);
      stateLoca.animate.start();

      // 图例
      const lengend = new Loca.Legend({
        loca: stateLoca,
        title: {
          label: '公交类型',
          fontColor: 'rgba(255,255,255,0.4)',
          fontSize: '16px',
        },
        style: {
          backgroundColor: 'rgba(255,255,255,0.1)',
          left: '20px',
          bottom: '40px',
          fontSize: '12px',
        },
        dataMap: [
          { label: 'A类型', color: deviceColors[7] },
          { label: 'B类型', color: deviceColors[6] },
          { label: 'C类型', color: deviceColors[5] },
          { label: 'D类型', color: deviceColors[4] },
          { label: 'E类型', color: deviceColors[3] },
          { label: 'F类型', color: deviceColors[2] },
          { label: 'G类型', color: deviceColors[1] },
          { label: 'H类型', color: deviceColors[0] },
        ],
      });
    }
  }, [stateGeo, stateLoca, stateMap]);

  return (
    <div
      style={{
        padding: theme.spacing(2),
        width: '100%',
        height: '100%',
      }}
    >
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
