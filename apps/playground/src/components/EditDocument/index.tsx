import { useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react'
import { Modal, Form, FormInstance, Message } from '@arco-design/web-react'

import { useStore } from '@libs/store'
import CodeEditor from '@components/CodeEditor'

interface Props {
  space: string
  dataset: string
  collection: string
  _id?: string
  value?: string
  onClose: () => void
}

const EditDocument = observer((props: Props) => {
  const store = useStore()
  const form = useRef<FormInstance>(null)
  const [visible, setVisible] = useState(false)

  const onSubmit = async () => {
    const { doc } = await form.current?.validate()
    try {
      if (!props._id) {
        await store.insertDocument(
          props.space,
          props.dataset,
          props.collection,
          JSON.parse(doc)
        )
        Message.success('Document Created')
      } else {
        await store.updateDocument(
          props.space,
          props.dataset,
          props.collection,
          props._id,
          JSON.parse(doc)
        )
        Message.success('Document Updated')
      }
      const tab = store.tabs.find(item => {
        return (
          item.namespace === props.space &&
          item.dataset === props.dataset &&
          item.collection === props.collection
        )
      })
      tab?.ref?.refresh()
      props.onClose()
    } catch (error) {
      Message.error('Create Failed')
    }
  }

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <Modal
      title={!!props._id ? 'Edit Document' : 'Insert Document'}
      simple
      onConfirm={onSubmit}
      maskClosable={false}
      visible={visible}
      onCancel={() => setVisible(false)}
      afterClose={props.onClose}
      style={{ width: '600px' }}
    >
      <Form
        layout="vertical"
        ref={form}
        size="large"
        initialValues={{
          doc: props.value || ''
        }}
      >
        <Form.Item
          field="doc"
          rules={[
            {
              required: true
            },
            {
              validator(value, cb) {
                try {
                  JSON.parse(value)
                  cb()
                } catch (error) {
                  cb('Invalid JSON')
                }
              }
            }
          ]}
        >
          <CodeEditor height="400px" />
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default EditDocument
