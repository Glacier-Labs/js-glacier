import { useState, useEffect, useRef } from 'react'
import { Form, Modal, Input, InputNumber, FormInstance } from '@arco-design/web-react'

export interface PropsData {
  pattern?: string
  minimum?: number
  maximum?: number
  maxLength?: number
  minLength?: number
}

interface Props {
  type: string
  data: PropsData
  onClose?: () => void
  onConfirm?: (data: PropsData) => void
}

export default function SchemaSetting(props: Props) {
  const form = useRef<FormInstance>(null)
  const [visible, setVisible] = useState(false)

  const submit = async () => {
    const data = await form.current?.validate()
    props.onConfirm?.(data)
    setVisible(false)
  }

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <Modal
      title="Advanced Settings"
      simple
      onConfirm={submit}
      unmountOnExit
      maskClosable={false}
      visible={visible}
      onCancel={() => setVisible(false)}
      afterClose={props.onClose}
    >
      <Form initialValues={props.data} ref={form}>
        {props.type === 'string' && (
          <Form.Item label="Max.L" field="maxLength">
            <InputNumber placeholder="Max Length" />
          </Form.Item>
        )}
        {props.type === 'string' && (
          <Form.Item label="Min.L" field="minLength">
            <InputNumber placeholder="Min Length" />
          </Form.Item>
        )}
        {props.type === 'string' && (
          <Form.Item label="Pattern" field="pattern">
            <Input placeholder="Pattern" />
          </Form.Item>
        )}
        {props.type === 'number' && (
          <Form.Item label="Min" field="minimum">
            <InputNumber placeholder="Minimum" />
          </Form.Item>
        )}
        {props.type === 'number' && (
          <Form.Item label="Max" field="maximum">
            <InputNumber placeholder="Maximum" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}
