import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Divider } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  drawer: {
    display: 'flex',
    zIndex: 1200,
    backgroundColor: theme.palette.background.paper,
  },
  drawerPaper: {
    // width: global.drawerWidth,
  },
  drawerContainer: {
    overflow: 'scroll',
  },
  icon: {
    margin: theme.spacing(1.5),
  },
  item: {
    // background: theme.palette.background.button,
    color: theme.palette.light.dark,
    justifyContent: 'left',
    alignItems: 'center',
    // borderRadius: theme.spacing(2),
    // height: "100%",
    // height: 56,
    height: 56,
    maxWidth: '20%',
    padding: theme.spacing(0, 1, 0),
    margin: 0,
  },
  flex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  semibold: {
    fontFamily: 'Teko',
    fontWeight: 500,
    fontSize: '1.2rem',
    lineHeight: 1.75,
  },
  divide: {
    background: theme.palette.background.button,
  },
}));

const ListButton = props => {
  const { text, ...other } = props;
  const classes = useStyles();

  return (
    <Button varian="contained" className={classes.item} {...other}>
      <Typography
        component="p"
        className={classes.semibold}
        key={`${text}-text`}
      >
        {text}
      </Typography>
    </Button>
  );
};

const VDivider = props => {
  const theme = useTheme();

  return (
    <Divider
      {...props}
      orientation="vertical"
      style={{
        color: theme.palette.background.button,
        height: 42,
      }}
    />
  );
};

export default function SectionDrawer(props) {
  const { style, className, selecled, setSelected, ...other } = props;

  return (
    <>
      <VDivider key="starting-divider" />
      {['Device Manager', 'Device Map', 'Message Manager'].map(
        (text, index) => [
          <ListButton
            text={text}
            key={text}
            onClick={() => {
              setSelected(index);
            }}
          />,
          <VDivider key={`${text}-divider`} />,
        ],
      )}
    </>
  );
}
