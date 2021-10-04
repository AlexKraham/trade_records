const ApiBuilder = require('claudia-api-builder'),
  AWS = require('aws-sdk')
var api = new ApiBuilder(),
  dynamoDb = new AWS.DynamoDB.DocumentClient()

const { v4: uuidv4 } = require('uuid')

api.registerAuthorizer('trade-record-auth', {
  providerARNs: [
    'arn:aws:cognito-idp:us-west-1:590529353344:userpool/us-west-1_6XpsYazg3',
  ],
})

// api.get(
//   '/trades',
//   function (request) {
//     // GET all users
//     return dynamoDb
//       .scan({ TableName: 'trade_records' })
//       .promise()
//       .then((response) => response.Items)
//   }
//   // {
//   //   cognitoAuthorizer: 'api-auth-traderecord',
//   //   authorizationScopes: ['email', 'openid'],
//   // }
// )

api.get(
  '/trades/limit',
  function (request) {
    // GET all users
    return dynamoDb
      .scan({ TableName: 'trade_records', Limit: 8 })
      .promise()
      .then((response) => {
        return {
          items: response.Items,
          lastEvaluatedKey: response.LastEvaluatedKey,
        }
      })
  }
  // {
  //   cognitoAuthorizer: 'api-auth-traderecord',
  //   authorizationScopes: ['email', 'openid'],
  // }
)

api.get(
  '/trades/limit/{startkey}',
  function (request) {
    const startKey = request.pathParams.startkey
    // GET all users
    return dynamoDb
      .scan({
        TableName: 'trade_records',
        Limit: 8,
        ExclusiveStartKey: {
          item_id: startKey,
        },
      })
      .promise()
      .then((response) => {
        return {
          items: response.Items,
          lastEvaluatedKey: response.LastEvaluatedKey,
        }
      })
  }
  // {
  //   cognitoAuthorizer: 'api-auth-traderecord',
  //   authorizationScopes: ['email', 'openid'],
  // }
)

/* get trades by user id*/
api.get(
  '/trades/mytrades/{username}',
  function (request) {
    return dynamoDb
      .scan({
        TableName: 'trade_records',
        FilterExpression: '#username = :username',
        ExpressionAttributeNames: {
          '#username': 'username',
        },
        ExpressionAttributeValues: {
          ':username': request.pathParams.username,
        },
      })
      .promise()
      .then((response) => {
        return {
          items: response.Items,
          lastEvaluatedKey: response.LastEvaluatedKey,
        }
      })
  }
  // {
  //   cognitoAuthorizer: 'api-auth-traderecord',
  //   authorizationScopes: ['email', 'openid'],
  // }
)

api.delete(
  '/trades/{itemid}',
  function (request) {
    const itemid = request.pathParams.itemid
    return dynamoDb
      .delete({
        TableName: 'trade_records',
        Key: {
          item_id: itemid,
        },
      })
      .promise()
      .then((response) => response)
  }
  // {
  //   cognitoAuthorizer: 'api-auth-traderecord',
  //   authorizationScopes: ['email', 'openid'],
  // }
)

api.put('/trades', function (request) {
  var params = {
    TableName: 'trade_records',
    Key: {
      item_id: request.body.item_id,
    },
    UpdateExpresson:
      'set side=:side, type=:type, symbol=:symbol, position_size=:position_size, entry=:entry, exit=:exit, notes=:notes, date_executed=:date_executed, status=:status',
    ExpressionAttributeValues: {
      ':side': request.body.side,
      ':type': request.body.type,
      ':symbol': request.body.symbol,
      ':position_size': request.body.position_size,
      ':entry': request.body.entry,
      ':exit': request.body.exit,
      ':notes': request.body.notes,
      ':date_executed': request.body.date_executed,
      ':status': request.body.status,
    },
    ExpressionAttributeNames: {
      '#side': 'side',
      '#type': 'type',
      '#symbol': 'symbol',
      '#position_size': 'position_size',
      '#entry': 'entry',
      '#exit': 'exit',
      '#notes': 'notes',
      '#date_executed': 'date_executed',
      '#status': 'status',
    },
    ReturnValues: 'UPDATED_NEW',
  }

  return dynamoDb.update(params, function (err, data) {
    if (err) {
      console.error(
        'Unable to update item. Error JSON:',
        JSON.stringify(err, null, 2)
      )
    } else {
      console.log('UpdateItem succeeded:', JSON.stringify(data, null, 2))
    }
  })
})

api.post(
  '/trades',
  function (request) {
    var params = {
      TableName: 'trade_records',
      Item: {
        item_id: request.body.item_id,
        username: request.body.username,
        date_executed: request.body.date_executed,
        type: request.body.type,
        symbol: request.body.symbol,
        side: request.body.side,
        position_size: request.body.position_size,
        entry: request.body.entry,
        exit: request.body.exit,
        notes: request.body.notes,
        status: request.body.status,
        return: request.body.return,
        // date_created: Date.now(),
      },
    }
    return dynamoDb.put(params).promise()
  },
  { success: 201 }
)

api.post(
  '/icecreams',
  function (request) {
    // SAVE your icecream
    var params = {
      TableName: 'icecreams',
      Item: {
        icecreamid: request.body.icecreamId,
        name: request.body.name, // your icecream name
      },
    }
    return dynamoDb.put(params).promise() // returns dynamo result
  },
  {
    success: 201,
    // cognitoAuthorizer: 'api-auth-traderecord',
    // authorizationScopes: ['email', 'openid'],
  }
) // returns HTTP status 201 - Created if successful

api.get('/icecreams', function (request) {
  // GET all users
  return dynamoDb
    .scan({ TableName: 'icecreams' })
    .promise()
    .then((response) => response.Items)
})

api.get(
  '/locked',
  () => {
    return 'hello from locked api'
  },
  {
    cognitoAuthorizer: 'trade-record-auth',
    authorizationScopes: ['email', 'openid'],
  }
)

module.exports = api
