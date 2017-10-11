import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter, Switch, Route, NavLink, Link } from 'react-router-dom'
import pull from 'pull-stream'
import moment from 'moment'
import bs58 from 'bs58'
import { withSbot } from '../../lib/sbot'
import Build from './Build'
import { createPullContainer } from '../../lib/pull-container'

export class GlobalBuilds extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    sbot: PropTypes.object.isRequired,
    builds: PropTypes.array.isRequired
  }

  render () {
    const { match, builds } = this.props

    return (
      <div className='flex h-100'>
        <ul className='list ma0 pl0'>
          {builds.map((build) => (
            <li key={build.key}>
              <NavLink className='db pa3 bb b--near-white' activeClassName='bg-near-white' to={`${match.url}/build/${bs58.encode(Buffer.from(build.key))}`}>
                {build.value.content.repo}
                <div>
                  <small>
                    ID: {build.key}<br />
                    Started {moment(build.value.timestamp).fromNow()}
                  </small>
                </div>
              </NavLink>
            </li>
          ))}
        </ul>
        <div className='flex-auto'>
          <Switch>
            <Route path={`${match.url}/build/:id`} component={Build} />
            <Route>
              <div className='pa3'>
                <p className='mt0'>no build selected</p>
                <Link to='/builds/request'>Request a build</Link>
              </div>
            </Route>
          </Switch>
        </div>
      </div>
    )
  }
}

export default withRouter(withSbot(createPullContainer(({ sbot }) => {
  return {
    builds: pull(
      sbot.messagesByType({ type: 'buttybuild.build', limit: 100, reverse: true })
    )
  }
}, GlobalBuilds)))
