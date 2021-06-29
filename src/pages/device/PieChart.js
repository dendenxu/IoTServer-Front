// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/funnel
import { ResponsivePie } from '@nivo/pie';
import React, { useState, useEffect } from 'react';
import { fade, makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import CircularProgress from '@material-ui/core/CircularProgress';

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

  header: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',
    width: '100%',
    paddingLeft: theme.spacing(3),
  },

  headerTitle: {
    fontWeight: 'bold',
    display: 'flex',
  },

  refreshButton: {
    marginRight: theme.spacing(1),
  },

  refreshIndicator: {
    height: '70%',
    marginLeft: theme.spacing(1),
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
    arcLinkLabelsStraightLength={10}
    arcLinkLabelsTextOffset={2}
    arcLinkLabelsThickness={2}
    arcLinkLabelsTextColor={{ from: 'color', modifiers: [['brighter', '0']] }}
    colors={{ scheme: 'set3' }}
    borderWidth={5}
    borderColor={{ from: 'color', modifiers: [['darker', '1.2']] }}
    arcLinkLabelsColor={{ from: 'color', modifiers: [] }}
    arcLabelsSkipAngle={12}
    arcLabelsTextColor={{ from: 'color', modifiers: [['darker', '2.4']] }}
  />
);

export default function PieChart(props) {
  const theme = useTheme();
  const classes = useStyles();
  const [data, setData] = useState(tempPie);
  const [loadingData, setLoadingData] = useState(false);

  const fetchDataFromServer = async () => {
    setLoadingData(true);

    const res = await fetch('/api/message/count?aggregate=true');

    if (res.ok) {
      const body = await res.json();
      setData(body);
    }
    setLoadingData(false);
  };

  useEffect(() => {
    const it = setTimeout(() => {
      fetchDataFromServer();
    }, 4000);

    return () => {
      clearTimeout(it);
    };
  }, [data]);

  useEffect(() => {
    console.log('First update...');
    fetchDataFromServer();
  }, []);

  const handleRefresh = () => {
    fetchDataFromServer();
  };

  return (
    <div {...props} className={classes.root}>
      <div className={classes.header}>
        <Typography
          variant="h5"
          color="primary"
          className={classes.headerTitle}
        >
          Device Activity
        </Typography>

        <IconButton
          aria-label="search"
          onClick={handleRefresh}
          size="small"
          className={classes.refreshButton}
          style={{
            color: theme.palette.primary.main,
          }}
        >
          <RefreshIcon />
        </IconButton>
        {loadingData && (
          <CircularProgress className={classes.refreshIndicator} size={24} />
        )}
      </div>
      <div className={classes.table}>
        <MyResponsivePie data={data} theme={chartTheme} />
      </div>
    </div>
  );
}
