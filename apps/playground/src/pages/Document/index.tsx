import classNames from 'classnames'
import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useImperativeHandle,
  forwardRef
} from 'react'
import { observer } from 'mobx-react'
import {
  Breadcrumb,
  Input,
  Button,
  Empty,
  Pagination,
  Tooltip
} from '@arco-design/web-react'
import {
  IconFile,
  IconFolder,
  IconPlayArrow,
  IconPlus,
  IconStorage
} from '@arco-design/web-react/icon'

import styles from './style.module.scss'
import useDocs from '@hooks/useDocs'
import DocumentView from '@components/DocumentView'
import { useStore } from '@libs/store'
import * as modals from '@libs/modals'

interface Props {
  index: number
  visible: boolean
}

const DefaultCmd = 'find({}).skip(0).limit(10)'

const Document = observer(
  forwardRef((props: Props, ref) => {
    const store = useStore()

    const tab = useMemo(() => {
      return store.tabs[props.index]
    }, [store.tabs, props.index])

    const { docs, loading, list } = useDocs(
      tab.namespace,
      tab.dataset,
      tab.collection
    )
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(20)
    const [cmd, setCmd] = useState(DefaultCmd)

    const items = useMemo(() => {
      const start = (page - 1) * limit
      return docs.slice(start, start + limit)
    }, [docs, page, limit])

    const refresh = useCallback(() => {
      setCmd(DefaultCmd)
      list(DefaultCmd)
    }, [list])

    useImperativeHandle(ref, () => {
      return {
        refresh
      }
    })

    useEffect(() => {
      list(DefaultCmd)
    }, [list])

    return (
      <div
        className={classNames(styles.wrap, {
          [styles.visible]: props.visible
        })}
      >
        <div className={styles.head}>
          <div className={styles.nav}>
            <Breadcrumb>
              <Breadcrumb.Item className={styles.breadcrumb}>
                <IconFolder className={styles.folder} />
                <span>{tab.namespace}</span>
              </Breadcrumb.Item>
              <Breadcrumb.Item className={styles.breadcrumb}>
                <IconStorage className={styles.storage} />
                <span>{tab.dataset}</span>
              </Breadcrumb.Item>
              <Breadcrumb.Item className={styles.breadcrumb}>
                <IconFile className={styles.file} />
                <span>{tab.collection}</span>
              </Breadcrumb.Item>
            </Breadcrumb>
            <Tooltip content="Insert Document" position="left">
              <Button
                icon={<IconPlus />}
                size="large"
                type="primary"
                onClick={() => {
                  modals.editDocument(
                    tab.namespace,
                    tab.dataset,
                    tab.collection
                  )
                }}
              />
            </Tooltip>
          </div>
          <div className={styles.toolbar}>
            <Input
              prefix={`db.collection("${tab.collection}").`}
              value={cmd}
              size="large"
              onChange={value => setCmd(value)}
            />
            <Tooltip content="Execute Query" position="left">
              <Button
                icon={<IconPlayArrow />}
                type="primary"
                size="large"
                loading={loading}
                onClick={() => list(cmd)}
              />
            </Tooltip>
          </div>
        </div>
        <div className={styles.main}>
          {docs.length === 0 ? (
            <Empty />
          ) : (
            <div>
              {items.map((item, i) => (
                <DocumentView tab={tab} doc={item} key={item._id} />
              ))}
              <div className={styles.footer}>
                <Pagination
                  pageSize={limit}
                  current={page}
                  size="mini"
                  showTotal
                  total={docs.length}
                  sizeOptions={[20, 30, 40, 50]}
                  onChange={(page, size) => {
                    setPage(page)
                    setLimit(size)
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  })
)

export default Document
