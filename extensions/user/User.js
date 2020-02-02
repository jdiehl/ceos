const { Sequelize, sequelize } = require('../../sequelize')
const { makeHash, makeSalt, verifyHash } = require('../../util')

class User extends Sequelize.Model {
  get name() {
    const { profile } = this
    if (profile && profile.name) return profile.name
    return this.email
  }

  set password(password) {
    if (password.length < 6) throw new Error('Insecure password')
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
    unique: true,
    validate: { isEmail: true }
  },
  salt: {
    type: Sequelize.STRING,
    allowNull: false
  },
  passwordHash: {
    type: Sequelize.STRING,
    allowNull: false
  },
  access: {
    type: Sequelize.JSONB
  },
  profile: {
    type: Sequelize.JSONB
  }
}, {
  sequelize,
  modelName: 'user'
})

module.exports = User
