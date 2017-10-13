import React, { Component } from 'react'
import explain from 'explain-error'
import pull from 'pull-stream'
import Abortable from 'pull-abortable'

const noStreams = () => ({})

export function createPullContainer (getStreams, opts, Comp) {
  if (!Comp) {
    Comp = opts
    opts = {}
  }

  opts = opts || {}
  getStreams = getStreams || noStreams

  class Container extends Component {
    state = {}
    _abortables = {}

    componentWillMount () {
      this.setup(this.props)
    }

    componentWillReceiveProps (nextProps) {
      this.abort()
      this.setup(nextProps)
    }

    componentWillUnmount () {
      this.abort()
    }

    setup (props) {
      const streams = getStreams(props)
      const keys = Object.keys(streams)

      // console.log(Comp.name, 'setup')

      this._abortables = keys.reduce((abortables, key) => {
        abortables[key] = Abortable()
        return abortables
      }, {})

      keys.forEach((key) => {
        // console.log(Comp.name, 'collecting', key)
        pull(
          streams[key],
          this._abortables[key],
          pull.collect((err, chunks) => {
            // TODO: how to handle?
            if (err) return console.error(explain(err, `Failed to collect ${key}`))

            if (key[key.length - 1] !== 's') {
              if (chunks.length === 0) {
                chunks = null
              } else if (chunks.length === 1) {
                chunks = chunks[0]
              }
            }

            // console.log(Comp.name, 'collected', key)
            this.setState({ [key]: chunks })
          })
        )
      })
    }

    abort () {
      // console.log(Comp.name, 'abort')
      Object.keys(this._abortables).forEach((key) => {
        // console.log(Comp.name, 'aborting', key)
        this._abortables[key].abort()
      })
      this._abortables = {}
    }

    render () {
      const { props } = this

      const data = Object.keys(this._abortables).reduce((data, key) => {
        if (this.state[key] !== undefined) {
          data[key] = this.state[key]
          return data
        }

        if (key[key.length - 1] === 's') {
          data[key] = []
        } else {
          data[key] = null
        }

        return data
      }, {})

      return <Comp {...props} {...data} />
    }
  }

  return Container
}
