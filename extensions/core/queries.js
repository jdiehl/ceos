const { requireAdminToken } = require('../../util')

async function ping(parent, args, context) {
  requireAdminToken(context)
  return true
}

module.exports = {
  ping
}
