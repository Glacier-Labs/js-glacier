import classNames from 'classnames'
import { observer } from 'mobx-react'
import { IconClose, IconFile } from '@arco-design/web-react/icon'

import styles from './style.module.scss'
import Document from '@pages/Document'
import { useStore } from '@libs/store'

const Documents = observer(() => {
  const store = useStore()

  return (
    <div className={styles.wrap}>
      <div className={styles.head}>
        {store.tabs.map((tab, i) => (
          <div
            className={classNames(styles.tab, {
              [styles.active]:
                store.activeTabInfo?.namespace === tab.namespace &&
                store.activeTabInfo?.dataset === tab.dataset &&
                store.activeTabInfo?.collection === tab.collection
            })}
            onClick={() => {
              store.setActiveTab(i)
            }}
            key={`${tab.namespace}/${tab.dataset}/${tab.collection.collection}`}
          >
            <IconFile />
            <span>{tab.collection.collection}</span>
            <IconClose
              onClick={e => {
                e.stopPropagation()
                store.closeTab(i)
              }}
            />
          </div>
        ))}
      </div>
      {store.tabs.map((tab, i) => (
        <Document
          index={i}
          visible={store.activeTab === i}
          key={`${tab.namespace}/${tab.dataset}/${tab.collection.collection}`}
          ref={(ref: any) => (tab.ref = ref)}
        />
      ))}
    </div>
  )
})

export default Documents
