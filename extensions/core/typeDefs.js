const { gql } = require('apollo-server-express')

module.exports = gql`
scalar Date
scalar Time
scalar DateTime
scalar ID

type Query {
  ping: Boolean
}

enum MigrateDirection {
  up
  down
}

type Mutation {
  reset(force: Boolean!): Boolean
  migrate(to: String, direction: MigrateDirection): Boolean
}
`
