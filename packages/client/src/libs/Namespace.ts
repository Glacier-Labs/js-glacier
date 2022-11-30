import GlacierClient from './GlacierClient'
import Dataset from './Dataset'
import type { InsertResult, DatasetRecord } from '../types'

export default class Namespace {
  private client: GlacierClient
  name: string

  constructor(client: GlacierClient, name: string) {
    this.client = client
    this.name = name
  }

  dataset(name: string) {
    return new Dataset(this.client, this, name)
  }

  createDataset(name: string) {
    const url = '/dataset/createDataset'
    return this.client.send<InsertResult>(url, {
      namespace: this.name,
      dataset: name
    })
  }

  queryDataset(name: string) {
    const url = '/dataset/queryDataset'
    return this.client.gateway.send<DatasetRecord>(url, {
      namespace: this.name,
      dataset: name
    })
  }
}
