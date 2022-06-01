import { createConnection } from 'typeorm'
import * as entities from './models'

class TypeOrmDatabase {
  constructor (private readonly url: string) {}

  async connect (): Promise<void> {
    await createConnection({
      type: 'postgres',
      url: this.url,
      entities: Object.keys(entities).map(key => entities[key]),
      logging: true,
      ssl: false
    })
  }
}

export default new TypeOrmDatabase(process.env.DATABASE_STRING)
