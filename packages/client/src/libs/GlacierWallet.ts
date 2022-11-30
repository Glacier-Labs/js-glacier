import { Wallet } from '@ethersproject/wallet'
import { Signer } from '@ethersproject/abstract-signer'
import { hashMessage } from '@ethersproject/hash'
import { arrayify } from '@ethersproject/bytes'
import { recoverPublicKey } from '@ethersproject/signing-key'

export interface WalletOptions {
  privateKey?: string
  signer?: any
}

export default class GlacierWallet {
  private wallet?: Wallet | Signer

  constructor(options: WalletOptions) {
    if (options.privateKey) {
      this.wallet = new Wallet(options.privateKey)
    }
    if (options.signer) {
      this.wallet = options.signer
    }
  }

  async signMessage(message: string) {
    const signature = await this.wallet.signMessage(message)
    const signHash = arrayify(hashMessage(message))
    const publicKey = recoverPublicKey(signHash, signature)
    return {
      publicKey,
      signature,
      signatureBuffer: arrayify(signature)
    }
  }
}
