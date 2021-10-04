import { CognitoUserPool } from 'amazon-cognito-identity-js'

const poolData = {
  UserPoolId: 'us-west-1_6XpsYazg3',
  ClientId: '7cm6ihumdp0famk115jgloa24f',
}

export default new CognitoUserPool(poolData)
