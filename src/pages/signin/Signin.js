import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory, useLocation } from 'react-router-dom';
import withWidth, { isWidthUp, isWidthDown } from '@material-ui/core/withWidth';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ReactComponent as Icon } from '../../assets/images/icon.svg';
import BottomBar from '../components/BottomBar';
import Copyright from '../components/Copyright';
import AvatarBar from '../components/AvatarBar';
import IoTextField from '../components/IoTextField';
import IoTButton from '../components/IoTButton';
import ToggleBox from '../components/ToggleBox';

const useStyles = makeStyles(theme => ({
  // TODO: fix these ugly naming...
  verticalContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    maxWidth: '600px',
  },
  main: {
    marginTop: -theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  borderedContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: theme.palette.background.widget,
    padding: theme.spacing(3),
    width: '90%',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
    marginTop: theme.spacing(1),
    position: 'relative',
  },
  registerAndNext: {
    margin: theme.spacing(3.5, 0, 10),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  welcomeText: {
    margin: theme.spacing(1, 0, 1),
    color: theme.palette.secondary.main,
  },
  inputAndCheckbox: {
    padding: theme.spacing(0),
    margin: theme.spacing(1, 0, -0.5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '85%',
    height: '100%',
  },

  centeredFlex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '100%',
    height: '100%',
    marginBottom: theme.spacing(3),
  },
  copyright: {
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'center',
  },
  loadingProgress: {
    // color: '#27CD86',
    position: 'relative',
    // top: "50%",
    // left: "50%",
    zIndex: 1,
  },
}));

