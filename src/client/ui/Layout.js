import React from 'react'
import { HashRouter as Router, Route, NavLink, Redirect } from 'react-router-dom'
import GlobalBuilds from './builds/Global'
import LocalBuilds from './builds/Local'
import RequestBuild from './builds/RequestBuild'
import Settings from './Settings'

export default () => {
  const navItemClass = 'db bg-white br-100 o-20 glow mb3'
  return (
    <Router>
      <div className='flex h-100'>
        <nav className='bg-royal-blue'>
          <ul className='list ma0 pa3'>
            <li><NavLink className={navItemClass} activeStyle={{ opacity: 1 }} style={{ width: 40, height: 40 }} to='/builds/global' title='All Builds' /></li>
            <li><NavLink className={navItemClass} activeStyle={{ opacity: 1 }} style={{ width: 40, height: 40 }} to='/builds/local' title='Local Builds' /></li>
            <li><NavLink className={navItemClass} activeStyle={{ opacity: 1 }} style={{ width: 40, height: 40 }} to='/settings' title='Settings' /></li>
          </ul>
        </nav>
        <div className='flex-auto'>
          <Route exact path='/' render={() => <Redirect to='/builds/global' />} />
          <Route path='/builds/global' component={GlobalBuilds} />
          <Route path='/builds/local' component={LocalBuilds} />
          <Route path='/builds/request' component={RequestBuild} />
          <Route path='/settings' component={Settings} />
        </div>
      </div>
    </Router>
  )
}
