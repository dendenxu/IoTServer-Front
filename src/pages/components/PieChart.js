// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/funnel
import { ResponsivePie } from '@nivo/pie';
import React, { useState, useEffect } from 'react';
import { fade, makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

import tempPie from '../../assets/temp/tempPie';
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
    margin: theme.spacing(3, 3, 1.5, 1.5),
    padding: theme.spacing(2, 0, 0),
    borderRadius: '32px',
    minWidth: 320,
    width: '24%',
  },
}));

const MyResponsivePie = ({ data /* see data tab */, theme }) => (
  <ResponsivePie
    theme={theme}
    data={data}
    margin={{ top: 40, right: 90, bottom: 40, left: 90 }}
    startAngle={-180}
    endAngle={360}
    sortByValue
    innerRadius={0.6}
    padAngle={5}
    cornerRadius={16}
    activeOuterRadiusOffset={8}
    arcLinkLabelsDiagonalLength={10}
    arcLinkLabelsStraightLength={16}
    arcLinkLabelsTextOffset={2}
    arcLinkLabelsThickness={2}
    arcLinkLabelsTextColor={{ from: 'color', modifiers: [['brighter', '0']] }}
    colors={{ scheme: 'set3' }}
    borderWidth={5}
    borderColor={{ from: 'color', modifiers: [['darker', '1.2']] }}
    // arcLinkLabelsTextColor="#333333"
    arcLinkLabelsColor={{ from: 'color', modifiers: [] }}
    arcLabelsSkipAngle={12}
    arcLabelsTextColor={{ from: 'color', modifiers: [['darker', '2.4']] }}
    // legends={[
    //   {
    //     anchor: 'bottom-right',
    //     direction: 'column',
    //     justify: false,
    //     translateX: 0,
    //     translateY: 0,
    //     itemWidth: 40,
    //     itemHeight: 20,
    //     itemsSpacing: 0,
    //     symbolSize: 14,
    //     itemDirection: 'left-to-right',
    //   },
    // ]}
  />
);

export default function FunnelChart(props) {
  const classes = useStyles();
  const [data, setData] = useState(tempPie);

  const fetchDataFromServer = async (fromMills, toMills, tick) => {
    // const res = await fetch(
    //   `/api/message/detailcount?fromMills=${fromMills}&toMills=${toMills}&tick=${tick}`,
    // );
    // if (res.ok) {
    //   const body = await res.json();
    //   setData(body);
    // }
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
        Device PieChart
      </Typography>
      <div className={classes.table}>
        <MyResponsivePie data={data} theme={chartTheme} />
      </div>
    </div>
  );
}
