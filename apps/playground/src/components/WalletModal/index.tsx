import { useWeb3React } from '@web3-react/core'
import { Modal } from '@arco-design/web-react'
import { observer } from 'mobx-react'

import styles from './style.module.scss'
import { useStore } from '@libs/store'
import { injected, walletconnect } from '@libs/connector'
import { ReactComponent as MetaMask } from '@assets/imgs/metamask.svg'
import { ReactComponent as WalletConnect } from '@assets/imgs/walletconnect.svg'

interface Props {
  visible: boolean
  onClose: () => void
}

const WalletModal = observer((props: Props) => {
  const { activate } = useWeb3React()
  const store = useStore()

  const close = () => {
    store.walltVisible = false
  }

  return (
    <Modal
      visible={store.walltVisible}
      onCancel={close}
      simple
      title="Connect Wallet"
      footer={null}
      closable
    >
      <div className={styles.grid}>
        {typeof ethereum !== 'undefined' ? (
          <div
            className={styles.item}
            onClick={() => {
              close()
              activate(injected)
            }}
          >
            <span>MetaMask</span>
            <MetaMask width={30} height={30} />
          </div>
        ) : (
          <a
            className={styles.item}
            href="https://metamask.io/"
            target="_blank"
            rel="noreferrer"
            onClick={props.onClose}
          >
            <span>Install MetaMask</span>
            <MetaMask width={30} height={30} />
          </a>
        )}
        <div
          className={styles.item}
          onClick={() => {
            props.onClose()
            activate(walletconnect)
          }}
        >
          <span>WalletConnect</span>
          <WalletConnect width={30} height={30} />
        </div>
      </div>
    </Modal>
  )
})

export default WalletModal
