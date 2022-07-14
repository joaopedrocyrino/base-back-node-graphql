import 'dotenv/config'
import { Pool } from 'pg'

class Data {
  private readonly pools: { [k: string]: Pool } = {}

  init (): void {
    const connections = {
      default: process.env.DATABASE_STRING
    }

    Object.keys(connections).forEach(k => {
      this.pools[k] = new Pool({ connectionString: connections[k] })
    })
  }

  async query<T>(queryString: string, pool?: string): Promise<T[]> {
    const poolKey = pool ?? 'default'

    const client = await this.pools[poolKey].connect()

    const res: { rows: T[] } = await client.query(queryString)

    client.release()

    return res.rows
  }
}

export default new Data()
