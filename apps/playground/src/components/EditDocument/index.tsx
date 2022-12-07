import { useEffect, useMemo, useRef, useState } from 'react'
import { observer } from 'mobx-react'
import { CollectionRecord } from '@glacier-network/client'
import {
  Modal,
  Form,
  FormInstance,
  Message,
  Input,
  InputNumber,
  Switch,
  Button
} from '@arco-design/web-react'

import { useStore } from '@libs/store'
import CodeEditor from '@components/CodeEditor'

type EditMode = 'form' | 'json'

interface Props {
  space: string
  dataset: string
  collection: CollectionRecord
  _id?: string
  value?: string
  mode?: EditMode
  onClose: (mode?: EditMode) => void
  onChangeMode?: (mode: EditMode) => void
}

const EditDocument = observer((props: Props) => {
  const store = useStore()
  const chooseMode = useRef<EditMode>()
  const formRef = useRef<FormInstance>(null)
  const jsonRef = useRef<FormInstance>(null)
  const [visible, setVisible] = useState(false)

  const schema = useMemo(() => {
    try {
      return JSON.parse(props.collection.schema)
    } catch (error) {
      return {}
    }
  }, [props])

  const hasSchema = useMemo(() => {
    return Object.keys(schema).length > 0
  }, [schema])

  const editMode = useMemo<EditMode>(() => {
    if (hasSchema && props.mode !== 'json') return 'form'
    return 'json'
  }, [hasSchema, props.mode])

  const formEdit = useMemo(() => {
    const properties = schema.properties || {}
    const required = schema.required || []
    const keys = Object.keys(properties)
    return (
      <Form
        ref={formRef}
        size="large"
        initialValues={JSON.parse(props.value || '{}')}
      >
        {keys.map(item => {
          const formItem = properties[item]
          const type = formItem.type
          const placeholder = formItem.title || item
          let child: any = <Input.TextArea rows={1} placeholder={placeholder} />
          if (type === 'number') {
            child = (
              <InputNumber
                placeholder={placeholder}
                min={formItem.minimum}
                max={formItem.maximum}
              />
            )
          }
          if (type === 'boolean') child = <Switch placeholder={placeholder} />
          return (
            <Form.Item
              field={item}
              label={item}
              triggerPropName={type === 'boolean' ? 'checked' : 'value'}
              rules={[
                {
                  required: required.includes(item)
                },
                {
                  validator(value, cb) {
                    if (
                      type === 'string' &&
                      formItem.maxLength &&
                      value.length > formItem.maxLength
                    ) {
                      cb(`MaxLength: ${formItem.maxLength}`)
                      return
                    }
                    if (
                      type === 'string' &&
                      formItem.minLength &&
                      value.length < formItem.minLength
                    ) {
                      cb(`MinLength: ${formItem.minLength}`)
                      return
                    }
                    if (
                      type === 'string' &&
                      formItem.pattern &&
                      new RegExp(formItem.pattern).test(value) === false
                    ) {
                      cb(`Invalid pattern: ${formItem.pattern}`)
                      return
                    }
                    if (
                      type === 'number' &&
                      formItem.maximum &&
                      value.length < formItem.maximum
                    ) {
                      cb(`Maximum: ${formItem.maximum}`)
                      return
                    }
                    if (
                      type === 'number' &&
                      formItem.minimum &&
                      value.length < formItem.minimum
                    ) {
                      cb(`Minimum: ${formItem.minimum}`)
                      return
                    }
                    cb()
                  }
                }
              ]}
              key={item}
            >
              {child}
            </Form.Item>
          )
        })}
      </Form>
    )
  }, [schema, props.value])

  const jsonEdit = useMemo(() => {
    return (
      <Form
        layout="vertical"
        ref={jsonRef}
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
            }
          ]}
        >
          <CodeEditor height="400px" />
        </Form.Item>
      </Form>
    )
  }, [props.value])

  const modalContent = useMemo(() => {
    if (editMode === 'form') return formEdit
    return jsonEdit
  }, [editMode, formEdit, jsonEdit])

  const changeMode = (mode: EditMode) => {
    chooseMode.current = mode
    setVisible(false)
  }

  const onSubmit = async () => {
    let doc: any = {}
    if (editMode === 'form') doc = await formRef.current?.validate()
    else {
      const form = await jsonRef.current?.validate()
      doc = JSON.parse(form.doc)
    }
    try {
      if (!props._id) {
        await store.insertDocument(
          props.space,
          props.dataset,
          props.collection.collection,
          doc
        )
        Message.success('Document Created')
      } else {
        await store.updateDocument(
          props.space,
          props.dataset,
          props.collection.collection,
          props._id,
          doc
        )
        Message.success('Document Updated')
      }
      const tab = store.tabs.find(item => {
        return (
          item.namespace === props.space &&
          item.dataset === props.dataset &&
          item.collection.collection === props.collection.collection
        )
      })
      tab?.ref?.refresh()
      props.onClose(chooseMode.current)
    } catch (error: any) {
      if (error.code) {
        Message.error('You denied message signature')
      } else if (props._id) {
        Message.error('Update Failed')
      } else {
        Message.error('Create Failed')
      }
    }
  }

  const modeBtn = () => {
    if (!hasSchema) return null
    if (editMode === 'json') {
      return (
        <Button key="form" onClick={() => changeMode('form')}>
          Form Mode
        </Button>
      )
    } else {
      return (
        <Button key="json" onClick={() => changeMode('json')}>
          JSON Mode
        </Button>
      )
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
      afterClose={() => props.onClose(chooseMode.current)}
      style={{ width: '600px' }}
      mountOnEnter={false}
      footer={[
        modeBtn(),
        <Button key="cancel" onClick={() => setVisible(false)}>
          Cancel
        </Button>,
        <Button key="ok" type="primary" onClick={onSubmit}>
          OK
        </Button>
      ]}
    >
      {modalContent}
    </Modal>
  )
})

export default EditDocument
