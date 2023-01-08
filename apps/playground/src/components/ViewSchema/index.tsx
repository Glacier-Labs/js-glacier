import Prismjs from 'prismjs'
import { useState, useEffect, useMemo } from 'react'
import { Button, Modal } from '@arco-design/web-react'

interface Props {
  doc: string
  onClose: () => void
}

export default function ViewSchema({ doc, onClose }: Props) {
  const [visible, setVisible] = useState(false)

  const codes = useMemo(() => {
    const html = Prismjs.highlight(doc, Prismjs.languages.js, 'js')
    return html
  }, [doc])

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <Modal
      title="Schema Details"
      simple
      maskClosable={false}
      visible={visible}
      onCancel={() => setVisible(false)}
      afterClose={onClose}
      style={{ width: '600px' }}
      footer={[
        <Button type="primary" onClick={() => setVisible(false)} key="ok">
          OK
        </Button>
      ]}
    >
      <pre className="language-js">
        <code className="language-js" dangerouslySetInnerHTML={{__html: codes}} />
      </pre>
    </Modal>
  )
}
