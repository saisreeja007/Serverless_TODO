import jwt from 'jsonwebtoken'

export function getUserId(event) {
  const authHeader = event.headers.Authorization || event.headers.authorization
  const token = authHeader.split(' ')[1]
  const decoded= jwt.decode(token)

  return decoded.sub
}
