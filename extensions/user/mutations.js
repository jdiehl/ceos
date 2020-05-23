const { AuthenticationError, ApolloError } = require('apollo-server-express')

class NotFoundError extends ApolloError {
  constructor(message = 'Not found') {
    super(message, 404)
  }
}

const { encodeJWT, requireAccess } = require('../../util')
const User = require('./User')

function makeAuthResponse(me) {
  const { id, access } = me
  const { token, expires } = encodeJWT({ id, access })
  return { token, expires: expires.toJSON(), me }
}

// sign up as a new user
async function signupUser(parent, { email, password }, context) {

  // create user
  const me = new User()
  me.email = email
  me.password = password
  await me.save()

  return makeAuthResponse(me)
}

async function loginUser(parent, { email, password }) {
  // find user
  const me = await User.findOne({ where: { email } })
  if (!me) throw new NotFoundError()

  // validate password
  const valid = me.verifyPassword(password)
  if (!valid) throw new AuthenticationError('Invalid password')

  return makeAuthResponse(me)
}

async function extendLoginUser(parent, args, context) {
  requireAccess(context)
  const { id } = context.auth

  // find user
  const me = await User.findByPk(id)
  if (!me) throw new NotFoundError()

  // create a new session
  return makeAuthResponse(me)
}

async function createUser(parent, { input }, context) {
  requireAccess(context, 'admin')

  // create user
  const user = new User()
  Object.assign(user, input)
  await user.save()

  return user
}

async function updateUser(parent, { id, input }, context) {
  requireAccess(context, 'admin')

  // find user
  const user = await User.findByPk(id)
  if (!user) throw new NotFoundError()

  // update user
  Object.assign(user, input)
  await user.save()

  return user
}

async function deleteUser(parent, { id }, context) {
  requireAccess(context, 'admin')
  const rows = await User.destroy({ where: { id } })
  if (!rows) throw new NotFoundError()
  return true
}

module.exports = {
  signupUser,
  loginUser,
  extendLoginUser,
  createUser,
  updateUser,
  deleteUser
}
