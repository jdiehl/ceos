const { Op, Sequelize } = require('sequelize')
const { getEnv } = require('./util')

const DB = getEnv('DB')
const DB_POOL = getEnv('DB_POOL', 'int')

const options = {
  pool: {
    max: DB_POOL,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}

// the server
const sequelize = new Sequelize(DB, options)

// sync database
async function sync(force) {
  await sequelize.query('create extension if not exists hstore')
  await sequelize.sync({ force })
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
  isBetween
}
