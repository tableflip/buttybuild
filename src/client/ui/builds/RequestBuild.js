import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import explain from 'explain-error'
import { withSbot } from '../../lib/sbot'

class RequestBuild extends Component {
  static propTypes = {
    sbot: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  state = { repo: '' }

  onRepoChange = (e) => this.setState({ repo: e.target.value })

  onSubmit = (e) => {
    e.preventDefault()

    const { sbot, history } = this.props
    const msg = { type: 'buttybuild-build', repo: this.state.repo }

    sbot.publish(msg, (err) => {
      // TODO: notify user
      if (err) return console.error(explain(err, 'Failed to request build'))
      history.push('/')
    })
  }

  render () {
    return (
      <form onSubmit={this.onSubmit} className='pa3'>
        <h1 className='mt0'>Request a build</h1>
        <div className='mv3'>
          <label htmlFor='repo' className='db'>Github repo URL</label>
          <input name='repo' value={this.state.repo} onChange={this.onRepoChange} />
        </div>
        <div className='mv3'>
          <button type='submit'>Build</button>
        </div>
      </form>
    )
  }
}

export default withRouter(withSbot(RequestBuild))
