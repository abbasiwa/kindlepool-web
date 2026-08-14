import { describe, expect, it } from 'vitest'
import { walletSigner } from '../lib/contract'

describe('walletSigner', () => {
  it('returns the signed xdr from the wallet', async () => {
    const signer = walletSigner(async () => 'SIGNED_XDR')
    await expect(signer.signTransaction('UNSIGNED_XDR')).resolves.toBe('SIGNED_XDR')
  })

  it('throws when the wallet returns null (cancelled)', async () => {
    const signer = walletSigner(async () => null)
    await expect(signer.signTransaction('XDR')).rejects.toThrow('cancelled or failed')
  })
})
