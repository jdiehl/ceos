const { Sequelize, sequelize } = require('../../sequelize')
const { map, makeHash, makeSalt, verifyHash } = require('../../util')

class User extends Sequelize.Model {
  set password(password) {
    this.salt = makeSalt()
    this.passwordHash = makeHash(this.salt, password)
  }

  verifyPassword(password) {
    return verifyHash(password, this.salt, this.passwordHash)
  }
}

User.init({
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  salt: {
    type: Sequelize.STRING,
    allowNull: false
  },
  passwordHash: {
    type: Sequelize.STRING,
    allowNull: false
  },
  roles: {
    type: Sequelize.HSTORE,
    get() {
      return map(this.getDataValue('roles'), value => value === 'true')
    },
    set(roles) {
      this.setDataValue('roles', map(roles, value => value ? 'true' : 'false'))
    }
  },
  profile: {
    type: Sequelize.HSTORE
  }
}, {
  sequelize,
  modelName: 'user'
})

module.exports = User
