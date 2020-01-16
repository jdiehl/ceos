const { AuthenticationError } = require('apollo-server')
const { randomBytes, createHmac } = require('crypto')
const { sign, verify } = require('jsonwebtoken')
const ms = require('ms')
const moment = require('moment')

// convert value from Hstore
function fromHstore(obj) {
  return map(obj, value => {
    if (value === 'true') return true
    if (value === 'false') return false
    const n = parseFloat(value)
    if (!isNaN(n)) return n
    return value
  })
}

// read an environment variable
function getEnv(name, type, defaultValue) {
  let value = process.env[name]
  if (value === undefined) {
    if (defaultValue !== undefined) return defaultValue
    throw new Error(`Missing environment variable ${name}`)
  }
  switch (type) {
    case 'bool':
    case 'boolean':
      value = value.toLowerCase() === 'true' || value === '1'
      break
    case 'int':
      value = parseInt(value, 10)
      if (isNaN(value)) throw new Error(`Invalid environment variable ${name}: must be an integer`)
      break
    case 'float':
      value = parseFloat(value)
      if (isNaN(value)) throw new Error(`Invalid environment variable ${name}: must be a float`)
      break
    case 'array':
      value = value === '' ? [] : value.split(',')
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

// find an object in an array
function find(array, test) {
  for (const obj of array) {
    if (test(obj)) return obj
  }
}

// check if the user has a role
function requireAccess(context, roles) {
  if (context.adminToken) return
  if (!context.auth) throw new AuthenticationError('Must be logged in')
  if (!roles) return
  if (!(roles instanceof Array)) roles = [roles]
  for (const role of roles) {
    if (context.auth.access[role]) return
  }
  throw new AuthenticationError(`Must be ${roles.join(' or ')}`)
}

// require admin token
function requireAdminToken(context) {
  if (!context.adminToken) throw new AuthenticationError('Requires admin token')
}

// schedule
function schedule(triggerFunction, dateFunction) {
  const now = new Date()
  const fireDate = dateFunction(now)
  const interval = fireDate - now
  if (isNaN(interval) || interval < 0) throw new Error(`Invalid fire date returned: ${fireDate}`)
  setTimeout(() => {
    triggerFunction()
    schedule(dateFunction, triggerFunction)
  }, interval)
}

module.exports = {
  fromHstore,
  getEnv,
  encodeJWT,
  decodeJWT,
  makeSalt,
  makeHash,
  verifyHash,
  each,
  map,
  find,
  requireAccess,
  requireAdminToken,
  schedule
}
