export function relayConsoleMessages ({ src, dest }) {
  const srcLog = src.log
  const srcError = src.error

  src.log = (...args) => {
    srcLog.apply(src, args)
    dest.log(...args)
  }

  src.error = (...args) => {
    srcError.apply(src, args)
    dest.error(...args)
  }
}

export function logUncaughtErrors ({ window, onError = onUncaughtError }) {
  window.addEventListener('error', onUncaughtError)
}

export function onUncaughtError (e) {
  e.preventDefault()
  console.error(e.error.stack || e.error)
}
