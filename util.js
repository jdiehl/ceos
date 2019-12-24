const { AuthenticationError } = require('apollo-server')
const { randomBytes, createHmac } = require('crypto')
const { sign, verify } = require('jsonwebtoken')
const ms = require('ms')

// read an environment variable
function getEnv(name, type) {
  let value = process.env[name]
  if (value === undefined) throw new Error(`Missing Environment Variable ${name}`)
  switch (type) {
    case 'int':
      value = parseInt(value, 10)
      if (isNaN(value)) throw new Error(`Invalid Environment Variable ${name}: Must be an integer`)
      break
    case 'float':
      value = parseFloat(value)
      if (isNaN(value)) throw new Error(`Invalid Environment Variable ${name}: Must be a float`)
      break
  }
  return value
}

const JWT_SECRET = getEnv('JWT_SECRET')
const JWT_EXPIRES = getEnv('JWT_EXPIRES')

// encode a JWT
function encodeJWT(payload) {
  const token = sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES })
  const expires = new Date(new Date().getTime() + ms(JWT_EXPIRES))
  return { token, expires }
}

// decode a JWT
function decodeJWT(token) {
  try {
    return verify(token, JWT_SECRET)
  } catch (error) {
    // nothing
  }
}

// make a password salt
function makeSalt(encoding = 'base64', length = 128) {
  return randomBytes(Math.ceil(64)).toString(encoding).slice(0, length)
}

// make a password hash
function makeHash(salt, password) {
  return createHmac('sha512', salt).update(password).digest('base64')
}

// verify a password hash
function verifyHash(password, salt, hash) {
  const testHash = createHmac('sha512', salt).update(password).digest('base64')
  return testHash === hash
}

// each function for obejcts
function each(object, callback) {
  if (!object) return
  for (const key of Object.keys(object)) {
    callback(object[key], key)
  }
}

// mapping function for objects
function map(object, callback) {
  if (!object) return
  const res = {}
  for (const key of Object.keys(object)) {
    res[key] = callback(object[key], key)
  }
  return res
}

// check if the user has a role
function requireRole(context, role) {
  if (!context.auth || (role && (!context.auth.roles || !context.auth.roles[role]))) {
    throw new AuthenticationError(`Must be ${role || 'logged in'}`)
  }
}

function requireAdmin(context) {
  if (!context.adminToken) throw new AuthenticationError('Requires admin token')
}

module.exports = {
  getEnv,
  encodeJWT,
  decodeJWT,
  makeSalt,
  makeHash,
  verifyHash,
  each,
  map,
  requireRole,
  requireAdmin
}
