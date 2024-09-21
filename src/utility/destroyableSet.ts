import { v4 as uuid } from 'uuid'

export const destroyableMap = () => {
  const items = new Map()

  const destroy = (id: string) => {
    items.delete(id)
  }

  const create = (item: unknown) => {
    if (typeof item !== 'function') {
      throw new Error('item must be a function')
    }
    const id = uuid()
    items.set(id, item({ id, destroy }))
  }
  return { create, destroy, items }
}
