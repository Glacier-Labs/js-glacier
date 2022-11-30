import { useWeb3React } from '@web3-react/core'

import styles from './style.module.scss'
import * as util from '@libs/util'

export default function Header() {
  const { account } = useWeb3React()

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <img src="/favicon.svg" alt="" />
        <span>GlacierDB Playground</span>
      </div>
      {!!account && <span>{util.shortAccount(account)}</span>}
    </header>
  )
}
