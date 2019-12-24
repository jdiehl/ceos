const { AuthenticationError } = require('apollo-server')

async function ping(parent, args, context) {
  if (context.adminToken) throw new AuthenticationError('Require admin token')
  return true
}

module.exports = {
  ping
}
