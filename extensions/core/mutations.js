const { AuthenticationError } = require('apollo-server')
const { sync } = require('../../sequelize')

// sign up as a new user
async function reset(parent, args, context) {
  if (!context.adminToken) throw new AuthenticationError('Requires admin token')
  const { force } = args
  await sync(force)
  return true
}

module.exports = {
  reset
}
