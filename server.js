const apollo = require('apollo-server')
const { getEnv } = require('./util')

const PORT = getEnv('PORT', 'int')

const middlewares = []
const resolvers = { Query: {}, Mutation: {} }
const typeDefs = []

function context (params) {
  const context = {}
  for (const middleware of middlewares) {
    middleware(params, context)
  }
  return context
}

// apollo & graphql
exports.apollo = apollo
exports.gql = apollo.gql

// errors
exports.ApolloError = apollo.ApolloError
exports.SyntaxError = apollo.SyntaxError
exports.ValidationError = apollo.ValidationError
exports.AuthenticationError = apollo.AuthenticationError
exports.ForbiddenError = apollo.ForbiddenError
exports.UserInputError = apollo.UserInputError

// add a custom middleware to extend the context
exports.use = (middleware) => {
  middlewares.push(middleware)
}

// extend the schema with Query, Mutation, and typeDefs
exports.extendSchema = (schema) => {
  if (schema.Query) Object.assign(resolvers.Query, schema.Query)
  if (schema.Mutation) Object.assign(resolvers.Mutation, schema.Mutation)
  if (schema.typeDefs) typeDefs.push(schema.typeDefs)
}

// start the apollo server
exports.serve = async () => {
  if (typeDefs.length === 0) throw new Error('Use extendSchema to define the schema before starting the server')
  const server = new apollo.ApolloServer({ typeDefs, resolvers, context })
  return server.listen(PORT, '0.0.0.0')
}
