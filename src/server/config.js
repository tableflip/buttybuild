import rc from 'rc'
import Package from '../../package.json'

export default rc(Package.name, {
  appName: Package.name,
  version: Package.version,
  ssb: {
    port: 8138
  }
})
