import './styles.css'
import { useEffect, useContext } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import Index from './components/index'
import IceCreams from './components/icecreams'
import { AuthContext } from './GlobalStates'
import Login from './components/login'

function App() {
  const [user, setUser] = useContext(AuthContext)

  useEffect(() => {
    // getCurrentUser()
    console.log(user)
  }, [user])
  return (
    <Router>
      <div>
        <Route path='/' exact component={user === null ? Login : Index} />
        {/* <Route path='/dash' exact component={Index} /> */}
        <Route path='/icecreams/' component={IceCreams} />
      </div>
    </Router>
  )
}

export default App

// <nav>
// <ul>
//   <li>
//     <Link to='/'>Home</Link>
//   </li>
//   <li>
//     <Link to='/icecreams'>Ice Creams</Link>
//   </li>
//   <li>
//     {!user ? (
//       <button onClick={handlesignup}>sign up</button>
//     ) : (
//       <button onClick={logout}>signout</button>
//     )}
//   </li>
//   <li>
//     <button onClick={authenticate}>auth</button>
//   </li>
//   <li>
//     <button onClick={getAttributes}>get attributes</button>
//   </li>
// </ul>
// </nav>
// const getCurrentUser = () => {
//   var cognitoUser = userPool.getCurrentUser()
//   console.log(cognitoUser)
//   if (cognitoUser != null) {
//     cognitoUser.getSession(function (err, session) {
//       if (err) {
//         alert(err.message || JSON.stringify(err))
//         return
//       }
//       console.log('session validity: ' + session.isValid())
//       console.log('session', session)

//       // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//       //   IdentityPoolId: 'us-west-1:aa86c8d4-d887-4767-9a54-1af68243f797', // your identity pool id here
//       //   Logins: {
//       //     // Change the key below according to the specific region your user pool is in.
//       //     'cognito-idp.us-west-1.amazonaws.com/us-west-1_9hyCVAnxU': session
//       //       .getIdToken()
//       //       .getJwtToken(),
//       //   },
//       // })

//       // Instantiate aws sdk service objects now that the credentials have been updated.
//       // example: var s3 = new AWS.S3();
//     })
//   }
// }

// const logout = () => {
//   var cognitoUser = userPool.getCurrentUser()
//   cognitoUser.signOut()
//   setUser(null)
// }

// const authenticate = async () => {
//   var authenticationData = {
//     Username: 'aphan',
//     Password: 'khmer111',
//   }
// var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
//   authenticationData
// )
// var userData = {
//   Username: 'aphan',
//   Pool: userPool,
// }
// var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)
// await cognitoUser.authenticateUser(authenticationDetails, {
//   onSuccess: function (result) {
//     var accessToken = result.getAccessToken().getJwtToken()

//     //POTENTIAL: Region needs to be set if not already set previously elsewhere.
//     AWS.config.region = 'us-west-1'

//     AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//       IdentityPoolId: 'us-west-1:aa86c8d4-d887-4767-9a54-1af68243f797', // your identity pool id here
//       Logins: {
//         // Change the key below according to the specific region your user pool is in.
//         'cognito-idp.us-west-1.amazonaws.com/us-west-1_9hyCVAnxU': result
//           .getIdToken()
//           .getJwtToken(),
//       },
//     })

//     //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
//     AWS.config.credentials.refresh((error) => {
//       if (error) {
//         console.error(error)
//       } else {
//         // Instantiate aws sdk service objects now that the credentials have been updated.
//         // example: var s3 = new AWS.S3();
//         console.log('Successfully logged!')
//       }
//     })
//   },

//   onFailure: function (err) {
//     alert(err.message || JSON.stringify(err))
//   },
// })

// setUser(cognitoUser)
// }

// const getAttributes = () => {
//   var cognitoUser = userPool.getCurrentUser()

//   if (cognitoUser != null) {
// cognitoUser.getSession(function (err, session) {
//   if (err) {
//     alert(err.message || JSON.stringify(err))
//     return
//   }
//   console.log('session validity: ' + session.isValid())
//   console.log('session', session)

//       // NOTE: getSession must be called to authenticate user before calling getUserAttributes
//       cognitoUser.getUserAttributes(function (err, attributes) {
//         if (err) {
//           // Handle error
//         } else {
//           // Do something with attributes
//           console.log(attributes)
//         }
//       })

//       AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//         IdentityPoolId: 'us-west-1:aa86c8d4-d887-4767-9a54-1af68243f797', // your identity pool id here
//         Logins: {
//           // Change the key below according to the specific region your user pool is in.
//           'cognito-idp.us-west-1.amazonaws.com/us-west-1_9hyCVAnxU': session
//             .getIdToken()
//             .getJwtToken(),
//         },
//       })

//       // Instantiate aws sdk service objects now that the credentials have been updated.
//       // example: var s3 = new AWS.S3();
//     })
//   }
//   // const cognitoUser = userPool.getCurrentUser()
//   // console.log(cognitoUser.getUsername())
//   // console.log(cognitoUser.getAccessToken)
//   // cognitoUser.getUserAttributes(function (err, result) {
//   //   if (err) {
//   //     alert(err.message || JSON.stringify(err))
//   //     return
//   //   }
//   //   for (let i = 0; i < result.length; i++) {
//   //     console.log(
//   //       'attribute ' +
//   //         result[i].getName() +
//   //         ' has value ' +
//   //         result[i].getValue()
//   //     )
//   //   }
//   // })
// }

// const handlesignup = () => {
//   var attributeList = []

//   var dataEmail = {
//     Name: 'email',
//     Value: 'alexander.phan@me.com',
//   }

// var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(
//   dataEmail
// )
//   attributeList.push(attributeEmail)

//   userPool.signUp(
//     'alexander',
//     'khmer111',
//     attributeList,
//     null,
//     function (err, result) {
//       if (err) {
//         alert(err.message || JSON.stringify(err))
//         return
//       }
//       var cognitoUser = result.user
//       console.log('user name is ' + cognitoUser.getUsername())
//     }
//   )
// }
