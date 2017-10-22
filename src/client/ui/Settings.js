import React, { Component } from 'react'
import PropTypes from 'prop-types'
import explain from 'explain-error'
import { withSbot } from '../lib/sbot'
import { createPullContainer } from '../lib/pull-container'
import { createDockerClient } from '../lib/docker'

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
          {data.map(msg => {
            const d = msg.value.content
            return (
              <li key={msg.key} className='ph3 pv3 bb b--light-silver'>
                <h4 className='mt0 mb1'>Docker info</h4>
                <div className='code'>ServerVersion: {d.ServerVersion}, SystemTime: {d.SystemTime}</div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  </div>
)

class SettingsContainer extends Component {
  static propTypes = {
    sbot: PropTypes.object.isRequired,
    data: PropTypes.array
  }

  onGetSystemInfo = () => {
    const docker = createDockerClient()
    const { sbot } = this.props

    docker.get('/info', {json: true}, (err, info) => {
      if (err) return console.error(explain(err, 'Failed to get docker info'))

      sbot.publish({ type: 'buttybuild-docker-info', ...info }, (err) => {
        if (err) console.error(explain(err, 'Failed to publish docker info'))
      })
    })
  }

  render () {
    return <Settings onGetSystemInfo={this.onGetSystemInfo} data={this.props.data} />
  }
}

export default withSbot(createPullContainer(({ sbot }) => {
  return {
    data: {
      live: true,
      source: sbot.messagesByType({
        type: 'buttybuild-docker-info',
        live: true,
        reverse: true
      })
    }
  }
})(SettingsContainer))
