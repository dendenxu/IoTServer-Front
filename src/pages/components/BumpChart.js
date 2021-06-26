// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/bump
import { ResponsiveAreaBump } from '@nivo/bump';
import React, { useState, useEffect } from 'react';
import { fade, makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

import tempBump from '../../assets/temp/tempBump';
import chartTheme from '../../theme/chartTheme';

const useStyles = makeStyles(theme => ({
  table: {
    height: '90%',
    width: '100%',
  },

  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: theme.palette.background.widget,
    margin: theme.spacing(3),
    padding: theme.spacing(2, 0, 0),
    borderRadius: '32px',
    minWidth: 320,
    width: '50%',
  },
}));

const MyResponsiveAreaBump = ({ data /* see data tab */, theme }) => (
  <ResponsiveAreaBump
    theme={theme}
    data={data}
    margin={{ top: 82, right: 160, bottom: 32, left: 120 }}
    align="end"
    colors={{ scheme: 'set3' }}
    blendMode="normal"
    fillOpacity={0.75}
    activeFillOpacity={0.85}
    // spacing={4}
    xPadding={0.6}
    borderWidth={3}
    activeBorderWidth={6}
    borderColor={{ from: 'color', modifiers: [['darker', '1.8']] }}
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
    <div {...props} className={classes.root}>
      <Typography
        variant="h5"
        color="primary"
        style={{
          fontWeight: 'bold',
          // fontFamily: 'Teko',
        }}
      >
        Device BumpChart
      </Typography>
      <div className={classes.table}>
        <MyResponsiveAreaBump data={data} theme={chartTheme} />
      </div>
    </div>
  );
}
