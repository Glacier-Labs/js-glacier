import { useWeb3React } from '@web3-react/core'
import { observer } from 'mobx-react'

import styles from './style.module.scss'
import Login from '@pages/Login'
import Main from '@pages/Main'
import Connect from '@pages/Connect'
import Header from '@components/Header'
import { useStore } from '@libs/store'
import { useEagerConnect, useInactiveListener } from '@libs/wallet'

const App = observer(() => {
  const tried = useEagerConnect()
  useInactiveListener(!tried)
  const store = useStore()
  const { account } = useWeb3React()

  const content = () => {
    if (!account) return <Login />
    if (!store.endpoint) return <Connect />
    return <Main />
  }

  return (
    <div className={styles.wrap}>
      <Header />
      <main className={styles.main}>
        {content()}
      </main>
    </div>
  )
})

export default App
