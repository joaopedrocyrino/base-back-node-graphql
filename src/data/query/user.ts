import { UserInputError } from 'apollo-server'

import { User } from '../../entities'
import Query from './query'
import Data from '..'

class UserQuery extends Query {
  constructor () {
    super(
      '"user"',
      [
        'unique id',
        'unique username',
        'createdAt',
        'updatedAt',
        'isDeleted'
      ]
    )
  }

  async login (props: { username: string, password: string }): Promise<User> {
    const user = await Data.query<User>(
      `SELECT id, password FROM "user" WHERE username = ${props.username}`
    )

    if (!user.length) { throw new UserInputError('User not found') }

    return user[0]
  }
}

export default new UserQuery()
