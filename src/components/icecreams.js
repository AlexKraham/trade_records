import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../GlobalStates'

export default function IceCreams() {
  const [resources, setResources] = useState(null)
  const [user, setUser] = useContext(AuthContext)
  const history = useHistory()

  useEffect(() => {
    if (user === null) {
      history.push('/')
    }
    const fetchData = async () => {
      const fetched = await axios.get(
        'https://mfcmf6nqx4.execute-api.us-west-1.amazonaws.com/latest/icecreams'
      )
      console.log(fetched.data)
      setResources(fetched.data)
    }
    fetchData()
  }, [])
  return (
    <h1>
      {' '}
      {!user
        ? 'unauthorized'
        : resources === null
        ? 'No data loaded yet'
        : resources.map((resource) => {
            return (
              <>
                <li> {resource.name} </li>
                <p>{resource.icecreamid} </p>
              </>
            )
          })}
    </h1>
  )
}
