import Electron from 'electron'
import React from 'react'
import ReactDOM from 'react-dom'
import Layout from './ui/Layout'
import { relayConsoleMessages, logUncaughtErrors } from './lib/console'

relayConsoleMessages({ src: console, dest: Electron.remote.getGlobal('console') })
logUncaughtErrors({ window })

console.log(process.versions)

ReactDOM.render(<Layout />, document.getElementById('root'))
