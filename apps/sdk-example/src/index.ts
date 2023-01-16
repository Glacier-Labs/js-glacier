import { GlacierClient } from '@glacier-network/client'

interface RecordItem {
  title: string
  content: string
  createdAt?: number
  updatedAt?: number
}

const NamespaceName = 'myproject6'
const DatasetName = 'testdb1'
const CollectionName = 'records'
const account = '0xB4c42d4B15AA65F782B81ac01Eaba2472F83B4e9'
const privateKey = `0x687dfbefd249231dbae611546b4800cb9833482adc5c9e35993333e366924120`
const client = new GlacierClient('https://p0.onebitdev.com/glacier-gateway', {
  privateKey
})

const myNamespace = client.namespace(NamespaceName)
const myDataset = myNamespace.dataset(DatasetName)
const myCollection = myDataset.collection<RecordItem>(CollectionName)

async function createNamespace() {
  const result = await client.createNamespace(NamespaceName)
  console.log(result)
}

async function namespaces() {
  const result = await client.namespaces(account)
  console.log(result)
}

async function createDataset() {
  const result = await myNamespace.createDataset(DatasetName)
  console.log(result)
}

async function queryDataset() {
  const result = await myNamespace.queryDataset(DatasetName)
  console.log(result)
}

async function createCollection() {
  const result = await client
    .namespace(NamespaceName)
    .dataset(DatasetName)
    .createCollection(CollectionName, {
      title: 'Records',
      type: 'object',
      properties: {
        title: {
          type: 'string',
          maxLength: 200
        },
        content: {
          type: 'string',
          maxLength: 5000
        },
        createdAt: {
          type: 'number'
        },
        updatedAt: {
          type: 'number'
        }
      },
      required: ['title', 'content']
    })
  console.log(result)
}

async function insertOne() {
  for (let i = 0; i < 2; i++) {
    const now = Date.now()
    const result = await myCollection.insertOne({
      title: `test title ${i + 1}`,
      content: `test content ${i + 1}`,
      createdAt: now,
      updatedAt: now
    })
    console.log(result)
  }
}

async function find() {
  const result = await myCollection
    .find({
      createdAt: {
        $gt: 1668149554498
      }
    })
    .sort({
      createdAt: -1
    })
    .skip(0)
    .limit(5)
    .toArray()
  console.log(result)
}

async function updateOne() {
  const now = Date.now()
  const doc = await myCollection.find({}).limit(1).toArray()
  console.log(doc[0])
  const _id = doc[0]._id
  const result = await myCollection.updateOne(
    {
      _id
    },
    {
      updatedAt: now
    }
  )
  console.log(result)
}

async function deleteOne() {
  const result = await myCollection.deleteOne({
    _id: '1'
  })
  console.log(result)
}

createNamespace()
