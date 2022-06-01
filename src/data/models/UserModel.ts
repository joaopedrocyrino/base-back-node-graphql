import { Column, Entity } from 'typeorm'
import BaseModel from './BaseModel'

@Entity('user')
export default class UserModel extends BaseModel {
  @Column({ unique: true })
  login: string

  @Column({ select: false })
  password: string

  @Column({ name: 'first_name' })
  firstName: string

  @Column({ name: 'last_name' })
  lastName: string

  @Column({ name: 'birth_date' })
  birthDate: string | null

  @Column()
  phone: string | null

  @Column()
  email: string | null

  constructor (init: Partial<UserModel>) {
    super()
    Object.assign(this, init)
  }
}
