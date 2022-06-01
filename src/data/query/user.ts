import { UserInputError } from 'apollo-server'

import { UserModel } from '../models'

class UserQuery {
  async getOne (id: string): Promise<UserModel> {
    const user = await UserModel.findOne({ id, isDeleted: false })
    if (!user) { throw new UserInputError('User not found') }

    return user
  }
}

export default new UserQuery()
