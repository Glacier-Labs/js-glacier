import { observer } from 'mobx-react'
import { Select, Button, Dropdown, Menu } from '@arco-design/web-react'
import { IconPlus, IconFolder, IconMore } from '@arco-design/web-react/icon'

import styles from './style.module.scss'
import { useStore } from '@libs/store'
import Documents from '@pages/Documents'
import DatasetNode from '@components/DatasetNode'
import * as modals from '@libs/modals'

const Main = observer(() => {
  const store = useStore()

  return (
    <>
      <div className={styles.left}>
        <Button
          type="primary"
          icon={<IconPlus />}
          long
          onClick={() => modals.createNamespace()}
        >
          Create Namespace
        </Button>
        <div className={styles.row}>
          <Select
            value={store.currentSpace}
            onChange={value => store.setCurrentSpace(value)}
            style={{ flex: 1 }}
          >
            {store.spaces.map((item, i) => (
              <Select.Option value={item} key={i}>
                <IconFolder className={styles.icon} /> {item}
              </Select.Option>
            ))}
          </Select>
          <Dropdown
            trigger="click"
            droplist={
              <Menu>
                <Menu.Item
                  key="create"
                  onClick={() => {
                    modals.createDataset()
                  }}
                >
                  Create Dataset...
                </Menu.Item>
              </Menu>
            }
          >
            <Button icon={<IconMore />} />
          </Dropdown>
        </div>
        <div>
          {store.datasets.map((item, i) => (
            <DatasetNode
              dataset={item}
              key={i}
              onMenuClick={action => {
                if (action === 'createCollection') {
                  modals.createCollection(item)
                }
              }}
            />
          ))}
        </div>
      </div>
      <div className={styles.main}>
        {store.tabs.length > 0 && <Documents />}
      </div>
    </>
  )
})

export default Main
