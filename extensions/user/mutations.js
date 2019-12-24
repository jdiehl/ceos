const { AuthenticationError } = require('apollo-server')

const { makeJWT } = require('../../util')
const User = require('./User')

function makeUserResponse(me) {
  const { id, roles } = me
  const { token, expires } = makeJWT({ id, roles })
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

  return makeUserResponse(me)
}

async function login(parent, args) {
  const { email, password } = args

  const me = await User.findOne({ where: { email } })
  if (!me) throw new AuthenticationError('User not found')

  const valid = me.verifyPassword(password)
  if (!valid) throw new AuthenticationError('Invalid password')

  return makeUserResponse(me)
}

module.exports = {
  signup,
  login
}
