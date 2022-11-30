import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

export const injected = new InjectedConnector({})

export const walletconnect = new WalletConnectConnector({
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true
})
