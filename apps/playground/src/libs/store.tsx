import { createContext, PropsWithChildren, useContext } from 'react'
import { makeAutoObservable } from 'mobx'
import { useLocalObservable } from 'mobx-react'
import { GlacierClient, JSONSchema7Definition } from '@glacier-network/client'

import WalletModal from '@components/WalletModal'

interface DatesetNode {
  collections: string[]
  loading: boolean
  loaded: boolean
  expanded: boolean
}

interface DatesetNodes {
  [dataset: string]: DatesetNode
}

interface SpaceTree {
  [space: string]: DatesetNodes
}

export interface TabItem {
  namespace: string
  dataset: string
  collection: string
  ref?: {
    refresh: () => void
  }
}

class Store {
  walltVisible = false
  endpoint = ''
  currentSpace = ''
  activeTab = 0
  tree: SpaceTree = {}
  tabs: TabItem[] = []
  client: GlacierClient | undefined

  get activeTabInfo() {
    if (this.activeTab >= this.tabs.length) return undefined
    return this.tabs[this.activeTab]
  }

  get spaces() {
    return Object.keys(this.tree).sort()
  }

  get datasets() {
    if (!this.currentSpace) return []
    const space = this.tree[this.currentSpace]
    return Object.keys(space).sort()
  }

  async connect(endpoint: string, account: string, signer: any) {
    this.client = new GlacierClient(endpoint, {
      signer
    })
    const spaces = await this.client.namespaces(account)
    const nodes: SpaceTree = {}
    for (const space of spaces) {
      const sets: DatesetNodes = {}
      for (const item of space.dataset) {
        sets[item] = {
          collections: [],
          loading: false,
          loaded: false,
          expanded: false
        }
      }
      nodes[space.namespace] = sets
    }
    this.tree = nodes
    this.currentSpace = this.spaces[0] || ''
    this.setEndpoint(endpoint)
  }

  async toggleExpand(dataset: string) {
    const node = this.tree[this.currentSpace][dataset]
    if (node.loaded === true) {
      node.expanded = !node.expanded
      return
    }
    if (node.expanded === false) {
      try {
        node.loading = true
        const space = this.client?.namespace(this.currentSpace)
        const result = await space?.queryDataset(dataset)
        const collections = result?.collections || []
        node.collections = collections.map(item => item.collection)
        node.loaded = true
      } catch (error) {
      } finally {
        node.expanded = true
        node.loading = false
      }
    } else {
      node.expanded = false
    }
  }

  async createNamespace(name: string) {
    const result = await this.client!.createNamespace(name)
    this.tree[result.insertedId] = {}
    this.currentSpace = result.insertedId
  }

  async createDataset(name: string) {
    const space = this.client!.namespace(this.currentSpace)
    const result = await space.createDataset(name)
    this.tree[this.currentSpace][result.insertedId] = {
      collections: [],
      loading: false,
      loaded: false,
      expanded: false
    }
  }

  async createCollection(
    dataset: string,
    name: string,
    schema: JSONSchema7Definition
  ) {
    const set = this.client!.namespace(this.currentSpace).dataset(dataset)
    const result = await set.createCollection(name, schema)
    const node = this.tree[this.currentSpace][dataset]
    node.collections.push(result.insertedId)
    node.loaded = true
    node.expanded = true
  }

  async insertDocument(
    space: string,
    dataset: string,
    collection: string,
    doc: any
  ) {
    const target = this.client!.namespace(space)
      .dataset(dataset)
      .collection(collection)
    const result = await target.insertOne(doc)
    return result
  }

  async updateDocument(
    space: string,
    dataset: string,
    collection: string,
    _id: string,
    doc: any
  ) {
    const target = this.client!.namespace(space)
      .dataset(dataset)
      .collection(collection)
    const result = await target.updateOne(
      {
        _id
      },
      doc
    )
    return result
  }

  async deleteDocument(
    space: string,
    dataset: string,
    collection: string,
    _id: string
  ) {
    const target = this.client!.namespace(space)
      .dataset(dataset)
      .collection(collection)
    const result = await target.deleteOne({
      _id
    })
    return result
  }

  openTab(tab: TabItem) {
    const index = this.tabs.findIndex(
      item =>
        item.namespace === tab.namespace &&
        item.dataset === tab.dataset &&
        item.collection === tab.collection
    )
    if (index > -1) this.activeTab = index
    else {
      this.tabs.push(tab)
      this.activeTab = this.tabs.length - 1
    }
  }

  closeTab(index: number) {
    this.tabs.splice(index, 1)
    this.activeTab = this.tabs.length - 1
  }

  setEndpoint(endpoint: string) {
    this.endpoint = endpoint
  }

  setCurrentSpace(space: string) {
    this.currentSpace = space
  }

  setActiveTab(index: number) {
    this.activeTab = index
  }

  constructor() {
    makeAutoObservable(this)
  }
}

const store = new Store()
const context = createContext(store)

export const StoreProvider = (props: PropsWithChildren) => {
  const state = useLocalObservable(() => store)
  return (
    <context.Provider value={state}>
      {props.children}
      <WalletModal
        visible={state.walltVisible}
        onClose={() => (state.walltVisible = false)}
      />
    </context.Provider>
  )
}

export const useStore = () => {
  return useContext(context)
}
