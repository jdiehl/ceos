const { getEnv, decodeJWT } = require('../../util')

const ADMIN_TOKEN = getEnv('ADMIN_TOKEN')

// install auth middleware
module.exports = ({ req }, context) => {
  const { authorization } = req.headers
  if (!authorization) return

  const [type, token] = authorization.split(' ')
  if (type !== 'Bearer' || !token) return

  // admin token
  context.adminToken = ADMIN_TOKEN && token === ADMIN_TOKEN

  // json web token
  context.auth = decodeJWT(token)
}
