import { Button } from '@arco-design/web-react'
import { observer } from 'mobx-react'

import styles from './style.module.scss'
import { useStore } from '@libs/store'

const Login = observer(() => {
  const store = useStore()

  return (
    <div className={styles.wrap}>
      <div className={styles.box}>
        <Button
          type="primary"
          long
          size="large"
          shape="round"
          onClick={() => {
            store.walltVisible = true
          }}
        >
          Connect Wallet
        </Button>
      </div>
    </div>
  )
})

export default Login
