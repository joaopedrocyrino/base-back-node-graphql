import * as argon2 from 'argon2'

class Hash {
  async setPassword (password: string): Promise<string> {
    const pass = await argon2.hash(password, {
      type: argon2.argon2id
    })
    return pass
  }

  async verifyPassword (userHashedPassword: string, password: string): Promise<boolean> {
    const isValid = await argon2.verify(userHashedPassword, password, {
      type: argon2.argon2id
    })
    return isValid
  }
}

export default new Hash()
