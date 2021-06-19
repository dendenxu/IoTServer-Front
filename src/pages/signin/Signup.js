import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory } from 'react-router-dom';
import withWidth, { isWidthUp, isWidthDown } from '@material-ui/core/withWidth';
import { ReactComponent as Icon } from '../../assets/images/icon.svg';
import BottomBar from '../components/BottomBar';
import Copyright from '../components/Copyright';
import IoTextField from '../components/IoTextField';
import IoTButton from '../components/IoTButton';
import ToggleBox from '../components/ToggleBox';

const useStyles = makeStyles(theme => {
  const gridPadding = theme.spacing(0.5, 2.5);
  const smallGridPadding = theme.spacing(0.5, 1.5);
  const threeFraction = '30%';
  const twoFraction = '45%';
  const containerStyle = {
    margin: theme.spacing(0),
    padding: gridPadding,
    [theme.breakpoints.down('xs')]: {
      padding: smallGridPadding,
    },
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  };
  return {
    layoutContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      maxWidth: '600px',
    },

    signUpContainer: {
      marginTop: -theme.spacing(4),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },

    welcome: {
      color: theme.palette.secondary.main,
    },

    borderedContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      border: 5,
      borderRadius: 30,
      backgroundColor: theme.palette.background.widget,
      padding: theme.spacing(3),
      width: '100%',
      marginTop: theme.spacing(1),
    },

    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },

    logoContainer: {
      marginTop: theme.spacing(1),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'left',
    },

    logo: {
      width: '50%',
      height: '50%',
      marginBottom: theme.spacing(2),
    },

    accountInfoContainer: { marginTop: theme.spacing(2), ...containerStyle },

    lastNameInputBox: {
      padding: theme.spacing(0),
      margin: theme.spacing(0),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      width: threeFraction,
      height: '100%',
    },

    firstNameInputBox: {
      padding: theme.spacing(0),
      margin: theme.spacing(0),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      width: threeFraction,
      height: '100%',
    },

    usetTypeInputBox: {
      padding: theme.spacing(0),
      margin: theme.spacing(0),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      width: threeFraction,
      height: '100%',
    },

    usetTypeButton: {
      padding: theme.spacing(0),
      margin: theme.spacing(0),
      marginRight: theme.spacing(-1),
      color: theme.palette.text.secondary,
    },

    emailInputContainer: containerStyle,

    emailInputBox: {
      padding: theme.spacing(0),
      margin: theme.spacing(0),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',

      // height: '100%',
    },
    passwordContainer: containerStyle,

    passwordInputBox: {
      padding: theme.spacing(0),
      margin: theme.spacing(0),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      width: twoFraction,
      height: '100%',
    },

    passwordConfirmInputBox: {
      padding: theme.spacing(0),
      margin: theme.spacing(0),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      width: twoFraction,
      height: '100%',
    },

    jumpContainer: {
      margin: theme.spacing(0, 0, 2),
      padding: gridPadding,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },

    jumpToSignIn: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      transform: 'translate(0px,1.5px)',
    },

    nextButton: {
      borderRadius: '10px',
      border: 0,
      color: 'white',
      padding: '30 30px',
    },

    copyright: {
      marginTop: theme.spacing(3),
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      width: '90%',
    },
    copyrightText: {},

    buttomBar: {
      marginTop: theme.spacing(1),
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      width: '90%',
    },

    checkboxContainer: {
      margin: theme.spacing(0),
      marginTop: theme.spacing(-1),
      marginBottom: theme.spacing(2),
      padding: gridPadding,
      paddingTop: theme.spacing(0),
      paddingBottom: theme.spacing(0),
      width: '100%',
    },

    centeredFlex: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  };
});

