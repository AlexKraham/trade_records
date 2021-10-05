import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../UserContext'
import { AuthContext } from '../GlobalStates'
import { useHistory } from 'react-router-dom'
import Navigation from './navigation'
import Trades from './trades'
import MyTrades from './mytrades'
import axios from 'axios'

import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

export default function Index() {
  const [user, setUser] = useContext(AuthContext)
  const [selectedTab, setSelectedTab] = useState(0)
  const [loading, setLoading] = useState(true)
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState(null)
  const [startKeys, setStartKeys] = useState([])
  const [myLastEvalKey, setMyLastEvalKey] = useState(null)
  const [myStartKeys, setMyStartKeys] = useState([])
  const [rows, setRows] = useState([])

  // const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue)
    // setStartKeys([])
    // setLastEvaluatedKey(null)
    fetchData()
  }
  const loadData = () => {
    setLoading(false)
  }

  async function fetchData() {
    let fetched
    if (selectedTab === 0) {
      fetched = await axios.get(
        'https://mfcmf6nqx4.execute-api.us-west-1.amazonaws.com/latest/trades/limit',
        {
          headers: {
            Authorization: user.access_token,
          },
        }
      )
    } else {
      fetched = await axios.get(
        'https://mfcmf6nqx4.execute-api.us-west-1.amazonaws.com/latest/trades/mytrades/' +
          user.username,
        {
          headers: {
            Authorization: user.access_token,
          },
        }
      )
    }

    // console.log('fetched', fetched)
    console.log(fetched.data)
    if (fetched.data !== null) {
      setRows(fetched.data.items)
    }

    if (selectedTab === 0) {
      setLastEvaluatedKey(fetched.data.lastEvaluatedKey)
      setStartKeys([...startKeys, fetched.data.lastEvaluatedKey])
    } else {
      setMyLastEvalKey(fetched.data.lastEvaluatedKey)
      setMyStartKeys([...myStartKeys, fetched.data.lastEvaluatedKey])
    }
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
            {/* <Tab label='My Trades' /> */}
          </Tabs>

          {/* {selectedTab === 0 ? (
            <Trades
              selectedTab={selectedTab}
              startKeys={startKeys}
              setStartKeys={setStartKeys}
              lastEvaluatedKey={lastEvaluatedKey}
              setLastEvaluatedKey={setLastEvaluatedKey}
              fetchData={fetchData}
              rows={rows}
              setRows={setRows}
            />
          ) : (
            <MyTrades
              selectedTab={selectedTab}
              myStartKeys={myStartKeys}
              setMyStartKeys={setMyStartKeys}
              myLastEvalKey={myLastEvalKey}
              setMyLastEvalKey={setMyLastEvalKey}
              fetchData={fetchData}
              rows={rows}
              setRows={setRows}
            />
          )} */}
          <Trades
            selectedTab={selectedTab}
            startKeys={startKeys}
            setStartKeys={setStartKeys}
            lastEvaluatedKey={lastEvaluatedKey}
            setLastEvaluatedKey={setLastEvaluatedKey}
            fetchData={fetchData}
            rows={rows}
            setRows={setRows}
          />
        </div>
      )}
    </div>
  )
}
