export type WithId<T> = T & {
  _id: string
}

export interface InsertResult {
  insertedId: string
}

export interface UpdateResult {
  modifiedCount: number
  matchedCount: number
}

export interface DeleteResult {
  deletedCount: number
}

export interface NamespaceRecord {
  owner: string
  network: string
  namespace: string
  sqpId: number
  dataset: string[]
  createdAt: number
  updatedAt: number
}

export interface CollectionRecord {
  collection: string
  owner: string
  network: string
  schema: string
  sepId: number
  createdAt: number
  updatedAt: number
}

export interface DatasetRecord {
  owner: string
  network: string
  namespace: string
  dataset: string
  sqpId: number
  collections: CollectionRecord[]
  createdAt: number
  updatedAt: number
}

export interface FilterOperators<TValue> {
  $eq?: TValue
  $gt?: TValue
  $gte?: TValue
  $in?: Array<TValue>
  $lt?: TValue
  $lte?: TValue
  $ne?: TValue
  $nin?: Array<TValue>
  $not?: TValue extends string ? FilterOperators<TValue> | RegExp : FilterOperators<TValue>
  $exists?: boolean
  $regexp?: string
}

export type Filter<TSchema> = Partial<WithId<TSchema>> | (Partial<{
  [Property in keyof WithId<TSchema>]: FilterOperators<WithId<TSchema>[Property]> | WithId<TSchema>[Property]
}> & RootFilterOperators<WithId<TSchema>>)

export interface RootFilterOperators<TSchema> {
  $and?: Filter<TSchema>[]
  $nor?: Filter<TSchema>[]
  $or?: Filter<TSchema>[]
  $text?: {
    $search: string
    $language?: string
    $caseSensitive?: boolean
    $diacriticSensitive?: boolean
  }
}
