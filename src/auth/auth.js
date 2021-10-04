const AmazonCognitoIdentity = require('amazon-cognito-identity-js')
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool

const poolData = {
  UserPoolId: 'us-west-1_6XpsYazg3',
  ClientId: '7cm6ihumdp0famk115jgloa24f',
}

export const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData)
