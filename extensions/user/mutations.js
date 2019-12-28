const { AuthenticationError } = require('apollo-server')

const { encodeJWT, requireRole } = require('../../util')
const User = require('./User')

function makeAuthResponse(me) {
  const { id, roles } = me
  const { token, expires } = encodeJWT({ id, roles })
  return { token, expires: expires.toJSON(), me }
}

// sign up as a new user
async function signup(parent, { email, password }, context) {

  // create user
  const me = new User()
  me.email = email
  me.password = password

  // if admin token is present: make an admin
  if (context.adminToken) {
    me.roles = { admin: true }
  }

  await me.save()

  return makeAuthResponse(me)
}

async function login(parent, { email, password }) {

  // find user
  const me = await User.findOne({ where: { email } })
  if (!me) throw new AuthenticationError('User not found')

  // validate password
  const valid = me.verifyPassword(password)
  if (!valid) throw new AuthenticationError('Invalid password')

  return makeAuthResponse(me)
}

async function setPassword(parent, { password, oldPassword }, context) {
  requireRole(context)

  // find user
  const me = await User.findByPk(context.auth.id)

  // validate password
  const valid = me.verifyPassword(oldPassword)
  if (!valid) throw new AuthenticationError('Invalid password')

  // update password
  me.password = password
  await me.save()

  return true
}

async function setUserRole(parent, { id, role, active }, context) {
  requireRole(context, 'admin')

  // find user
  const user = await User.findByPk(id)
  if (!user) throw new AuthenticationError('User not found')

  // cannot remove own admin role
  if (user.id === context.auth.id && role === 'admin') throw new Error('Cannot remove own admin role')

  // update user
  const { roles } = user
  if (active) {
    user.roles = Object.assign(roles, { [role]: true })
  } else {
    delete roles[role]
    user.roles = roles
  }

  await user.save()

  return true
}

async function updateUser(parent, { id, ...args }, context) {
  requireRole(context, 'admin')

  // find user
  const user = await User.findByPk(id)
  if (!user) throw new AuthenticationError('User not found')

  // update user
  Object.assign(user, args)
  await user.save()

  return true
}

module.exports = {
  signup,
  login,
  setPassword,
  setUserRole,
  updateUser
}
