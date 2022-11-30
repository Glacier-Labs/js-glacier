import classNames from 'classnames'
import Prismjs from 'prismjs'
import 'prismjs/components/prism-json'
import { observer } from 'mobx-react'
import { useMemo, useState } from 'react'
import { Dropdown, Menu, Message, Modal } from '@arco-design/web-react'
import { IconRight, IconMore, IconCodeBlock } from '@arco-design/web-react/icon'
import 'prismjs/themes/prism-okaidia.css'

import styles from './style.module.scss'
import { useStore, TabItem } from '@libs/store'
import * as modals from '@libs/modals'

interface Props {
  tab: TabItem
  doc: Record<string, any>
}

const DocumentView = observer(({ doc, tab }: Props) => {
  const store = useStore()
  const [expanded, setExpanded] = useState(false)

  const type = () => {
    if (Array.isArray(doc)) return 'Array'
    return 'Object'
  }

  const deleteOne = () => {
    Modal.confirm({
      title: 'Delete Document',
      simple: true,
      content: `Delete document with id: ${doc._id} ?`,
      onOk: async () => {
        await store.deleteDocument(
          tab.namespace,
          tab.dataset,
          tab.collection,
          doc._id
        )
        Message.success('Document Deleted')
        tab.ref?.refresh()
      }
    })
  }

  const codes = useMemo(() => {
    const text = JSON.stringify(doc, null, 2)
    const html = Prismjs.highlight(text, Prismjs.languages.json, 'json')
    return html
  }, [doc])

  return (
    <div
      className={classNames(styles.wrap, {
        [styles.expanded]: expanded
      })}
    >
      <div className={styles.row} onClick={() => setExpanded(!expanded)}>
        <span className={classNames(styles.icon, styles.arrow)}>
          <IconRight />
        </span>
        <span className={styles.code}>
          <IconCodeBlock />
        </span>
        <span className={styles.col}>Id("{doc._id}")</span>
        <span className={styles.col}>
          {'{'} {Object.keys(doc).length} fields {'}'}
        </span>
        <span className={styles.col}>{type()}</span>
        <span className={styles.icon}>
          <Dropdown
            droplist={
              <Menu>
                <Menu.Item
                  key="Update"
                  onClick={(e: MouseEvent) => {
                    e.stopPropagation()
                    modals.editDocument(
                      tab.namespace,
                      tab.dataset,
                      tab.collection,
                      doc._id,
                      JSON.stringify(doc, null, 2)
                    )
                  }}
                >
                  Edit Document...
                </Menu.Item>
                <Menu.Item
                  key="Delete"
                  onClick={(e: MouseEvent) => {
                    e.stopPropagation()
                    deleteOne()
                  }}
                >
                  Delete Document...
                </Menu.Item>
              </Menu>
            }
            trigger="click"
          >
            <IconMore onClick={e => e.stopPropagation()} />
          </Dropdown>
        </span>
      </div>
      <div className={styles.children}>
        <pre>
          <code
            className="language-json"
            dangerouslySetInnerHTML={{ __html: codes }}
          />
        </pre>
      </div>
    </div>
  )
})

export default DocumentView
