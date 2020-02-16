const { gql } = require('apollo-server-express')

module.exports = gql`
scalar Date
scalar Time
scalar DateTime
scalar ID

type Query {
  ping: Boolean
}

type Mutation {
  reset(force: Boolean!): Boolean
}
`