function Signin(props) {
  const { width } = props;

  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const [afterEmailCheck, setAfterEmailCheck] = useState(false);
  const [avatarClicked, setAvatarClicked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [inputContent, setInputContent] = useState('');
  const [validEmail, setValidEmail] = useState('');
  const [validFormEmail, setValidFormEmail] = useState('');
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [inputEmpty, setInputEmpty] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [emailFormInvalid, setEmailFormInvalid] = useState(false);

  const [loadingData, setLoadingData] = useState(false);

  // note that this is a full-width space
  // material ui seems to ignore the half-width one
  // const defaultHelperTextPlaceHolder = isWidthDown('xs', width) ? '' : '　';
  const defaultHelperTextPlaceHolder = '　';
  let inputBoxHelpterText = defaultHelperTextPlaceHolder; // some white spaces to take up the width

  if (afterEmailCheck) {
    if (passwordInvalid) {
      inputBoxHelpterText = 'Your password is incorrect';
    } else if (inputEmpty) {
      inputBoxHelpterText = 'Please input your password';
    }
  } else if (emailFormInvalid) {
    inputBoxHelpterText = 'Your Email is invalid';
  } else if (emailInvalid) {
    inputBoxHelpterText = "Your Email hasn't been registered";
  } else if (inputEmpty) {
    inputBoxHelpterText = 'Please input your Email';
  }

  const handleClick = async () => {
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
        setValidEmail(validFormEmail);
        setInputContent('');
        setAfterEmailCheck(true);
      } else {
        setEmailInvalid(true);
        console.log(`Your email doesn't exist, check again my boy:`);
      }
    };

    const checkPasswordWithServer = async () => {
      const payload = {
        email: validEmail,
        passwd: inputContent,
      };
      // const formData = new URLSearchParams(payload).toString();

      const response = await fetch('/api/account/login', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log(response);

      if (response.ok) {
        setPasswordInvalid(false);
        history.push({
          pathname: '/home',
          state: { email: validEmail },
        });
        return true;
      } else {
        setPasswordInvalid(true);
        return false;
      }
    };

    setLoadingData(true);
    console.log(`Received input: ${inputContent}, is empty?: ${!inputContent}`);
    setInputEmpty(!inputContent);
    try {
      if (!afterEmailCheck) {
        if (!validFormEmail) {
          console.log('Wrong email format, refusing to login');
        } else {
          await checkEmailWithServer();
        }
      } else {
        const ok = await checkPasswordWithServer();
        console.log('Password is OK, returning');
        if (ok) {
          return;
        }
      }
    } catch (err) {
      console.log(err);
    }
    setLoadingData(false);
  };

  const handleCheckBoxChange = event => {
    const selected = event.target.checked;
    setShowPassword(selected);
    console.log(`selected show password: ${selected}`);
  };

  const handleInputChange = event => {
    const text = event.target.value;
    setInputContent(text);
    setInputEmpty(!text);

    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const invalid = !re.test(text) && text.length !== 0;
    setEmailFormInvalid(invalid);
    console.log(`Getting new email text: ${text}`);
    console.log(`Setting email form invalid: ${invalid}`);
    setValidFormEmail(invalid ? '' : text);
  };
  const handleAvatarClick = () => {
    const newVal = !avatarClicked;
    setAvatarClicked(newVal);
    console.log(`clicked: ${newVal}`);
    console.log('Avatar Clicked!');
  };

  const handleSignup = event => {
    history.push('/signup');
  };

  useEffect(async () => {
    const response = await fetch('/api/account/auth');
    if (response.ok) {
      const body = await response.json();

      history.push({
        pathname: '/home',
        state: { email: body.email },
      });
    }
  }, []); // no dependency

  return (
    <Container component="main" className={classes.verticalContainer}>
      <CssBaseline />
      <Container className={classes.main}>
        <Icon className={classes.icon} />

        <Box style={{ height: '100%', width: '100%', position: 'relative' }}>
          {loadingData && (
            <Box position="absolute" top="5%" left="44%">
              <CircularProgress size={68} className={classes.loadingProgress} />
            </Box>
          )}
          {loadingData && (
            <Box
              style={{ height: '100%', width: '100%', position: 'absolute' }}
              position="absolute"
              top={0}
              left={0}
              zIndex="tooltip"
            />
          )}

          <Container
            className={classes.borderedContainer}
            style={{ filter: loadingData ? 'blur(5px)' : 'blur(0)' }}
            position="absolute"
            top={0}
          >
            <Typography
              component="h1"
              variant="h4"
              className={classes.welcomeText}
            >
              {afterEmailCheck ? 'Welcome' : 'Login'}
            </Typography>
            {afterEmailCheck ? (
              <AvatarBar
                email={validEmail}
                avatarSrc="https://avatars.githubusercontent.com/u/43734697?v=4"
                onClick={handleAvatarClick}
              />
            ) : (
              <Typography
                component="h1"
                variant="body1"
                className={classes.welcomeText}
              >
                Use Your{' '}
                <span
                  style={{
                    fontFamily: 'Harlow Solid Italic',
                  }}
                >
                  IoT Server
                </span>{' '}
                {isWidthDown('xs', width) || 'Registration'} Email
              </Typography>
            )}

            <Container className={classes.inputAndCheckbox}>
              <IoTextField
                onKeyDown={event => {
                  if (event.key === 'Enter') {
                    console.log(`Getting on key down event:`);
                    console.log(event);
                    handleClick();
                  }
                }}
                error={
                  afterEmailCheck
                    ? passwordInvalid || inputEmpty
                    : emailInvalid || emailFormInvalid || inputEmpty
                }
                variant="outlined"
                size="medium"
                id="username_input_field"
                placeholder={
                  !afterEmailCheck
                    ? 'Input Your Email Address'
                    : 'Input Your Password'
                }
                label={!afterEmailCheck ? 'Email Address' : 'Password'}
                helperText={inputBoxHelpterText}
                name="username"
                autoFocus
                autoComplete={afterEmailCheck ? 'current-password' : 'email'}
                fullWidth
                value={inputContent}
                onChange={handleInputChange}
                type={afterEmailCheck && !showPassword ? 'password' : ''}
              />

              {afterEmailCheck && (
                <ToggleBox
                  text="Show Password"
                  checked={showPassword}
                  onChange={handleCheckBoxChange}
                  style={{
                    width: '100%',
                  }}
                />
              )}
            </Container>

            <Container className={classes.registerAndNext}>
              <Link
                onClick={handleSignup}
                variant="body2"
                className={classes.centeredFlex}
              >
                Register Account
              </Link>
              <IoTButton onClick={handleClick}>Next</IoTButton>
            </Container>

            <Container>
              <BottomBar spaceOut />
            </Container>
          </Container>
        </Box>
        <Copyright className={classes.copyright} />
      </Container>
    </Container>
  );
}

export default withWidth()(Signin);
