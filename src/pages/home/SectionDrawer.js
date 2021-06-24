import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles(theme => ({
  drawer: {
    // position: 'absolute',
    top: 0,
    // bottom: 0,
    left: 0,
    // flexGrow: 1,
    // flexDirection: 'column',
    height: '100vh',
    width: global.drawerWidth,
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
    background: theme.palette.background.button,
    color: theme.palette.light.dark,
    justifyContent: 'left',
    alignItems: 'center',
    margin: theme.spacing(0, 0),
    borderRadius: theme.spacing(2),
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
    <ListItem key={text}>
      <Button
        varian="contained"
        className={classes.item}
        fullWidth
        size="small"
        {...other}
      >
        <div className={`${classes.icon} ${classes.flex}`}>
          {props.children}
        </div>
        <div className={classes.flex}>
          <Typography component="p" className={classes.semibold}>
            {text}
          </Typography>
        </div>
      </Button>
    </ListItem>
  );
};

export default function SectionDrawer(props) {
  const classes = useStyles();
  const theme = useTheme();

  const { style, className, ...other } = props;

  return (
    <div
      variant="permanent"
      className={`${classes.drawer} ${className}`}
      style={{
        ...style,
      }}
      classes={{
        paper: classes.drawerPaper,
      }}
      {...other}
    >
      <Toolbar />
      <div className={classes.drawerContainer}>
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListButton text={text} key={text}>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListButton>
          ))}
        </List>
        <Divider className={classes.divide} />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListButton text={text} key={text}>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListButton>
          ))}
        </List>
      </div>
    </div>
  );
}
