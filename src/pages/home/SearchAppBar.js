import React from 'react';
import { fade, makeStyles, useTheme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { ReactComponent as Icon } from '../../assets/images/icon.svg';

import Copyright from '../components/Copyright';

const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: 0,
  },
  logo: {
    height: 30,
    width: 160,
    marginLeft: 0,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  sectionDesktop: {
    display: 'flex',
  },
  icon: {
    margin: theme.spacing(1.5),
  },
  item: {
    background: theme.palette.background.button,
    color: theme.palette.light.dark,
    justifyContent: 'left',
    alignItems: 'center',
    borderRadius: theme.spacing(2),
    width: '100%',
    padding: 0,
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
}));

export default function PrimarySearchAppBar(props) {
  const theme = useTheme();
  const classes = useStyles();
  const history = useHistory();
  const { email } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = event => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogout = event => {
    fetch('/api/account/logout');
    history.push('/signin');
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Typography
        style={{
          margin: theme.spacing(1, 2, 0),
        }}
      >
        Logged in as:
        <br />
        <strong>{email}</strong>
      </Typography>
      <div
        style={{
          padding: theme.spacing(1, 2, 1),
        }}
      >
        <Button
          varian="contained"
          className={classes.item}
          size="small"
          onClick={handleLogout}
        >
          <div className={`${classes.icon} ${classes.flex}`}>
            <ExitToAppIcon />
          </div>
          <div className={classes.flex}>
            <Typography component="p" className={classes.semibold}>
              Logout
            </Typography>
          </div>
        </Button>
      </div>
    </Menu>
  );

  return (
    <AppBar
      {...props}
      style={{
        background: theme.palette.background.widget,
      }}
    >
      <Toolbar className={classes.root}>
        <Icon className={classes.logo} />
        {/* <Copyright /> */}
        {props.children}
        <div className={classes.grow} />
        <div className={classes.sectionDesktop}>
          <IconButton
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
          >
            <AccountCircle />
          </IconButton>
        </div>
      </Toolbar>
      {renderMenu}
    </AppBar>
  );
}
