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

api.get(
  '/trades/limit',
  function (request) {
    // GET all users
    return dynamoDb
      .scan({ TableName: 'trade_records', Limit: 5 })
      .promise()
      .then((response) => {
        return {
          items: response.Items,
          lastEvaluatedKey: response.LastEvaluatedKey,
        }
      })
  },
  {
    cognitoAuthorizer: 'trade-record-auth',
    authorizationScopes: ['email', 'openid'],
  }
)

api.get(
  '/trades/limit/{startkey}',
  function (request) {
    const startKey = request.pathParams.startkey
    // GET all users
    return dynamoDb
      .scan({
        TableName: 'trade_records',
        Limit: 5,
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
  },
  {
    cognitoAuthorizer: 'trade-record-auth',
    authorizationScopes: ['email', 'openid'],
  }
)

/* get trades by user id*/
api.get(
  '/trades/mytrades/{username}',
  function (request) {
    return dynamoDb
      .scan({
        TableName: 'trade_records',
        Limit: 5,
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
  },
  {
    cognitoAuthorizer: 'trade-record-auth',
    authorizationScopes: ['email', 'openid'],
  }
)

api.get(
  '/trades/mytrades/{username}/{startKey}',
  function (request) {
    const startKey = request.pathParams.startkey
    return dynamoDb
      .scan({
        TableName: 'trade_records',
        Limit: 5,
        ExclusiveStartKey: {
          item_id: startKey,
        },
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
  },
  {
    cognitoAuthorizer: 'trade-record-auth',
    authorizationScopes: ['email', 'openid'],
  }
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
  },
  {
    cognitoAuthorizer: 'trade-record-auth',
    authorizationScopes: ['email', 'openid'],
  }
)

api.put(
  '/updateitem',
  function (request) {
    var params = {
      TableName: 'trade_records',
      Key: {
        item_id: '39f02ef7-c68a-4f98-b1e3-45e7ff3b04f9',
      },
      UpdateExpression: 'set #type =:ty',
      ExpressionAttributeValues: {
        ':ty': 'stocksssss',
      },
      ExpressionAttributeNames: {
        '#type': 'type',
      },
      ReturnValues: 'UPDATED_NEW',
    }
    return dynamoDb
      .update(params, function (err, data) {
        if (err) {
          console.error(
            'Unable to update item. Error JSON:',
            JSON.stringify(err, null, 2)
          )
        } else {
          console.log('UpdateItem succeeded:', JSON.stringify(data, null, 2))
        }
      })
      .promise()
  },
  {
    cognitoAuthorizer: 'trade-record-auth',
    authorizationScopes: ['email', 'openid'],
  }
)

api.put(
  '/tradesupdate',
  function (request) {
    var params = {
      TableName: 'trade_records',
      Key: {
        item_id: request.body.item_id,
      },
      UpdateExpression:
        'set #side=:side, #type=:type, #symbol=:symbol, #position_size=:position_size, #entry=:entry, #exit=:exit, #notes=:notes, #date_executed=:date_executed, #status=:status',
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

    return dynamoDb
      .update(params, function (err, data) {
        if (err) {
          console.error(
            'Unable to update item. Error JSON:',
            JSON.stringify(err, null, 2)
          )
        } else {
          console.log('UpdateItem succeeded:', JSON.stringify(data, null, 2))
        }
      })
      .promise()
  },
  {
    cognitoAuthorizer: 'trade-record-auth',
    authorizationScopes: ['email', 'openid'],
  }
)

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
  {
    cognitoAuthorizer: 'trade-record-auth',
    authorizationScopes: ['email', 'openid'],
    success: 201,
  }
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
    cognitoAuthorizer: 'trade-record-auth',
    authorizationScopes: ['email', 'openid'],
  }
) // returns HTTP status 201 - Created if successful

module.exports = api
