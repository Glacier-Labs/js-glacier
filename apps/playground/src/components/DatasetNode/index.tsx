import classnames from 'classnames'
import { observer } from 'mobx-react'
import {
  IconRight,
  IconStorage,
  IconFile,
  IconMore,
  IconLoading
} from '@arco-design/web-react/icon'

import styles from './style.module.scss'
import { useStore } from '@libs/store'
import { useMemo } from 'react'
import { Dropdown, Empty, Menu } from '@arco-design/web-react'
import * as modals from '@libs/modals'

interface Props {
  dataset: string
  onMenuClick: (action: 'createCollection') => void
}

const DatasetNode = observer(({ dataset, onMenuClick }: Props) => {
  const store = useStore()

  const node = useMemo(() => {
    return store.tree[store.currentSpace][dataset]
  }, [dataset, store.currentSpace, store.tree])

  const rootIcon = () => {
    if (node.loading) return <IconLoading className={styles.icon} />
    return (
      <IconRight
        className={classnames(styles.icon, {
          [styles.expanded]: node.expanded
        })}
      />
    )
  }

  return (
    <div className={styles.wrap}>
      <div
        className={classnames(styles.row, styles.head)}
        onClick={() => store.toggleExpand(dataset)}
      >
        {rootIcon()}
        <IconStorage className={classnames(styles.icon, styles.storage)} />
        <span className={styles.text}>{dataset}</span>
        <Dropdown
          trigger="click"
          droplist={
            <Menu
              onClickMenuItem={(key, e: MouseEvent) => {
                e.stopPropagation()
                onMenuClick(key as any)
              }}
            >
              <Menu.Item key="createCollection">Create Collection...</Menu.Item>
            </Menu>
          }
        >
          <IconMore
            className={styles.icon}
            onClick={e => e.stopPropagation()}
          />
        </Dropdown>
      </div>
      <div
        className={classnames(styles.children, {
          [styles.expanded]: node.expanded
        })}
      >
        {node.collections.length === 0 && <Empty />}
        {node.collections.map((item, i) => (
          <div
            className={classnames(styles.row, {
              [styles.active]:
                store.activeTabInfo &&
                store.activeTabInfo.namespace === store.currentSpace &&
                store.activeTabInfo.dataset === dataset &&
                store.activeTabInfo.collection === item
            })}
            key={i}
          >
            <IconFile className={classnames(styles.icon, styles.collection)} />
            <span
              className={styles.text}
              onClick={() => {
                store.openTab({
                  namespace: store.currentSpace,
                  dataset,
                  collection: item
                })
              }}
            >
              {item.collection}
            </span>
            <Dropdown
              trigger="click"
              droplist={
                <Menu>
                  <Menu.Item
                    key="insert"
                    onClick={() =>
                      modals.editDocument(store.currentSpace, dataset, item)
                    }
                  >
                    Insert Document...
                  </Menu.Item>
                </Menu>
              }
            >
              <IconMore className={styles.icon} />
            </Dropdown>
          </div>
        ))}
      </div>
    </div>
  )
})

export default DatasetNode
