import { Column, Entity, PrimaryColumn, BaseEntity } from 'typeorm'

@Entity()
export default class BaseModel extends BaseEntity {
  @PrimaryColumn()
  id: string

  @Column({ name: 'is_deleted' })
  isDeleted: boolean

  @Column({ name: 'created_at' })
  createdAt: string

  @Column({ name: 'updated_at' })
  updatedAt: string
}
