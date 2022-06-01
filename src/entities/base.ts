class Base {
  id: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean

  constructor ({
    created_at,
    updated_at,
    is_deleted,
    ...init
  }: Partial<Base> & {
    created_at?: string
    updated_at?: string
    is_deleted?: boolean
  }) {
    Object.assign(this, init)

    if (created_at) { this.createdAt = created_at }
    if (updated_at) { this.updatedAt = updated_at }
    if (is_deleted) { this.isDeleted = is_deleted }
  }
}

export default Base
