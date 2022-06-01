import { v4 } from 'uuid'

class Uuid {
  generate (): string {
    return v4()
  }
}

export default new Uuid()
