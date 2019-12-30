const User = require('./User')
const { requireAccess } = require('../../util')

async function users(parent, where, context) {
  requireAccess(context, 'admin')
  return User.findAll({ where })
}

async function user(parent, { id }, context) {
  requireAccess(context, 'admin')
  return User.findByPk(id)
}

async function me(parent, args, context) {
  requireAccess(context)
  return User.findByPk(context.auth.id)
}

module.exports = {
  users,
  user,
  me
}
