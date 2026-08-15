import type { TxSigner } from '@abbasiwa/kindlepool-sdk'

/**
 * Wrap a wallet signer (Freighter via useWallet().signAndSubmit) into the
 * SDK's TxSigner. The SDK builds + simulates the tx, then hands the unsigned
 * XDR to the wallet to sign; the signed XDR is submitted by the SDK.
 */
export function walletSigner(signAndSubmit: (xdr: string) => Promise<string | null>): TxSigner {
  return {
    async signTransaction(xdr: string): Promise<string> {
      const signed = await signAndSubmit(xdr)
      if (!signed) throw new Error('Wallet signing was cancelled or failed')
      return signed
    },
  }
}

// Re-export the shared contract client so page code imports from one place.
export { getContract as contract } from './sdk'
export type { TxSigner } from '@abbasiwa/kindlepool-sdk'
