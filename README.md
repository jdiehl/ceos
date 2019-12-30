# CEOS

Opinionated graphql server based on apollo-server and sequelize


## Assumptions

1. All communication between client and server is done via GraphQL
2. All configuration is done with environment variables
3. User authentication is done via email and password
4. Sequelize is used with a PostGRES database


## Usage

1. Add `ceos` to your project
2. Set up the environment variables (e.g. with `dotenv`)
3. Add you extensions
4. Start the server (see below)


## Configuration Variables

* `PORT`: The listening port of the server
* `DB`: Connection string for sequelize (e.g., `postgres://postgres@[SERVER]:5432/[DATABASE]`)
* `DB_POOL`: Pool size for sequelize
* `ADMIN_TOKEN`: Bearer Token for admin access
* `JWT_SECRET`: Secret used to encrypt JSON Web Token (use a random string here)
* `JWT_EXPIRES`: Expiry time of the JSON Web Token (see [jsonwebtoken documentation](https://github.com/auth0/node-jsonwebtoken#readme) for details)
* `EXTENSIONS`: Specify which extensions to load
* `CALENDAR_STATE`: `holiday-de` state to use for determining holidays


## Built-in Extensions

* `user`: users table with signup and login

## Add Your Extensions

Extensions are comprised of four modules:

* `mutations`: Exposed graphql Mutation functions
* `queries`: Exposed graphql Query functions
* `typeDefs`: Exposed graphql type definitions (extend Query and Mutation as appropriate)
* `middleware`: Function that changes the `apollo-server` context object
* Optional: a sequelize model definition

### Model Definition

```js
const { Sequelize, sequelize } = require('ceos/sequelize')

class User extends Sequelize.Model {
  ...
}

User.init({ ... }, { sequelize })

exports.User = User
```

Refer to the [Sequelize documentation](https://sequelize.org/master/manual/models-definition.html) for details.

## Start The Server

```js
require('dotenv').config()

const { serve } = require('ceos/server')
const pkg = require('./package.json')
const extension = require('./extension')

// require all schema extensions to initialize them
use(extension)

serve().then(
  server => console.log(`${pkg.name} v${pkg.version} listening at ${url}`),
  error => console.error(error)
)
```

## Notes

Ceos is a son of Apollo and namegiver of the island of Ceos.
