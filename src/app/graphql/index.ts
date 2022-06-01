import { mergeRawSchemas } from './utils/mergeRawSchemas'
import { gql } from 'apollo-server'
import schemaShards from './schemaShards'

export const rawSchema = mergeRawSchemas(
  {
    typeDefs: [
      gql`
        type Query {
          _empty: String
        }

        type Mutation {
          _empty: String
        }

        type Subscription {
          _empty: String
        }
      `
    ],
    resolvers: {}
  },
  schemaShards
)
