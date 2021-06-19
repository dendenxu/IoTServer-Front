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

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    width: drawerWidth,
    background: theme.palette.background.widget,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  icon: {
    color: theme.palette.secondary.main,
  },
  item: {
    background: theme.palette.background.button,
    justifyContent: 'left',
    alignItems: 'center',
    borderRadius: '10px',
  },
  flex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  semibold: {
    fontWeight: 500,
  },
  divide: {
    background: theme.palette.background.button,
  },
}));

export default function ClippedDrawer(props) {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Drawer
      {...props}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Toolbar />
      <div className={classes.drawerContainer}>
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem key={text}>
              <Button
                varian="contained"
                className={classes.item}
                fullWidth
                size="small"
              >
                <div className={classes.flex}>
                  <IconButton className={classes.icon}>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </IconButton>
                  <div className={classes.flex}>
                    <Typography variant="h6" className={classes.semibold}>
                      {text}
                    </Typography>
                  </div>
                </div>
              </Button>
            </ListItem>
          ))}
        </List>
        <Divider className={classes.divide} />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text} className={classes.item}>
              <ListItemIcon className={classes.icon}>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  );
}
