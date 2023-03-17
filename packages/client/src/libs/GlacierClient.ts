import { toUtf8Bytes } from '@ethersproject/strings'
import { sha256 } from '@ethersproject/sha2'

import Gateway from './Gateway'
import Namespace from './Namespace'
import GlacierWallet, { WalletOptions } from './GlacierWallet'
import type { InsertResult, NamespaceRecord } from '../types'

export default class GlacierClient {
  private wallet: GlacierWallet
  gateway: Gateway

  constructor(endpoint: string, options?: WalletOptions) {
    this.gateway = new Gateway(endpoint)
    if (options?.privateKey || options?.provider) {
      this.wallet = new GlacierWallet(options)
    }
  }

  private getNonce() {
    const nonce = Math.trunc(Date.now() / 1000 + Math.random() * 1000000)
    return nonce
  }

  async send<T = any>(url: string, payload: Record<string, any>) {
    if (!this.wallet) throw new Error('Wallet not configured')
    const action = url.split('/').pop()
    const data = JSON.stringify(payload)
    const expiredAt = Math.trunc(Date.now() / 1000 + 15 * 60)
    const nonce = this.getNonce()
    const content = `${action}\n${nonce}\n${expiredAt}\n${data}`
    const hash = sha256(toUtf8Bytes(content))
    const message = `GlacierDB Request:\n${hash}`
    const { signature } = await this.wallet.signMessage(message)
    const result = await this.gateway.send<T>(url, payload, {
      'X-GlacierDB-Sign': `ethsign ${signature}`,
      'X-GlacierDB-SignExpiredAt': `${expiredAt}`,
      'X-GlacierDB-Nonce': nonce.toString()
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
