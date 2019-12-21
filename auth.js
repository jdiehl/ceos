const crypto = require('crypto')
const { sign, verify } = require('jsonwebtoken')
const { getEnv } = require('./util')
const { use } = require('./server')
const ms = require('ms')

// env variables
const ADMIN_TOKEN = getEnv('ADMIN_TOKEN')
const JWT_SECRET = getEnv('JWT_SECRET')
const JWT_EXPIRES = getEnv('JWT_EXPIRES')

// install auth middleware
use(({ req }, context) => {
  const { authorization } = req.headers
  if (!authorization) return

  const [type, token] = authorization.split(' ')
  if (type !== 'Bearer' || !token) return

  // admin token
  if (token === ADMIN_TOKEN) {
    context.adminToken = true
    return
  }

  // json web token
  try {
    const auth = verify(token, JWT_SECRET)
    if (auth) {
      context.auth = auth
    }
  } catch (err) {
    // nothing
  }
})

exports.makeToken = (payload) => {
  const token = sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES })
  const expires = new Date(new Date().getTime() + ms(JWT_EXPIRES))
  return { token, expires }
}

exports.makeSalt = () => {
  return crypto.randomBytes(Math.ceil(64)).toString('base64').slice(0, 128)
}

exports.makeHash = (salt, password) => {
  return crypto.createHmac('sha512', salt).update(password).digest('base64')
}

exports.verifyHash = (password, salt, hash) => {
  const testHash = crypto.createHmac('sha512', salt).update(password).digest('base64')
  return testHash === hash
}
