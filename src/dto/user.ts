import { User } from '../entities'

export interface createUser {
  username: string
  password: string
}

export interface deleteUser {
  id: string
  token: string
}

export interface updateUser {
  id: string
  username?: string
  token: string
}

export interface getOneUser {
  id?: string
  username?: string
  token: string
}

export interface getManyUser {
  fields?: Array<Partial<User>>
  take?: number
  skip?: number
  order?: keyof User
  direction?: 'ASC' | 'DESC'
  group?: Array<keyof User>
  token: string
}

export interface login {
  username: string
  password: string
}
