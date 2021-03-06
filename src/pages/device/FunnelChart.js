// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/funnel
import { ResponsiveFunnel } from '@nivo/funnel';
import React, { useState, useEffect } from 'react';
import { fade, makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

import tempFunnel from '../../assets/temp/tempFunnel';
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
    margin: theme.spacing(3, 1.5, 1.5, 1.5),
    padding: theme.spacing(2, 0, 0),
    borderRadius: '32px',
    // minWidth: 320,
    width: '16%',
  },
}));

const MyResponsiveFunnel = ({ data /* see data tab */, theme }) => (
  <ResponsiveFunnel
    theme={theme}
    data={data}
    direction="horizontal"
    margin={{ top: 20, right: 40, bottom: 20, left: 40 }}
    valueFormat=">-.0s"
    colors={{ scheme: 'spectral' }}
    borderWidth={20}
    labelColor={{ from: 'color', modifiers: [['darker', 3]] }}
    beforeSeparatorLength={20}
    beforeSeparatorOffset={20}
    afterSeparatorLength={20}
    afterSeparatorOffset={20}
    currentPartSizeExtension={10}
    currentBorderWidth={40}
    motionConfig="wobbly"
  />
);

const extractFunnelData = data => {
  const deviceCount = data.length;
  const onlineCount = data.filter(d => d.online).length;
  const alertCount = data.filter(d => d.alert).length;
  return [
    {
      id: 'Total Count',
      label: 'Total Count',
      value: deviceCount,
    },
    {
      id: 'Online Count',
      label: 'Online Count',
      value: onlineCount,
    },
    {
      id: 'Alert Count',
      label: 'Alert Count',
      value: alertCount,
    },
  ];
};

export default function FunnelChart(props) {
  const classes = useStyles();

  let { data, setData } = props;

  const [innerData, innerSetData] = useState(tempFunnel);

  if (!data) {
    [data, setData] = [innerData, innerSetData];
  }

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
        Online/Alert
      </Typography>
      <div className={classes.table}>
        <MyResponsiveFunnel data={extractFunnelData(data)} theme={chartTheme} />
      </div>
    </div>
  );
}
