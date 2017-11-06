import React, { Component } from 'react'
import explain from 'explain-error'
import pull from 'pull-stream'
import Abortable from 'pull-abortable'
import { isSource } from 'is-pull-stream'
import isSyncChunk from './is-sync-chunk'

export default function pullContainer (getSources, opts) {
  opts = opts || {}
  getSources = getSources || (() => ({}))

  let shouldUpdateSources = () => true

  if (typeof opts === 'function') {
    shouldUpdateSources = opts
    opts = {}
  } else if (opts.shouldUpdateSources) {
    shouldUpdateSources = opts.shouldUpdateSources
  }

  return (Comp) => {
    class Container extends Component {
      state = {}
      _configs = {}

      componentWillMount () {
        this.setup(this.props)
      }

      componentWillReceiveProps (nextProps) {
        if (shouldUpdateSources(this.props, nextProps)) {
          this.abort()
          this.setup(nextProps)
        }
      }

      componentWillUnmount () {
        this.abort()
      }

      setup (props) {
        const sources = getSources(props)
        const keys = Object.keys(sources)

        // console.log(Comp.name, 'setup')

        const configs = keys.reduce((configs, key) => {
          let source = sources[key]
          let config

          if (isSource(source)) {
            config = { abortable: Abortable(), source }
          } else {
            config = { abortable: Abortable(), ...source }
          }

          configs[key] = config
          return configs
        }, {})

        this._configs = configs

        keys.forEach((key) => {
          let source = sources[key]
          let config = configs[key]
          let sink

          if (config.live) {
            let data = []
            let syncd = !config.noSync

            sink = pull.drain((chunk) => {
              data.push(chunk)

              if (!syncd && isSyncChunk(chunk)) {
                syncd = true
              }

              if (syncd) {
                this.setState({ [key]: Array.from(data) })
              }
            }, (err) => {
              // TODO: how to handle?
              if (err) console.error(explain(err, `Failed to drain ${key}`))
            })
          } else {
            sink = pull.collect((err, chunks) => {
              // TODO: how to handle?
              if (err) return console.error(explain(err, `Failed to collect ${key}`))

              // If this stream will only return one chunk, make it the value
              if (config.single) {
                chunks = chunks[0]
              }

              // console.log(Comp.name, 'collected', key)
              this.setState({ [key]: chunks })
            })
          }

          // console.log(Comp.name, 'collecting', key)
          pull(source, config.abortable, sink)
        })
      }

      abort () {
        // console.log(Comp.name, 'abort')
        Object.keys(this._configs).forEach((key) => {
          // console.log(Comp.name, 'aborting', key)
          this._configs[key].abortable.abort()
        })
        this._configs = {}
      }

      getData () {
        const { state, _configs: configs } = this

        return Object.keys(configs).reduce((data, key) => {
          if (state[key] !== undefined) {
            data[key] = state[key]
          } else if (configs[key].single) {
            data[key] = null
          } else {
            data[key] = []
          }

          return data
        }, {})
      }

      render () {
        return <Comp {...this.props} {...this.getData()} />
      }
    }

    return Container
  }
}

export { isSyncChunk }
