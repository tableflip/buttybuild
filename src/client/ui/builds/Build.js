import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import bs58 from 'bs58'
import pull from 'pull-stream'
import { withSbot } from '../../lib/sbot'
import { createPullContainer } from '../../lib/pull-container'

export class Build extends Component {
  static propTypes = {
    id: PropTypes.string,
    build: PropTypes.object
  }

  render () {
    const { build, id } = this.props
    if (!build) return null

    return (
      <div className='pa3'>
        <p className='mt0'>ID {id}</p>
        <p className='mt0'>Repo {build.content.repo}</p>
        <p className='mt0'>Started {moment(build.timestamp).fromNow()}</p>
      </div>
    )
  }
}

export default withRouter(withSbot(createPullContainer(({ sbot, match }) => {
  const key = bs58.decode(match.params.id).toString()

  return {
    id: pull.values([key]),
    build: pull(
      pull.values([key]),
      pull.asyncMap((key, cb) => sbot.get(key, cb))
    )
  }
}, Build)))
