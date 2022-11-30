import GlacierClient from './GlacierClient'
import Namespace from './Namespace'
import Dataset from './Dataset'
import FindCursor from './FindCursor'
import type { InsertResult, UpdateResult, DeleteResult, Filter } from '../types'

export default class Collection<TSchema = any> {
  private client: GlacierClient
  private namespace: Namespace
  private dataset: Dataset
  name: string

  constructor(
    client: GlacierClient,
    namespace: Namespace,
    dataset: Dataset,
    name: string
  ) {
    this.client = client
    this.namespace = namespace
    this.dataset = dataset
    this.name = name
  }

  private get info() {
    return {
      namespace: this.namespace.name,
      dataset: this.dataset.name,
      collection: this.name
    }
  }

  insertOne(doc: TSchema) {
    const url = '/action/insertOne'
    return this.client.send<InsertResult>(url, {
      ...this.info,
      document: doc
    })
  }

  updateOne(
    filter: Filter<TSchema>,
    update: Partial<TSchema>
  ) {
    const url = '/action/updateOne'
    return this.client.send<UpdateResult>(url, {
      ...this.info,
      filter,
      update
    })
  }

  deleteOne(filter: Filter<TSchema>) {
    const url = '/action/deleteOne'
    return this.client.send<DeleteResult>(url, {
      ...this.info,
      filter
    })
  }

  find(filter: Filter<TSchema> = {}) {
    return new FindCursor<TSchema>(
      this.client,
      this.namespace,
      this.dataset,
      this,
      filter
    )
  }
}
