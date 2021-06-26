// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/bump
import { ResponsiveAreaBump } from '@nivo/bump';
import React, { useState, useEffect } from 'react';
import { fade, makeStyles, useTheme } from '@material-ui/core/styles';

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

import tempBump from '../../assets/temp/tempBump';
import chartTheme from '../../theme/chartTheme';

const useStyles = makeStyles(theme => ({
  table: {
    borderRadius: '32px',
    margin: theme.spacing(3),
    // padding: theme.spacing(0, 0),
    background: theme.palette.background.widget,
    minHeight: 200,
    maxHeight: 512,
    minWidth: 320,
    // width: 640,
    maxWidth: 1024,
  },
}));

const MyResponsiveAreaBump = ({ data /* see data tab */, theme }) => (
  <ResponsiveAreaBump
    // style={{
    //   // padding: -16,
    //   height: '120%',
    // }}
    theme={theme}
    data={data}
    margin={{ top: 92, right: 160, bottom: 32, left: 100 }}
    align="end"
    colors={{ scheme: 'set3' }}
    fillOpacity={0.6}
    activeFillOpacity={0.85}
    spacing={8}
    xPadding={0.6}
    // defs={[
    //   {
    //     id: 'dots',
    //     type: 'patternDots',
    //     background: 'inherit',
    //     color: '#38bcb2',
    //     size: 4,
    //     padding: 1,
    //     stagger: true,
    //   },
    //   {
    //     id: 'lines',
    //     type: 'patternLines',
    //     background: 'inherit',
    //     color: '#eed312',
    //     rotation: -45,
    //     lineWidth: 6,
    //     spacing: 10,
    //   },
    // ]}
    // fill={[
    //   {
    //     match: {
    //       id: 'CoffeeScript',
    //     },
    //     id: 'dots',
    //   },
    //   {
    //     match: {
    //       id: 'TypeScript',
    //     },
    //     id: 'lines',
    //   },
    // ]}
    borderWidth={3}
    activeBorderWidth={6}
    borderColor={{ from: 'color', modifiers: [['darker', '2.2']] }}
    startLabel="id"
    startLabelTextColor={{ from: 'color', modifiers: [['brighter', '1.0']] }}
    endLabelTextColor={{ from: 'color', modifiers: [['brighter', '1.0']] }}
    axisTop={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: -20,
      legend: '',
      legendPosition: 'middle',
      legendOffset: -36,
    }}
    // axisTop={null}
    // axisBottom={{
    //   tickSize: 5,
    //   tickPadding: 5,
    //   tickRotation: -20,
    //   legend: '',
    //   legendPosition: 'middle',
    //   legendOffset: 32,
    // }}
    axisBottom={null}
  />
);

export default function BumpChart(props) {
  const classes = useStyles();
  const [data, setData] = useState(tempBump);

  const fetchDataFromServer = async (fromMills, toMills, tick) => {
    const res = await fetch(
      `/api/message/detailcount?fromMills=${fromMills}&toMills=${toMills}&tick=${tick}`,
    );

    if (res.ok) {
      const body = await res.json();
      setData(body);
    }
  };

  useEffect(() => {
    fetchDataFromServer(1624666885920, 1624673885920, 10);
  }, []);

  return (
    <div {...props} className={classes.table}>
      <MyResponsiveAreaBump data={data} theme={chartTheme} />
    </div>
  );
}
