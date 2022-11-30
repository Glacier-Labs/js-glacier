import { JSONSchema7Definition } from 'json-schema'

import GlacierClient from './GlacierClient'
import Namespace from './Namespace'
import Collection from './Collection'
import type { InsertResult } from '../types'

export default class Dataset {
  private client: GlacierClient
  private namespace: Namespace
  name: string

  constructor(client: GlacierClient, namespace: Namespace, name: string) {
    this.client = client
    this.namespace = namespace
    this.name = name
  }

  collection<T = any>(name: string) {
    return new Collection<T>(this.client, this.namespace, this, name)
  }

  createCollection(name: string, schema: JSONSchema7Definition) {
    const url = '/dataset/createCollection'
    return this.client.send<InsertResult>(url, {
      namespace: this.namespace.name,
      dataset: this.name,
      collection: name,
      schema: JSON.stringify(schema)
    })
  }
}
