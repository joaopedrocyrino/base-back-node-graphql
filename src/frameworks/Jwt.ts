import 'dotenv/config'
import jwt from 'jsonwebtoken'

class Jwt {
  sign (
    id: string,
    permissions: string[],
    expiresIn?: number
  ): string {
    const token = jwt.sign(
      {
        id,
        permissions
      },
      process.env.JWT_SECRET,
      { expiresIn: `${expiresIn || 12}h` }
    )

    return token
  }

  async decode (token: string): Promise<{ error: boolean, permissions: string[], id?: string }> {
    let permissions: string[] = []
    let id: string | undefined
    let error: boolean | undefined

    await new Promise<void>((resolve) => {
      jwt.verify(token, process.env.JWT_SECRET, (
        err,
        decoded: { id: string, permissions: string[] }
      ) => {
        if (err) { error = true } else {
          permissions = decoded.permissions
          id = decoded.id
        }
        resolve()
      })
    })

    return { permissions, error, id }
  }
}

export default new Jwt()
