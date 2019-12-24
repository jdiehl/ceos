const { gql } = require('apollo-server')

module.exports = gql`
type Query {
  ping: Boolean
}

type Mutation {
  reset(force: Boolean!): Boolean
}
`
