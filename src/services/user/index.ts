import { UserInputError } from 'apollo-server'

import Services from '../'
import { login } from '../../dto'
// import { UserQuery } from '../../data/query'
import { Hash, Jwt } from '../../frameworks'
import { loginValidator } from './validators'

class UserServices extends Services {
  async login (input: login): Promise<string> {
    await this.gateway({
      req: input,
      schema: loginValidator
    })

    const [{ firstName, lastName, id, password }, permissions] = await new Promise((resolve) => resolve([{
      firstName: '',
      lastName: '',
      id: '',
      password: ''
    }, []]))

    if (!await Hash.verifyPassword(password, input.password)) {
      throw new UserInputError('invalid password')
    }

    const token = Jwt.sign(id, firstName, lastName, permissions)

    return token
  }
};

export default new UserServices()
