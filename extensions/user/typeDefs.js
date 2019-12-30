const { gql } = require('apollo-server')

module.exports = gql`
type UserAccess {
  admin: Boolean
}

type UserProfile {
  name: String
}

type User {
  id: Int!
  email: String!
  name: String!
  access: UserAccess
  profile: UserProfile
}

type UserAuth {
  token: String!
  expires: String!
  me: User!
}

input UserAccessInput {
  admin: Boolean
}

input UserProfileInput {
  name: String
}

input UserInput {
  email: String
  password: String
  access: UserAccessInput
  profile: UserProfileInput
}

extend type Query {
  users: [User]!
  user(id: Int!): User!
  me: User!
}

extend type Mutation {
  signupUser(email: String!, password: String!): UserAuth!
  loginUser(email: String!, password: String!): UserAuth!
  createUser(input: UserInput!): User!
  updateUser(id: Int!, input: UserInput!): User!
  deleteUser(id: Int!): Boolean
}
`
