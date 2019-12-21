const Sequelize = require('sequelize')
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
exports.sequelize = new Sequelize(DB, options)

// Sequelize
exports.Sequelize = Sequelize

// sync database
exports.sync = async (force) => {
  await exports.sequelize.query('create extension if not exists hstore')
  await exports.sequelize.sync({ force })
}