function Signup(props) {
  const { width } = props;
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const usetTypeDisplay = ['USER', 'ADMIN', 'DBA', 'GUEST'];
  const usetTypeStorage = ['USER', 'ADMIN', 'DBA', 'GUEST'];

  const [showPassword, setShowPassword] = useState(false);
  const [inputContent, setInputContent] = useState('');
  const [validFormEmail, setValidFormEmail] = useState('');
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [emailAlreadyTaken, setEmailAlreadyTaken] = useState(false);
  const [emailFormInvalid, setEmailFormInvalid] = useState(false);
  const [lastNameInvalid, setLastNameInvalid] = useState(false);
  const [firstNameInvalid, setFirstNameInvalid] = useState(false);
  const [usetTypeInvalid, setusetTypeInvalid] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [usetType, setusetType] = useState(-1);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  // note that this is a full-width space
  // material ui seems to ignore the half-width one
  // const defaultHelperTextPlaceHolder = isWidthDown('xs', width) || '　';
  const defaultHelperTextPlaceHolder = '　';

  let lastNameHelperText = defaultHelperTextPlaceHolder;
  let firstNameHelperText = defaultHelperTextPlaceHolder;
  let usetTypeHelperText = defaultHelperTextPlaceHolder;
  let emailBoxHelperText = defaultHelperTextPlaceHolder; // some white spaces to take up the width
  let passwordHelperText = defaultHelperTextPlaceHolder;
  let passwordConfirmHelperText = defaultHelperTextPlaceHolder;

  if (passwordInvalid) {
    passwordHelperText = 'Password should contain at least 8 characters';
  }
  if (password !== passwordConfirm) {
    passwordConfirmHelperText = "Your password doesn't match";
  }
  if (emailFormInvalid) {
    // check the form first
    emailBoxHelperText = 'Your Email is invalid';
  } else if (emailAlreadyTaken) {
    emailBoxHelperText = 'This Email is already registered';
  }

  if (lastNameInvalid) {
    lastNameHelperText = 'Input last name';
  }
  if (firstNameInvalid) {
    firstNameHelperText = 'Input first name';
  }
  if (usetTypeInvalid) {
    usetTypeHelperText = 'Select an user type';
  }

  const handleNextClick = async () => {
    let allchecked = true;
    const checkEmailWithServer = async () => {
      const response = await fetch(`/api/account/checkemail`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: validFormEmail,
        }),
      });
      console.log(response);

      if (response.ok) {
        console.log(`The server says your email is OK:`);
        allchecked = false;
        setEmailAlreadyTaken(true);
      } else {
        console.log(`Your email doesn't exist, check again my boy`);
        console.log("But I know you're registering, so that's OK.");
        setEmailAlreadyTaken(false);
      }
    };

    const registerUser = async () => {
      const response = await fetch('/api/account/create', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: validFormEmail,
          firstName,
          lastName,
          password,
          role: [usetTypeStorage[usetType]],
        }),
      });

      console.log(response);

      if (response.ok) {
        console.log('Successfully registered the user');
        history.push('/signin?registered');
      }
    };

    try {
      if (!validFormEmail) {
        console.log('Wrong email format, refusing to login');
        allchecked = false;
        setEmailFormInvalid(true);
      } else {
        await checkEmailWithServer();
      }

      if (!firstName) {
        setFirstNameInvalid(true);
        allchecked = false;
      }
      if (!lastName) {
        setLastNameInvalid(true);
        allchecked = false;
      }
      if (!(usetType in [...usetTypeDisplay.keys()])) {
        setusetTypeInvalid(true);
        allchecked = false;
      }
      if (password.length < 8) {
        setPasswordInvalid(true);
        allchecked = false;
      }
      if (allchecked) {
        console.log('All checked out.');
        console.log(
          `Valid form email: ${validFormEmail}, input content: ${inputContent}`,
        );

        registerUser();
      } else {
        console.log('Something is wrong.');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const open = Boolean(anchorEl);
  const handleusetTypeClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = idx => event => {
    setAnchorEl(null);
    setusetType(idx);
    setusetTypeInvalid(false);
  };
  const handleFirstNameInput = event => {
    const text = event.target.value;
    setFirstName(text);
    setFirstNameInvalid(false);
  };

  const handleLastNameInput = event => {
    const text = event.target.value;
    setLastName(text);
    setLastNameInvalid(false);
  };

  const handleEmailInput = event => {
    const text = event.target.value;
    setInputContent(text);
    setEmailAlreadyTaken(false);

    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const invalid = !re.test(text) && text.length !== 0;
    setEmailFormInvalid(invalid);
    console.log(`Getting new email text: ${text}`);
    console.log(`Setting email form invalid: ${invalid}`);
    setValidFormEmail(invalid || text);
  };

  const handlePasswordInput = event => {
    const text = event.target.value;
    setPassword(text);
    setPasswordInvalid(false);
  };
  const handlePasswordConfirm = event => {
    const text = event.target.value;
    setPasswordConfirm(text);
    setPasswordInvalid(false);
  };

  const handleLogin = event => {
    history.push('/signin');
  };

  const handleCheckBoxChange = event => {
    const selected = event.target.checked;
    setShowPassword(selected);
    console.log(`selected show password: ${selected}`);
  };

  return (
    <Container component="main" className={classes.layoutContainer}>
      <CssBaseline />

      <Container className={classes.signUpContainer}>
        <Box className={classes.borderedContainer}>
          <Container className={classes.logoContainer}>
            <Icon className={classes.logo} />

            <Typography component="h1" variant="h5" className={classes.welcome}>
              {isWidthDown('xs', width) ? 'Register on' : 'Register Your'}{' '}
              <span
                style={{
                  fontFamily: 'Harlow Solid Italic',
                }}
              >
                IoT Server
              </span>{' '}
              {isWidthDown('xs', width) || 'Account'}
            </Typography>
          </Container>

          <Container className={classes.accountInfoContainer}>
            <Container className={classes.lastNameInputBox}>
              <IoTextField
                error={lastNameInvalid}
                variant="outlined"
                id="user_last_name"
                label={isWidthDown('xs', width) ? 'Last' : 'Last Name'}
                helperText={lastNameHelperText}
                name="user_last_name"
                autoFocus
                value={lastName}
                onChange={handleLastNameInput}
              />
            </Container>

            <Container className={classes.firstNameInputBox}>
              <IoTextField
                error={firstNameInvalid}
                variant="outlined"
                id="user_first_name"
                label={isWidthDown('xs', width) ? 'First' : 'First Name'}
                helperText={firstNameHelperText}
                name="user_first_name"
                autoFocus
                value={firstName}
                onChange={handleFirstNameInput}
              />
            </Container>

            <Container className={classes.usetTypeInputBox}>
              <IoTextField
                error={usetTypeInvalid}
                variant="outlined"
                id="user_account_type"
                label={isWidthDown('xs', width) ? 'Type' : 'User Type'}
                helperText={usetTypeHelperText}
                name="user_account_typen"
                autoFocus
                value={usetTypeDisplay[usetType] ?? ''}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        className={classes.usetTypeButton}
                        aria-label="more"
                        aria-controls="menu"
                        aria-haspopup="true"
                        onClick={handleusetTypeClick}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        id="long-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={open}
                        onClose={handleMenuItemClick(0)}
                        PaperProps={{
                          style: {
                            background: theme.palette.background.widget,
                          },
                        }}
                      >
                        {[...usetTypeDisplay.keys()].map(key => (
                          <MenuItem
                            key={key}
                            selected={key === 0}
                            onClick={handleMenuItemClick(key)}
                          >
                            <Typography variant="caption">
                              {usetTypeDisplay[key]}
                            </Typography>
                          </MenuItem>
                        ))}
                      </Menu>
                    </InputAdornment>
                  ),
                }}
              />
            </Container>
          </Container>

          <Container className={classes.emailInputContainer}>
            <Container className={classes.emailInputBox}>
              <IoTextField
                error={emailAlreadyTaken || emailFormInvalid}
                variant="outlined"
                id="username"
                label="Email Address"
                helperText={emailBoxHelperText}
                name="username"
                autoFocus
                fullWidth
                value={inputContent}
                onChange={handleEmailInput}
              />
            </Container>
          </Container>

          <Container className={classes.passwordContainer}>
            <Container className={classes.passwordInputBox}>
              <IoTextField
                error={passwordInvalid}
                variant="outlined"
                id="user_password"
                label="Password"
                helperText={passwordHelperText}
                name="user_password"
                autoFocus
                value={password}
                onChange={handlePasswordInput}
                type={!showPassword ? 'password' : ''}
              />
            </Container>

            <Container className={classes.passwordConfirmInputBox}>
              <IoTextField
                error={password !== passwordConfirm}
                variant="outlined"
                id="user_password_confirm"
                label="Confirmation"
                helperText={passwordConfirmHelperText}
                name="user_password_confirm"
                autoFocus
                value={passwordConfirm}
                onChange={handlePasswordConfirm}
                type={!showPassword ? 'password' : ''}
              />
            </Container>
          </Container>

          <ToggleBox
            text="Show Password"
            checked={showPassword}
            onChange={handleCheckBoxChange}
            className={classes.checkboxContainer}
          />

          <Container className={classes.jumpContainer}>
            <Link
              onClick={handleLogin}
              variant="body2"
              className={classes.jumpToSignIn}
            >
              Login Account
            </Link>
            <IoTButton onClick={handleNextClick}>Next</IoTButton>
          </Container>
        </Box>

        <BottomBar className={classes.buttomBar} />
        <Copyright className={classes.copyright} />
      </Container>
    </Container>
  );
}

export default withWidth()(Signup);
