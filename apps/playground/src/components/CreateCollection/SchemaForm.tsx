import { useState } from 'react'
import {
  Input,
  Button,
  Select,
  Space,
  Checkbox,
  Tooltip
} from '@arco-design/web-react'
import { IconPlus, IconClose, IconSettings } from '@arco-design/web-react/icon'

import styles from './style.module.scss'
import * as modals from '@libs/modals'

export interface SchemaItem {
  _id: string
  name: string
  type: string
  title: string
  description: string
  pattern?: string
  minimum?: number
  maximum?: number
  maxLength?: number
  minLength?: number
  required?: boolean
}

interface Props {
  value?: SchemaItem[]
  onChange?: (value: any) => void
}

export default function SchemaForm(props: Props) {
  const [items, setItems] = useState<SchemaItem[]>(
    [
      {
        _id: Math.random().toString().slice(2, 10),
        name: '',
        title: '',
        type: 'string',
        description: ''
      }
    ]
  )

  const value = () => {
    const properties: any = {}
    const required: string[] = []
    for (const item of items) {
      const node: any = {
        type: item.type,
        title: item.title || '',
        description: item.description || ''
      }
      if (item.maxLength !== undefined) node.maxLength = item.maxLength
      if (item.minLength !== undefined) node.minLength = item.minLength
      if (item.pattern !== undefined) node.pattern = item.pattern
      if (item.minimum !== undefined) node.minimum = item.minimum
      if (item.maximum !== undefined) node.maximum = item.maximum
      properties[item.name] = node
      if (item.required === true) required.push(item.name)
    }
    return {
      properties,
      required
    }
  }

  const update = () => {
    setItems([...items])
    props.onChange?.(value())
  }

  const addNode = (index: number) => {
    items.splice(index + 1, 0, {
      _id: Math.random().toString().slice(2, 10),
      name: '',
      title: '',
      type: 'string',
      description: ''
    })
    update()
  }

  const delNode = (index: number) => {
    items.splice(index, 1)
    update()
  }

  return (
    <div className={styles.grid}>
      {items.map((item, i) => (
        <div className={styles.row} key={item._id}>
          <Input
            placeholder="Name"
            value={item.name}
            onChange={val => {
              item.name = val
              update()
            }}
          />
          <Select
            placeholder="Type"
            value={item.type}
            onChange={val => {
              item.type = val
              update()
            }}
          >
            <Select.Option value="string">string</Select.Option>
            <Select.Option value="number">number</Select.Option>
            <Select.Option value="boolean">boolean</Select.Option>
          </Select>
          <Input
            placeholder="Title"
            value={item.title}
            onChange={val => {
              item.title = val
              update()
            }}
          />
          <Input
            placeholder="Description"
            value={item.description}
            onChange={val => {
              item.description = val
              update()
            }}
          />
          <Space>
            <Tooltip content="Required">
              <Checkbox
                value={item.required}
                onChange={val => {
                  item.required = val
                  update()
                }}
              />
            </Tooltip>
            <Tooltip content="Add node">
              <Button
                size="mini"
                type="text"
                icon={<IconPlus />}
                onClick={() => addNode(i)}
              />
            </Tooltip>
            <Tooltip content="Advanced Settings">
              <Button
                size="mini"
                type="text"
                icon={<IconSettings />}
                onClick={() =>
                  modals.schemaSetting(
                    item.type,
                    {
                      pattern: item.pattern,
                      minimum: item.minimum,
                      maximum: item.maximum,
                      maxLength: item.maxLength,
                      minLength: item.minLength
                    },
                    data => {
                      items[i] = {
                        ...item,
                        ...data
                      }
                      update()
                    }
                  )
                }
              />
            </Tooltip>
            <Tooltip content="Delete node">
              <Button
                size="mini"
                type="text"
                status="danger"
                icon={<IconClose />}
                disabled={items.length === 1}
                onClick={() => delNode(i)}
              />
            </Tooltip>
          </Space>
        </div>
      ))}
    </div>
  )
}
