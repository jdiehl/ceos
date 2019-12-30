const { sync } = require('../../sequelize')
const { requireAdminToken } = require('../../util')

// sign up as a new user
async function reset(parent, { force }, context) {
  requireAdminToken(context)
  await sync(force)
  return true
}

module.exports = {
  reset
}
