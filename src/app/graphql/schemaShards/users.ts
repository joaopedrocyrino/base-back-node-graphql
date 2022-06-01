import { gql } from 'apollo-server'

import UserServices from '../../../services/user'
import {
  createUser,
  deleteUser,
  getOneUser,
  getManyUser,
  updateUser,
  login
} from '../../../dto'

const typeDefs = gql`
type User {
  id: ID
  username: String
  createdAt: String
  updatedAt: String
  isDeleted: Boolean
}

input CreateUser {
  username: String!
  password: String!
}

input DeleteUser {
  id: ID!
  token: String!
}

input UpdateUser {
  id: ID!
  userame: String
  token: String!
}

input GetOneUser {
  id: ID
  username: String
  token: String!
}

input GetManyUser {
  fields: [User]
  take: Int
  skip: Int
  order: String
  direction: String
  group: [String]
  token: String!
}

input Login {
  username: String!
  password: String!
}

extend type Mutation {
  createUser(input: CreateUser!): String!
  deleteUser(input: DeleteUser!): String!
  updateUser(input: UpdateUser!): String!
}

extend type Query {
  getOneUser(input: GetOneUser!): User!
  getManyUser(input: GetManyUser!): [User]!
  login(input: Login!): String!
}
`

export default {
  resolvers: {
    Mutation: {
      createUser: async (root: any, { input }: { input: createUser }) =>
        await UserServices.create(input),
      deleteUser: async (root: any, { input }: { input: deleteUser }) =>
        await UserServices.delete(input),
      updateUser: async (root: any, { input }: { input: updateUser }) =>
        await UserServices.update(input)
    },
    Query: {
      getOneUser: async (root: any, { input }: { input: getOneUser }) =>
        await UserServices.getOne(input),
      getManyUser: async (root: any, { input }: { input: getManyUser }) =>
        await UserServices.getMany(input),
      login: async (root: any, { input }: { input: login }) =>
        await UserServices.login(input)
    }
  },
  typeDefs: [typeDefs]
}
