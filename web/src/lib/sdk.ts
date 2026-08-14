import { KindlePoolContract, KindlePoolAPI } from '@mikwansa/kindlepool-sdk'

const env = import.meta.env

function contractId(): string {
  const id = env.VITE_KINDLEPOOL_CONTRACT_ID
  if (!id) throw new Error('VITE_KINDLEPOOL_CONTRACT_ID is not set')
  return id
}

/** Shared contract client (reads via indexer; writes via browser signer). */
export function getContract(): KindlePoolContract {
  return new KindlePoolContract(contractId(), {
    rpcUrl: env.VITE_KINDPOOL_RPC_URL ?? 'https://soroban-testnet.stellar.org',
    passphrase: env.VITE_KINDPOOL_NETWORK_PASSPHRASE ?? 'Test SDF Network ; September 2015',
  })
}

/** Shared indexer API client (reads). */
export function getApi(): KindlePoolAPI {
  return new KindlePoolAPI({
    baseUrl: env.VITE_INDEXER_URL ?? 'https://kindlepool-api.herokuapp.com',
  })
}
