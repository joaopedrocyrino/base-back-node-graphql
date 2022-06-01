import 'dotenv/config'
import jwt from 'jsonwebtoken'

import { token } from '../dto'

class Jwt {
  sign (userId: string, firstName: string, lastName: string, permissions: token, expiresIn?: number): string {
    const token = jwt.sign({ userId, firstName, lastName, permissions }, process.env.JWT_SECRET, { expiresIn: `${expiresIn || 12}h` })
    return token
  }

  async decode (token: string): Promise<{ error: boolean, permissions: token, userId?: string, lastName?: string, firstName?: string }> {
    let permissions: token = {}
    let userId: string | undefined
    let firstName: string | undefined
    let lastName: string | undefined
    let error: boolean | undefined

    await new Promise<void>((resolve) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded: { userId: string, firstName: string, lastName: string, permissions: token }) => {
        if (err) { error = true } else {
          permissions = decoded.permissions
          userId = decoded.userId
          firstName = decoded.firstName
          lastName = decoded.lastName
        }
        resolve()
      })
    })

    return { permissions, error, userId, lastName, firstName }
  }
}

export default new Jwt()
