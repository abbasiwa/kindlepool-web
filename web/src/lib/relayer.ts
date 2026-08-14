export interface RelayResult {
  success: boolean
  hash?: string
  error?: string
}

export interface RelayerHealth {
  status: 'ok' | 'degraded' | 'unreachable'
  relayer_address?: string
  balance?: string
}

const env = import.meta.env
const DEFAULT_RELAYER_URL = 'https://kindlepool-api.herokuapp.com'

function getRelayerUrl(): string {
  return env.VITE_RELAYER_URL ?? DEFAULT_RELAYER_URL
}

export async function relayTransaction(txXdr: string, sourceAddress: string): Promise<RelayResult> {
  try {
    const res = await fetch(`${getRelayerUrl()}/api/v1/relay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tx_xdr: txXdr, source_address: sourceAddress }),
    })
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      return { success: false, error: `Relay error ${res.status}: ${body}` }
    }
    return await res.json()
  } catch (err: any) {
    return { success: false, error: err.message ?? 'Relay request failed' }
  }
}

export async function getRelayerHealth(): Promise<RelayerHealth> {
  try {
    const res = await fetch(`${getRelayerUrl()}/api/v1/health`)
    if (!res.ok) return { status: 'degraded' }
    return await res.json()
  } catch {
    return { status: 'unreachable' }
  }
}
