import GlacierClient from './GlacierClient'
import Namespace from './Namespace'
import Dataset from './Dataset'
import Collection from './Collection'
import type { WithId, Filter } from '../types'

type SortDirection = 1 | -1
type Sort<T> = Partial<{
  [key in keyof T]: SortDirection
}>

export default class FindCursor<TSchema = any> {
  private client: GlacierClient
  private space: Namespace
  private dataset: Dataset
  private collection: Collection<TSchema>
  private filterValue: Filter<TSchema> = {}
  private sortValue: Sort<TSchema>
  private skipValue: number
  private limitValue: number

  constructor(
    client: GlacierClient,
    space: Namespace,
    dataset: Dataset,
    collection: Collection<TSchema>,
    filter?: Filter<TSchema>
  ) {
    this.client = client
    this.space = space
    this.dataset = dataset
    this.collection = collection
    this.filterValue = filter || {}
  }

  sort(value: Sort<WithId<TSchema>>) {
    this.sortValue = value
    return this
  }

  skip(value: number) {
    this.skipValue = value
    return this
  }

  limit(value: number) {
    this.limitValue = value
    return this
  }

  async toArray() {
    const url = '/action/find'
    const payload: any = {
      namespace: this.space.name,
      dataset: this.dataset.name,
      collection: this.collection.name,
      filter: this.filterValue
    }
    if (this.sortValue) payload.sort = this.sortValue
    if (this.skipValue !== undefined) payload.skip = this.skipValue
    if (this.limitValue !== undefined) payload.limit = this.limitValue
    const result = await this.client.gateway.send<{
      documents: WithId<TSchema>[]
    }>(url, payload)
    return result.documents || []
  }
}
