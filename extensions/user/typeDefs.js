const { gql } = require('apollo-server')

module.exports = gql`
type UserRoles {
  admin: Boolean
}

type User {
  id: Int!
  email: String!
  roles: UserRoles
}

type UserAuth {
  token: String!
  expires: String!
  me: User!
}

extend type Query {
  users: [User]
  me: User
}

extend type Mutation {
  signup(email: String!, password: String!): UserAuth
  login(email: String!, password: String!): UserAuth
}
`
