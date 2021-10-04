import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import { AuthContext } from '../GlobalStates'
import { userPool } from '../auth/auth'

export default function Navigation() {
  const [user, setUser] = useContext(AuthContext)
  const history = useHistory()
  async function handleSignout() {
    // var cognitoUser = userPool.getCurrentUser()
    // await cognitoUser.signOut()
    sessionStorage.removeItem('access_token')
    sessionStorage.removeItem('user')
    setUser(null)
    history.push('/')
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static' style={{ backgroundColor: '#90b374' }}>
        <Toolbar>
          {/* <IconButton
            size='large'
            edge='start'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Trade Record
          </Typography>
          <Button
            color='inherit'
            onClick={handleSignout}
            style={{ marginLeft: 'auto', marginRight: '0' }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
