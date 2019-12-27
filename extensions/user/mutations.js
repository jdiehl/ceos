const { AuthenticationError } = require('apollo-server')

const { encodeJWT } = require('../../util')
const User = require('./User')

function makeAuthResponse(me) {
  const { id, roles } = me
  const { token, expires } = encodeJWT({ id, roles })
  return { token, expires: expires.toJSON(), me }
}

// sign up as a new user
async function signup(parent, args, context) {
  const { email, password } = args

  const me = new User()
  me.email = email
  me.setPassword(password)

  // if admin token is present: make an admin
  if (context.adminToken) {
    me.roles = { admin: true }
  }

  await me.save()

  return makeAuthResponse(me)
}

async function login(parent, args) {
  const { email, password } = args

  const me = await User.findOne({ where: { email } })
  if (!me) throw new AuthenticationError('User not found')

  const valid = me.verifyPassword(password)
  if (!valid) throw new AuthenticationError('Invalid password')

  return makeAuthResponse(me)
}

module.exports = {
  signup,
  login
}
