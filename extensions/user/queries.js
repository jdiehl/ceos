const User = require('./User')
const { requireRole, requireAdmin } = require('../../util')

async function users(parent, args, context) {
  requireRole(context, 'admin')
  return User.findAll({})
}

async function me(parent, args, context) {
  requireAdmin(context)
  const { id } = context.auth
  const user = await User.findByPk(id)
  return user
}

module.exports = {
  users,
  me
}
