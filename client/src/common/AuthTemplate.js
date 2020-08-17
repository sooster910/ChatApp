import React, { useState, useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Alert } from '@material-ui/lab';
import Collapse from '@material-ui/core/Collapse';
import {
  Link,
  Grid,
  Box,
  IconButton,
  Container,
  TextField,
  Avatar,
  Button,
  makeStyles,
  Typography,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import CloseIcon from '@material-ui/icons/Close';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="#">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  alert: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const titleMap = {
  login: 'Login',
  signup: 'SignUp',
};

// fieldValidError 각 항목에 error표시를, userAuthError는 데이터를 서버로 보냈는데 실패했을 경우 띄워준다
export default function AuthTemplate({
  type,
  fieldValidError,
  userAuthError,
  onChange,
  onSubmit,
}) {
  const title = titleMap[type];
  const classes = useStyles();
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    if (userAuthError) {
      setAlert(true);
    } else {
      setAlert(false);
    }
  }, [userAuthError]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {title}
        </Typography>
        <form className={classes.form} noValidate onSubmit={onSubmit}>
          <Grid container spacing={2}>
            {type === 'signup' && (
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={onChange}
                  helperText={fieldValidError.firstName}
                  error={fieldValidError.firstName ? true : false}
                />
              </Grid>
            )}
            {type === 'signup' && (
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                  onChange={onChange}
                  helperText={fieldValidError.lastName}
                  error={fieldValidError.lastName ? true : false}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                onChange={onChange}
                autoComplete="email"
                helperText={fieldValidError.email}
                error={fieldValidError.email ? true : false}
                autoFocus={type === 'login'}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={onChange}
                helperText={fieldValidError.password}
                error={fieldValidError.password ? true : false}
              />
            </Grid>
            {type === 'signup' && (
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="passwordConfirm"
                  label="Password Confirm"
                  name="passwordConfirm"
                  type="password"
                  autoComplete="new-password"
                  onChange={onChange}
                  helperText={fieldValidError.passwordConfirm}
                  error={fieldValidError.passwordConfirm ? true : false}
                />
              </Grid>
            )}
            <Grid item xs={12} className={classes.alert}>
              <Collapse in={alert}>
                <Alert
                  variant="outlined"
                  severity="error"
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setAlert(false);
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                >
                  {userAuthError}
                </Alert>
              </Collapse>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {type === 'login' ? 'Login' : 'Sign In'}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            {type === 'login' ? (
              <Grid item>
                <Link href="/signup" variant="body2">
                  Don't have an account? Sign Up
                </Link>
              </Grid>
            ) : (
              <Grid item>
                <Link href="/login" variant="body2">
                  have account? Login
                </Link>
              </Grid>
            )}
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
