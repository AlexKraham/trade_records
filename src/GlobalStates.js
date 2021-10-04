import React, { useState, createContext, useEffect } from 'react'
import AmazonCognitoIdentity from 'amazon-cognito-identity-js'
import { userPool } from './auth/auth'

// var AmazonCognitoIdentity = require('amazon-cognito-identity-js')
export const AuthContext = createContext()

export const AuthProvider = (props) => {
  const [user, setUser] = useState(null)

  async function getUser() {
    const cognitoUser = await userPool.getCurrentUser()
    console.log('user', cognitoUser)
    setUser(cognitoUser)

    if (cognitoUser !== null) {
      cognitoUser.getSession(function (err, session) {
        if (err) {
          alert(err.message || JSON.stringify(err))
          return
        }
        console.log('session validity: ' + session.isValid())
        console.log('session', session)
        console.log('token', session.accessToken.jwtToken)
        var accessToken = session.getAccessToken().getJwtToken()
        console.log('idtoken', session.idToken)

        // console.log("id toekn", session.idToken.jwtToken)
      })
    }
  }
  useEffect(() => {
    getUser()
  }, [])

  return (
    <AuthContext.Provider value={[user, setUser]}>
      {props.children}
    </AuthContext.Provider>
  )
}
