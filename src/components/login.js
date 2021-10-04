import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { AuthContext } from '../GlobalStates'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import UserPool from '../auth/UserPool'

import { userPool } from '../auth/auth'
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js'
import * as AWS from 'aws-sdk/global'

const theme = createTheme()

export default function SignIn() {
  const [user, setUser] = useContext(AuthContext)
  const [signUp, setSignUp] = useState(false)
  const history = useHistory()
  const handleSubmit = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    let attributeList = []

    // handle Sign in
    if (signUp) {
      handleSignup(data)
    } else {
      handleLogin(data)
    }
  }

  const handleLogin = async (data) => {
    const authenticationData = {
      Username: data.get('username'),
      Password: data.get('password'),
    }
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      authenticationData
    )
    var userData = {
      Username: data.get('username'),
      Pool: userPool,
    }
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)
    await cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        console.log('result', result)
        var accessToken = result.getAccessToken().getJwtToken()

        //POTENTIAL: Region needs to be set if not already set previously elsewhere.
        AWS.config.region = 'us-west-1'

        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: 'us-west-1:bf655732-bb78-4a22-93d4-8ba4465eb654', // your identity pool id here
          Logins: {
            // Change the key below according to the specific region your user pool is in.
            'cognito-idp.us-west-1.amazonaws.com/us-west-1_6XpsYazg3': result
              .getIdToken()
              .getJwtToken(),
          },
        })

        AWS.config.credentials.clearCachedId()
        //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
        AWS.config.credentials.refresh((error) => {
          if (error) {
            console.error(error)
          } else {
            // Instantiate aws sdk service objects now that the credentials have been updated.
            // example: var s3 = new AWS.S3();
            console.log('Successfully logged!')
            setUser(cognitoUser)
            // history.push('/dash')
          }
        })
      },

      onFailure: function (err) {
        alert(err.message || JSON.stringify(err))
      },
    })
  }

  const handleSignup = async (data) => {
    let attributeList = []
    var dataEmail = {
      Name: 'email',
      Value: data.get('email'),
    }
    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(
      dataEmail
    )
    attributeList.push(attributeEmail)

    // eslint-disable-next-line no-console
    // console.log({
    //   email: data.get('email'),
    //   password: data.get('password'),
    //   username: data.get('username'),
    // })

    await userPool.signUp(
      data.get('username'),
      data.get('password'),
      attributeList,
      null,
      function (err, result) {
        if (err) {
          alert(err.message || JSON.stringify(err))
          return
        }
        var cognitoUser = result.user
        console.log('user name is ' + cognitoUser.getUsername())

        const authenticationData = {
          Username: data.get('username'),
          Password: data.get('password'),
        }
        var authenticationDetails =
          new AmazonCognitoIdentity.AuthenticationDetails(authenticationData)

        setTimeout(() => {
          cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
              var accessToken = result.getAccessToken().getJwtToken()

              //POTENTIAL: Region needs to be set if not already set previously elsewhere.
              AWS.config.region = 'us-west-1'

              AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId:
                  'us-west-1:bf655732-bb78-4a22-93d4-8ba4465eb654', // your identity pool id here
                Logins: {
                  // Change the key below according to the specific region your user pool is in.
                  'cognito-idp.us-west-1.amazonaws.com/us-west-1_6XpsYazg3':
                    result.getIdToken().getJwtToken(),
                },
              })

              AWS.config.credentials.clearCachedId()
              //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
              AWS.config.credentials.refresh((error) => {
                if (error) {
                  console.error(error)
                } else {
                  // Instantiate aws sdk service objects now that the credentials have been updated.
                  // example: var s3 = new AWS.S3();
                  console.log('Successfully logged!')
                  setUser(cognitoUser)
                  // history.push('/dash')
                }
              })
            },

            onFailure: function (err) {
              alert(err.message || JSON.stringify(err))
            },
          })
        }, 0)
        //after signing up, log in the user.
        // handleLogin(data)
      }
    )
  }

  function renderSignUp() {
    console.log('rendering sign up')
    setSignUp(!signUp)
  }

  function handleTest() {
    let attributeList = []
    var dataEmail = {
      Name: 'email',
      Value: 'email@gmail.com',
    }
    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(
      dataEmail
    )
    attributeList.push(attributeEmail)
    UserPool.signUp('email', 'password', attributeList, null, (err, data) => {
      if (err) {
        console.error(err)
      }
      console.log(data)
    })
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            {signUp ? 'Register' : 'Login'}
          </Typography>
          <Box
            component='form'
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin='normal'
              required
              fullWidth
              id='username'
              label='Username'
              name='username'
              autoComplete='username'
              autoFocus
            />
            {signUp && (
              <TextField
                margin='normal'
                required
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                autoComplete='email'
                autoFocus
              />
            )}
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
            />

            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
            >
              {signUp ? 'Register' : 'Login'}
            </Button>
            <Grid container>
              <Grid item>
                <Link
                  onClick={renderSignUp}
                  variant='body2'
                  style={{ cursor: 'pointer' }}
                >
                  {signUp
                    ? 'Already have an account? Login'
                    : "Don't have an account? Register"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Button onClick={handleTest}>click me</Button>
      </Container>
    </ThemeProvider>
  )
}
