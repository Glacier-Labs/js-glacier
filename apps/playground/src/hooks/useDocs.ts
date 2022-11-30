import { useState, useCallback, useMemo } from 'react'

import { useStore } from '@libs/store'
import { Message } from '@arco-design/web-react'

export default function useDocs(
  namespace: string,
  dataset: string,
  collection: string
) {
  const store = useStore()
  const [loading, setLoading] = useState(false)
  const [docs, setDocs] = useState<Record<string, any>[]>([])

  const collectionObj = useMemo(() => {
    return store
      .client!.namespace(namespace)
      .dataset(dataset)
      .collection(collection)
  }, [namespace, dataset, collection, store.client])

  const list = useCallback(async (cmd: string) => {
    const handle = Message.loading({
      content: 'Loading...',
      duration: 0
    })
    try {
      setLoading(true)
      if (cmd.startsWith('find') === false)  {
        throw new Error('Invlaid Expression')
      }
      // eslint-disable-next-line no-new-func
      const find = new Function('collectionObj', `return collectionObj.${cmd}.toArray()`)
      const items = await find(collectionObj)
      setDocs(items)
    } catch(error: any) {
      Message.error(error.message || 'Network Error')
    } finally {
      setLoading(false)
      handle()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionObj])

  return {
    docs,
    loading,
    list
  }
}
