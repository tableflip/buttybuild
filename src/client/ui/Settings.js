import React from 'react'
import {ipcRenderer} from 'electron'

const Settings = ({onGetSystemInfo, data}) => (
  <div className='ph2'>
    <h2>Settings</h2>
    <button
      className='f6 link dim ba bw2 ph3 pv2 mb2 dib bg-maastricht-blue white'
      onClick={onGetSystemInfo}>
      Get system info
    </button>
    <div className='pv4'>
      {data && data.length > 0 && (
        <ul className='list pl0 ml0 center ba b--light-silver br2'>
          {data.map(d =>
            <li key={d.SystemTime} className='ph3 pv3 bb b--light-silver'>
              <h4 className='mt0 mb1'>Docker info</h4>
              <div className='code'>ServerVersion: {d.ServerVersion}, SystemTime: {d.SystemTime}</div>
            </li>
          )}
        </ul>
      )}
    </div>
  </div>
)

class SettingsContainer extends React.Component {
  state = {
    data: []
  }
  onGetSystemInfo () {
    ipcRenderer.send('docker-info')
  }
  componentDidMount = () => {
    ipcRenderer.send('settings')
    ipcRenderer.on('docker-info-data', (event, data) => {
      this.setState((s) => ({
        data: s.data.concat(data)
      }))
    })
  }
  render () {
    return <Settings onGetSystemInfo={this.onGetSystemInfo} data={this.state.data} />
  }
}

export default SettingsContainer
