const apollo = require('apollo-server')
const { each, getEnv } = require('./util')
const extensions = require('./extensions')

const PORT = getEnv('PORT', 'int')
const EXTENSIONS = getEnv('EXTENSIONS', 'array')

// NotFound Error
class NotFoundError extends apollo.ApolloError {
  constructor(message = 'Not found') {
    super(message, 404)
  }
}

// apollo settings
const middlewares = []
const resolvers = { Query: {}, Mutation: {} }
const typeDefs = []

// apollo context function
function context(params) {
  const context = {}
  for (const middleware of middlewares) {
    middleware(params, context)
  }
  return context
}

// extend the ceos server
function use(extension) {
  if (extension instanceof Array) {
    return extension.forEach(use)
  }
  if (extension.middleware) middlewares.push(extension.middleware)
  if (extension.resolvers) {
    for (const key of Object.keys(extension.resolvers)) {
      resolvers[key] = Object.assign(resolvers[key] || {}, extension.resolvers[key])
    }
  }
  if (extension.queries) Object.assign(resolvers.Query, extension.queries)
  if (extension.mutations) Object.assign(resolvers.Mutation, extension.mutations)
  if (extension.typeDefs) typeDefs.push(extension.typeDefs)
}

// install standard extensions (core first)
use(extensions.core)
for (const key of EXTENSIONS) {
  if (!extensions[key]) throw new Error(`Invalid extension ${key}`)
  use(extensions[key])
}

// start the apollo server
async function serve() {
  const server = new apollo.ApolloServer({ typeDefs, resolvers, context })
  return server.listen(PORT, '0.0.0.0')
}

module.exports = {
  apollo,
  gql: apollo.gql,
  ApolloError: apollo.ApolloError,
  SyntaxError: apollo.SyntaxError,
  ValidationError: apollo.ValidationError,
  AuthenticationError: apollo.AuthenticationError,
  ForbiddenError: apollo.ForbiddenError,
  UserInputError: apollo.UserInputError,
  NotFoundError,
  use,
  serve
}
