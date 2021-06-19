import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: '14px',
    textTransform: 'none',
    marginBottom: theme.spacing(1),
    padding: '2px 6px',
    borderColor: theme.palette.light.dark,
  },
  avatar: {
    width: theme.spacing(2),
    height: theme.spacing(2),
  },
}));

export default function AvatarBar(props) {
  const { email, avatarSrc, handleAvatarClick, ...other } = props;

  const classes = useStyles();

  return (
    <Button
      variant="outlined"
      size="small"
      className={classes.root}
      startIcon={<Avatar src={avatarSrc} className={classes.avatar} />}
      {...other}
    >
      <Typography
        variant="caption"
        style={{
          fontWeight: 500,
        }}
      >
        {email}
      </Typography>
    </Button>
  );
}
