import Gateway from './Gateway'
import Namespace from './Namespace'
import GlacierWallet, { WalletOptions } from './GlacierWallet'
import type { InsertResult, NamespaceRecord } from '../types'

export interface ClientOptions {
  privateKey?: string
  signer?: any
}

export default class GlacierClient {
  private wallet: GlacierWallet
  gateway: Gateway

  constructor(endpoint: string, options?: WalletOptions) {
    this.gateway = new Gateway(endpoint)
    if (options?.privateKey || options?.provider) {
      this.wallet = new GlacierWallet(options)
    }
  }

  async send<T = any>(url: string, payload: Record<string, any>) {
    if (!this.wallet) throw new Error('Wallet not configured')
    const action = url.split('/').pop()
    const json = JSON.stringify(payload)
    const expiredAt = Math.trunc(Date.now() / 1000 + 10)
    const message = `${action}\n${expiredAt}\n${json}`
    const { signature } = await this.wallet.signMessage(message)
    const result = await this.gateway.send<T>(url, payload, {
      'X-GlacierDB-Sign': `ethsign ${signature}`,
      'X-GlacierDB-SignExpiredAt': `${expiredAt}`
    })
    return result
  }

  namespace(name: string) {
    return new Namespace(this, name)
  }

  namespaces(owner: string) {
    const url = '/namespace/queryNamespace'
    return this.gateway.send<NamespaceRecord[]>(url, {
      network: 'ethereum',
      address: owner.toLowerCase()
    })
  }

  createNamespace(name: string) {
    const url = '/namespace/createNamespace'
    return this.send<InsertResult>(url, {
      namespace: name
    })
  }
}
