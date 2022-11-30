import { useState, useRef } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { Button, Input, Form, FormInstance, Message } from '@arco-design/web-react'
import { observer } from 'mobx-react'

import styles from './style.module.scss'
import { useStore } from '@libs/store'

const Connect = observer(() => {
  const store = useStore()
  const form = useRef<FormInstance>(null)
  const [loading, setLoading] = useState(false)
  const { account, library } = useWeb3React<Web3Provider>()

  const submit = async () => {
    const value = await form.current?.validate()
    setLoading(true)
    try {
      await store.connect(value.url, account!, library?.getSigner())
    } catch (error) {
      Message.error('Invalid Endpoint')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrap}>
      <Form
        className={styles.box}
        layout="vertical"
        size="large"
        ref={form}
        initialValues={{ url: process.env.REACT_APP_ENDPOINT }}
      >
        <Form.Item
          field="url"
          rules={[
            {
              required: true
            },
            {
              validator: (value, cb) => {
                try {
                  new URL(value)
                  cb()
                } catch (error) {
                  cb('Invalid endpoint')
                }
              }
            }
          ]}
        >
          <Input defaultValue={process.env.REACT_APP_ENDPOINT} placeholder="GlacierDB Endpoint" />
        </Form.Item>
        <Form.Item>
          <Button long type="primary" onClick={submit} loading={loading}>
            Connect GlacierDB
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
})

export default Connect
