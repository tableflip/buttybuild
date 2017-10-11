import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import explain from 'explain-error'
import moment from 'moment'
import bs58 from 'bs58'
import { withSbot } from '../../lib/sbot'

export class Build extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    sbot: PropTypes.object.isRequired
  }

  state = { build: null }

  componentDidMount () {
    this.updateBuild(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.updateBuild(nextProps)
  }

  updateBuild ({ sbot, match }) {
    const key = bs58.decode(match.params.id).toString()

    sbot.get(key, (err, build) => {
      if (err) {
        return console.error(explain(err, `Failed to get build ${match.params.id}`))
      }
      this.setState({ build })
    })
  }

  render () {
    const { build } = this.state
    if (!build) return null

    const key = bs58.decode(this.props.match.params.id).toString()

    return (
      <div className='pa3'>
        <p className='mt0'>ID {key}</p>
        <p className='mt0'>Repo {build.content.repo}</p>
        <p className='mt0'>Started {moment(build.timestamp).fromNow()}</p>
      </div>
    )
  }
}

export default withRouter(withSbot(Build))
