import { gql } from 'apollo-server'

import UserServices from '../../../services/user'
import { login } from '../../../dto'

const typeDefs = gql`
type User {
  id: ID!
  createdAt: String!
  updatedAt: String!
  isDeleted: Boolean!
  firstName: String!
  lastName: String!
  birthDate: String
  email: String
  phone: String
}

input Login {
  login: String!
  password: String!
}

extend type Query {
  login(input: Login!): String
}
`

export default {
  resolvers: {
    Query: {
      login: async (
        root: any,
        { input }: { input: login }
      ) => await UserServices.login(input)
    }
  },
  typeDefs: [typeDefs]
}
