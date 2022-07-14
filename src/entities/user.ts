import Base from './base'

class User extends Base {
  username: string
  password: string

  constructor ({ username, password, ...init }: Partial<User>) {
    super(init)
    Object.assign(this, { username, password })
  }
}

export default User
