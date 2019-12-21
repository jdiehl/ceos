# CEOS

Oppiniated graphql server based on apollo-server and sequelize


## Assumptions

1. All communication between client and server is done via GraphQL
2. All configuration is done with environment variables
3. User authentication is done via email and password
4. Sequelize is used with a PostGRES database


## Usage

1. Add `ceos` to your project
2. Set up the environment variables (e.g. with `dotenv`)
3. Define your models (see below)
4. Define your schema extensions (see below)
5. Start the server (see below)


## Configuration Variables

* `PORT`: The listening port of the server
* `DB`: Connection string for sequelize (e.g., `postgres://postgres@[SERVER]:5432/[DATABASE]`)
* `DB_POOL`: Pool size for sequelize
* `ADMIN_TOKEN`: Bearer Token for admin access
* `JWT_SECRET`: Secret used to encrypt JSON Web Token (use a random string here)
* `JWT_EXPIRES`: Expiry time of the JSON Web Token (see [jsonwebtoken documentation](https://github.com/auth0/node-jsonwebtoken#readme) for details)


## Define Your Models

```js
const { Sequelize, sequelize } = require('ceos/sequelize')

class User extends Sequelize.Model {
  ...
}

User.init({ ... }, { sequelize })

exports.User = User
```

Refer to the [Sequelize documentation](https://sequelize.org/master/manual/models-definition.html) for details.


## Define Your Schema Extensions

```js
const { AuthenticationError, gql, extendSchema } = require('ceos/server')
const { User } = require('../models/User')

const Query = {
  users: async (parent, args, context) => {
    return await User.findAll({})
  },
  ...
}

const Mutation = {
  createUser: async (parent, args, context) => {
    if (!context.auth) throw new AuthenticationError('Not authenticated')
    ...
  }
}

const typeDefs = gql`
type User {
  id: Int!
  email: String!
}

type Query {
  users: [User]
}

type Mutation {
  create(email: String!, password: String!): User
}
`

extendSchema({ Query, Mutation, typeDefs })
```

Note that the first imported schema must define Query and Mutation. All others must extend it.


## Start The Server

```js
require('dotenv').config()

const { serve } = require('ceos/server')
const pkg = require('../package.json')

// require all schema extensions to initialize them
require('./schema/...')

serve().then(
  server => console.log(`${pkg.name} v${pkg.version} listening at ${url}`),
  error => console.error(error)
)
```

## Notes

Ceos is a son of Apollo and namegiver of the island of Ceos.
