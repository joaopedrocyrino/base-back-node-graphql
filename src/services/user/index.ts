import { ForbiddenError } from 'apollo-server'

import Services from '../'
import { User } from '../../entities'
import { UserQuery } from '../../data/query'
import { Hash, Jwt } from '../../frameworks'
import {
  createUser,
  deleteUser,
  updateUser,
  getOneUser,
  getManyUser,
  login
} from '../../dto'

import {
  createValidator,
  deleteValidator,
  updateValidator,
  getOneValidator,
  getManyValidator,
  loginValidator
} from './validators'

class UserServices extends Services {
  async create (req: createUser): Promise<string> {
    await this.gateway({
      req,
      schema: createValidator
    })

    const base = this.createBase()

    const { password, ...user } = req

    const hash = await Hash.generate(password)

    delete req.password

    await UserQuery.create<User>({ ...base, ...user, password: hash })

    return base.id
  }

  async delete ({ token, ...req }: deleteUser): Promise<string> {
    await this.gateway({
      schema: deleteValidator,
      token,
      req
    })

    await UserQuery.delete(req.id)

    return req.id
  }

  async update ({ token, ...req }: updateUser): Promise<string> {
    await this.gateway({
      schema: updateValidator,
      token,
      req
    })

    const { id, ...fields } = req

    await UserQuery.update<User>(id, fields)

    return id
  }

  async getOne ({ token, ...req }: getOneUser): Promise<User> {
    await this.gateway({
      schema: getOneValidator,
      token,
      req
    })

    const user = await UserQuery.getOne<User>(req)

    return user
  }

  async getMany ({ token, ...req }: getManyUser): Promise<User[]> {
    await this.gateway({
      schema: getManyValidator,
      token,
      req
    })

    const users = await UserQuery.getMany<User>(req)

    return users
  }

  async login (req: login): Promise<string> {
    await this.gateway({
      schema: loginValidator,
      req
    })

    const user = await UserQuery.login(req)

    const isValid = await Hash.verify(user[0].password, req.password)

    delete req.password

    if (!isValid) { throw new ForbiddenError('Incorrect password') }

    const token = Jwt.sign(user.id, [])

    return token
  }
};

export default new UserServices()
