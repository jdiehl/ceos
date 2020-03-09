const db = require('../../sequelize')
const { requireAdminToken } = require('../../util')

// reset database
async function reset(parent, { force }, context) {
  requireAdminToken(context)
  await db.sync(force)
  return true
}

// migrate database
async function migrate(parent, { to, direction }, context) {
  requireAdminToken(context)
  await db.migrate(to, direction)
  return true
}

module.exports = {
  reset,
  migrate
}
