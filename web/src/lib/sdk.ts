import { KindlePoolAPI } from '@abbasiwa/kindlepool-sdk'

const env = import.meta.env

/** Shared indexer API client (reads). */
export function getApi(): KindlePoolAPI {
  return new KindlePoolAPI({
    baseUrl: env.VITE_INDEXER_URL ?? 'https://kindlepool-api.herokuapp.com',
  })
}
