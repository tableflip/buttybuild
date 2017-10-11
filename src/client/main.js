import Electron from 'electron'
import React from 'react'
import ReactDOM from 'react-dom'
import explain from 'explain-error'
import Layout from './ui/Layout'
import { relayConsoleMessages, logUncaughtErrors } from './lib/console'
import { Provider, createSbotClient } from './lib/sbot'

relayConsoleMessages({ src: console, dest: Electron.remote.getGlobal('console') })
logUncaughtErrors({ window })

console.log(process.versions)

const windowData = Electron.ipcRenderer.sendSync('getWindowData')

createSbotClient(windowData.ssbConfig, (err, sbot) => {
  if (err) throw explain(err, 'Failed to create sbot client') // TODO: display error...

  ReactDOM.render(
    <Provider sbot={sbot}>
      <Layout />
    </Provider>,
    document.getElementById('root')
  )
})
