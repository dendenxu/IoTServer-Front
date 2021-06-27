/* eslint-disable no-return-await */
import React, { useState, useEffect } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';

const loadAMap = async () => {
  await AMapLoader.load({
    key: 'c0e09fc65ece185ee473aab8c33e1c6e', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ['Map3D'],
    Loca: {
      // 是否加载 Loca， 缺省不加载
      version: '2.0.0', // Loca 版本，缺省 1.3.2
    },
  });
};

// import { AMapLoader, AMapUILoader, LocaLoader } from 'amap-js';

// const mapLoader = new AMapLoader({
//   key: 'c0e09fc65ece185ee473aab8c33e1c6e', // 申请好的Web端开发者Key，首次调用 load 时必填
//   version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
//   plugins: [],
// });

// const locaLoader = new LocaLoader({
//   key: 'c0e09fc65ece185ee473aab8c33e1c6e', // 申请好的Web端开发者Key，首次调用 load 时必填
//   version: '2.0.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
// });

export default function SimpleMap() {
  useEffect(async () => {
    await loadAMap();

    // await mapLoader.load();
    // await locaLoader.load();
    // const AMap = await mapLoader.load();
    // const Loca = await locaLoader.load();
    const { Loca, AMap } = window;
    const map = new AMap.Map('map', {
      zoom: 11.2,
      center: [116.352734, 39.8447],
      // showLabel: false,
      viewMode: '3D',
      mapStyle: 'amap://styles/dark',
      pitch: 50,
    });

    // map.AmbientLight = new AMap.Lights.AmbientLight([1, 1, 1], 0.4);

    // map.AmbientLight

    console.log('AmbientLight: ', map.AmbientLight);

    const loca = new Loca.Container({
      map,
    });

    loca.ambLight = {
      intensity: 2.2,
      color: '#babedc',
    };
    loca.dirLight = {
      intensity: 0.46,
      color: '#d4d4d4',
      target: [0, 0, 0],
      position: [0, -1, 1],
    };
    loca.pointLight = {
      color: 'rgb(15,19,40)',
      position: [121.5043258, 31.2392241, 2600],
      intensity: 25,
      // 距离表示从光源到光照强度为 0 的位置，0 就是光不会消失。
      distance: 3900,
    };

    console.log(map);
    console.log(AMap);

    const geo = new Loca.GeoJSONSource({
      url: 'https://a.amap.com/Loca/static/loca-v2/demos/mock_data/bj_bus.json',
    });

    const layer = new Loca.PulseLineLayer({
      // loca,
      zIndex: 10,
      opacity: 1,
      visible: true,
      zooms: [2, 22],
    });

    const headColors = [
      '#EFBB51',
      '#7F3CFF',
      '#4CC19B',
      '#0B5D74',
      '#E06AC4',
      '#223F9B',
      '#F15C1A',
      '#7A0FA6',
    ];

    console.log('geo', geo);
    layer.setSource(geo);
    layer.setStyle({
      altitude: 0,
      lineWidth: 2,
      // 脉冲头颜色
      headColor: (_, feature) => headColors[feature.properties.type - 1],
      // 脉冲尾颜色
      trailColor: 'rgba(128, 128, 128, 0.5)',
      // 脉冲长度，0.25 表示一段脉冲占整条路的 1/4
      interval: 0.25,
      // 脉冲线的速度，几秒钟跑完整段路
      duration: 5000,
    });
    loca.add(layer);
    loca.animate.start();

    // 图例
    const lengend = new Loca.Legend({
      loca,
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
        { label: 'A类型', color: headColors[7] },
        { label: 'B类型', color: headColors[6] },
        { label: 'C类型', color: headColors[5] },
        { label: 'D类型', color: headColors[4] },
        { label: 'E类型', color: headColors[3] },
        { label: 'F类型', color: headColors[2] },
        { label: 'G类型', color: headColors[1] },
        { label: 'H类型', color: headColors[0] },
      ],
    });

    loca.animate.start();
    const dat = new Loca.Dat();
    dat.addLayer(layer, '公交');
    dat.addLight(loca.ambLight, loca, '环境光');
    dat.addLight(loca.dirLight, loca, '平行光');
    dat.addLight(loca.pointLight, loca, '点光');
  }, []);

  return (
    <div
      id="map"
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  );
}
