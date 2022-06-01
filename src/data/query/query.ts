import { UserInputError } from 'apollo-server'
import moment from 'moment'
import Data from '..'

class Query {
  private readonly selectFields: string[]
  private readonly uniqueFields: string[]

  constructor (
    private readonly entity: string,
    selectFields?: string[]
  ) {
    const uniques = []

    if (selectFields) {
      const fieldNames = selectFields.map(f => {
        if (f.length > 7) {
          const unique = f.slice(0, 7)

          if (unique === 'unique ') {
            const field = f.slice(7)

            uniques.push(field)

            return this.transformCamelCase(field)
          }
        }

        return this.transformCamelCase(f)
      })

      this.selectFields = fieldNames
    } else { this.selectFields = ['*'] }

    this.uniqueFields = uniques
  }

  protected transformCamelCase (field: string): string {
    switch (field) {
      case 'createdAt':
        return 'created_at'

      case 'updatedAt':
        return 'updated_at'

      case 'isDeleted':
        return 'is_deleted'

      default:
        return field
    }
  }

  protected whereBuilder (
    where: { [k: string]: any } |
    Array<{ [k: string]: any }>
  ): string {
    let query = ''

    if (Array.isArray(where)) {
      where.forEach(w => { query += `(${this.whereBuilder(w)}) OR ` })

      query = query.slice(0, -4)
    } else {
      Object.keys(where).forEach((k: string) => {
        let value: string = ''

        if (typeof where[k] === 'boolean') {
          value = where[k] ? 'true' : 'false'
        } else if (where[k]) {
          if (Number.isNaN(where[k])) {
            value = `'${where[k]}'`
          } else { value = `${where[k]}` }
        }

        if (value) { query += `${this.transformCamelCase(k)} = ${value} AND ` }
      })

      if (query) { query = query.slice(0, -5) }
    }

    return query
  }

  protected commaBuilder (fields: string[]): string {
    let query = ''

    fields.forEach(f => {
      query += `${this.transformCamelCase(f)}, `
    })

    if (query.length) { query = query.slice(0, -2) }

    return query
  }

  protected setBuilder (fields: { [k: string]: string | number | boolean }): string {
    let query = ''

    Object.keys(fields).forEach((k: string) => {
      let value = ''

      if (typeof fields[k] === 'boolean') {
        value = fields[k] ? 'true' : 'false'
      } else if (fields[k]) {
        if (Number.isNaN(fields[k])) {
          value = `'${fields[k]}'`
        } else { value = `${fields[k]}` }
      }

      if (value) { query += `${this.transformCamelCase(k)} = ${value}, ` }
    })

    if (query) { query = query.slice(0, -2) }

    return query
  }

  async getOne<T>(fields: Partial<T>): Promise<T> {
    let query = `SELECT ${this.commaBuilder(this.selectFields)} FROM ${this.entity}`

    if (Object.keys(fields).length) {
      query += ` WHERE ${this.whereBuilder(fields)}`
    }

    query += ' LIMIT 1'

    const record = await Data.query<T>(query)

    if (!record.length) { throw new UserInputError('Item not found') }

    return record[0]
  }

  async getMany<T>(
    { fields, take, skip, order, direction, group }:
    {
      fields?: Array<Partial<T>>
      take?: number
      skip?: number
      group?: string[]
      order?: string
      direction?: 'ASC' | 'DESC'
    }
  ): Promise<T[]> {
    let query = 'SELECT '

    if (group?.length) {
      query += `${this.commaBuilder(group)} FROM ${this.entity} GROUP BY ${this.commaBuilder(group)}`
    } else {
      query += `${this.commaBuilder(this.selectFields)} FROM ${this.entity}`
    }

    if (fields?.length) { query += ` WHERE ${this.whereBuilder(fields)}` }
    if (order && direction) { query += ` ORDER BY ${this.transformCamelCase(order)} ${direction}` }
    if (skip) { query += ` OFFSET ${skip}` }
    if (take) { query += ` LIMIT ${take}` }

    const records = await Data.query<T>(query)

    return records
  }

  async update<T>(id: string, fields: Partial<T>): Promise<void> {
    await this.getOne({ id })

    const updatedAt = moment().toISOString()

    const query =
      `UPDATE ${this.entity} ` +
      `SET ${this.setBuilder({ ...fields, updatedAt })} ` +
      `WHERE id = '${id}'`

    await Data.query(query)
  }

  async delete (id: string): Promise<void> {
    await this.getOne({ id })

    const updatedAt = moment().toISOString()

    const query =
      `UPDATE ${this.entity} ` +
      `SET ${this.setBuilder({ isDeleted: true, updatedAt })} ` +
      `WHERE id = '${id}'`

    await Data.query(query)
  }

  async create<T>(record: T): Promise<void> {
    const prevRecord = await Data.query<T>(
      `SELECT * FROM ${this.entity} ` +
      `WHERE ${this.whereBuilder(
        this.uniqueFields.map(f => ({
          [f]: record[f]
        }))
      )}`
    )

    if (prevRecord.length) { throw new UserInputError('Unique fields constraint') }

    const keys = Object.keys(record)

    let query =
      `INSERT INTO ${this.entity} ` +
      `(${this.commaBuilder(keys)} VALUES (`

    keys.forEach(k => {
      let value = ''

      if (typeof record[k] === 'boolean') {
        value = record[k] ? 'true' : 'false'
      } else if (record[k]) {
        if (Number.isNaN(record[k])) {
          value = `'${record[k]}'`
        } else { value = `${record[k]}` }
      }

      query += `${value}, `
    })

    query = query.slice(0, -2)

    query += ')'

    await Data.query(query)
  }
}

export default Query
