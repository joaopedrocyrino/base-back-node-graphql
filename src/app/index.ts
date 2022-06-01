import { ApolloServer, Config } from 'apollo-server'
import { makeExecutableSchema } from 'graphql-tools'
import { rawSchema } from './graphql'

const schema = makeExecutableSchema(rawSchema)

const serverConfig: Config = { schema }

export default new ApolloServer(serverConfig)
