import { useRef, useState, useEffect } from 'react'
import { observer } from 'mobx-react'
import {
  Modal,
  Form,
  Input,
  FormInstance,
  Message
} from '@arco-design/web-react'

import { useStore } from '@libs/store'
import CodeEditor from '@components/CodeEditor'

interface Props {
  dataset: string
  onClose: () => void
}

const CreateCollection = observer((props: Props) => {
  const store = useStore()
  const form = useRef<FormInstance>(null)
  const [visible, setVisible] = useState(false)

  const onSubmit = async () => {
    const { name, schema } = await form.current?.validate()
    try {
      await store.createCollection(props.dataset, name, JSON.parse(schema))
      props.onClose()
      Message.success('Collection Created')
    } catch (error: any) {
      console.trace(error)
      Message.error('Create Failed')
    }
  }

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <Modal
      title="Create Collection"
      simple
      onConfirm={onSubmit}
      unmountOnExit
      maskClosable={false}
      visible={visible}
      onCancel={() => setVisible(false)}
      afterClose={props.onClose}
      style={{ width: '600px' }}
    >
      <Form layout="vertical" ref={form} size="large">
        <Form.Item label="Dataset">
          <Input disabled value={`${store.currentSpace}/${props.dataset}`} />
        </Form.Item>
        <Form.Item
          label="Collection Name"
          field="name"
          rules={[
            {
              required: true
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Collection JSON Schema"
          field="schema"
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
          <CodeEditor height="300px" />
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default CreateCollection
