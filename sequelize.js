const { Op, Sequelize } = require('sequelize')
const Umzug = require('umzug')
const { getEnv } = require('./util')

const DB = getEnv('DB')
const DB_POOL = getEnv('DB_POOL', 'int')
const NODE_ENV = getEnv('NODE_ENV', 'string', 'development')

const logging = NODE_ENV.toLowerCase() === 'production' ? false : console.log

const options = {
  pool: {
    max: DB_POOL,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging
}

// the server
const sequelize = new Sequelize(DB, options)

// sync database
async function sync(force) {
  await sequelize.sync({ force })
}

// migrate database
async function migrate(to, direction = 'up') {
  const umzug = new Umzug({
    migrations: {
      path: './migrations',
      params: [sequelize.getQueryInterface(), Sequelize]
    },
    storage: 'sequelize',
    storageOptions: { sequelize }
  })
  if (direction === 'down') {
    await umzug.down({ to })
  } else {
    await umzug.up({ to })
  }
}

// helper functions
function isBetween(a, b) {
  return {
    [Op.and]: {
      [Op.gte]: a,
      [Op.lt]: b
    }
  }
}

module.exports = {
  sequelize,
  Sequelize,
  Op,
  sync,
  migrate,
  isBetween
}