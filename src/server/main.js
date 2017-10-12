import { app, BrowserWindow, ipcMain } from 'electron'
import Path from 'path'
import Url from 'url'
import Pull from 'pull-stream'
import { createSbot, createSsbConfig } from '../lib/sbot'
import { createDockerClient } from '../lib/docker'
import Config from './config'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow (data = null) {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(Url.format({
    pathname: Path.join(__dirname, '..', 'client', 'main.html'),
    protocol: 'file:',
    slashes: true
  }))

  ipcMain.once('getWindowData', (e) => { e.returnValue = data })

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  const docker = createDockerClient()

  ipcMain.on('docker-info', () => {
    docker.get('/info', {json: true}, (err, info) => {
      if (err) return console.error(err)
      data.sbot.publish({type: 'docker-info', ...info}, (err, arg) => {
        if (err) return console.error(err)
      })
    })
  })

  ipcMain.on('settings', (event) => {
    const source = data.sbot.messagesByType({type: 'docker-info'})
    Pull(
      source,
      Pull.collect((err, array) => {
        if (err) console.error(err)
        event.sender.send('docker-info-data', array.map(d => d.value.content))
      })
    )
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createSsbConfig(Config.appName, { config: Config.ssb }, (err, ssbConfig) => {
    if (err) throw err

    createSbot(ssbConfig, (err, sbot) => {
      if (err) throw err
      createWindow({ ssbConfig, sbot })
    })
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
