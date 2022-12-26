import { Wallet } from '@ethersproject/wallet'
import { hashMessage } from '@ethersproject/hash'
import { arrayify } from '@ethersproject/bytes'
import { Web3Provider } from '@ethersproject/providers'
import { recoverPublicKey } from '@ethersproject/signing-key'
import { Signer } from '@ethersproject/abstract-signer'

export interface WalletOptions {
  privateKey?: string
  provider?: any
}

export default class GlacierWallet {
  private wallet?: Wallet | Signer

  constructor(options: WalletOptions) {
    if (options.privateKey) {
      this.wallet = new Wallet(options.privateKey)
    }
    if (options.provider) {
      const provider = new Web3Provider(options.provider)
      this.wallet = provider.getSigner()
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
