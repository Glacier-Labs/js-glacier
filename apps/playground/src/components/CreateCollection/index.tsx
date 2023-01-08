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
import SchemaForm from './SchemaForm'

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
    const data = {
      title: name,
      type: 'object',
      ...schema
    }
    try {
      await store.createCollection(props.dataset, name, data)
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
      escToExit={false}
      onCancel={() => setVisible(false)}
      afterClose={props.onClose}
      style={{ width: '1000px' }}
    >
      <Form
        ref={form}
        size="large"
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 21 }}
      >
        <Form.Item label="Dataset">
          {store.currentSpace}/{props.dataset}
        </Form.Item>
        <Form.Item
          label="Name"
          field="name"
          rules={[
            {
              required: true
            }
          ]}
        >
          <Input placeholder="Collection Name" />
        </Form.Item>
        <Form.Item
          label="Field"
          field="schema"
          rules={[
            {
              required: true
            },
            {
              validator(value, cb) {
                const keys = Object.keys(value.properties) 
                for (const key of keys) {
                  if (!key) {
                    cb('Invalid propertie')
                    return
                  }
                }
                cb()
              }
            }
          ]}
        >
          <SchemaForm />
        </Form.Item>
      </Form>
    </Modal>
  )
})

export default CreateCollection
