import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'

const jwksUrl = 'https://dev-116wrywfndtt8tm4.us.auth0.com/.well-known/jwks.json'

const client = jwksClient({
  jwksUri: jwksUrl
})

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      callback(err)
      return
    }
    const signingKey = key.publicKey || key.rsaPublicKey
    callback(null, signingKey)
  })
}

export const handler = (event, context, callback) => {
  const authHeader = event.authorizationToken

  if (!authHeader) {
    callback('Unauthorized')
    return
  }

  const token = authHeader.split(' ')[1]

  jwt.verify(
    token,
    getKey,
    {
      issuer: 'https://dev-116wrywfndtt8tm4.us.auth0.com/',
      audience: 'https://todo-api',
      algorithms: ['RS256']
    },
    (err, decoded) => {
      if (err) {
        console.log('Token verification failed:', err)
        callback('Unauthorized')
      } else {
        callback(null, generatePolicy(decoded.sub, 'Allow', event.methodArn))
      }
    }
  )
}

function generatePolicy(principalId, effect, resource) {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    }
  }
}
