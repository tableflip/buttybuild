import createClient from 'ssb-client'
import { contextProvider, withContext } from 'react-provide'

export function createSbotClient (config, cb) {
  const opts = {
    path: config.path,
    remote: config.remote,
    host: config.host,
    port: config.port,
    key: config.key,
    appKey: config.caps.shs,
    timers: config.timers
  }

  createClient(config.keys, opts, cb)
}

export const Provider = contextProvider('sbot')
export const withSbot = withContext('sbot')
