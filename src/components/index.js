import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../UserContext'
import { AuthContext } from '../GlobalStates'
import { useHistory } from 'react-router-dom'
import Navigation from './navigation'
import Trades from './trades'

import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

export default function Index() {
  const [user, setUser] = useContext(AuthContext)
  const [selectedTab, setSelectedTab] = useState(0)
  const [loading, setLoading] = useState(true)

  // const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue)
  }
  const loadData = () => {
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const renderComponent = (selected) => {
    if (selected === 0) {
      return (
        <div>
          <p>this is selected 0</p>
        </div>
      )
    } else {
      return <Trades selected={this.selected} />
    }
  }

  return (
    <div>
      <Navigation />
      {loading ? (
        <h1>loading</h1>
      ) : (
        <div style={{ marginTop: '10px', marginLeft: '10px' }}>
          <Tabs value={selectedTab} onChange={handleChange}>
            <Tab label='All Public Trades' />
            <Tab label='My Trades' />
          </Tabs>
          {/* <Stack direction='row' spacing={2}>
            <Button
              variant='contained'
              disabled={selectedButton === 0}
              onClick={handleAllPublicTrades}
            >
              All public trades
            </Button>
            <Button
              variant='contained'
              disabled={selectedButton === 1}
              onClick={handleMyTrades}
            >
              My trades
            </Button>
          </Stack> */}
          {/* {renderComponent(selectedTab)} */}
          <Trades selectedTab={selectedTab} />
        </div>
      )}
    </div>
  )
}
