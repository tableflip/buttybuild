import React from 'react'
import { Switch, Route, NavLink } from 'react-router-dom'
import Build from './Build'

export default ({ match }) => (
  <div className='flex h-100'>
    <ul className='list ma0 pl0'>
      <li>
        <NavLink className='db pa3 bb b--near-white' activeClassName='bg-near-white' to={`${match.url}/build/pending`}>
          a pending build
        </NavLink>
      </li>
      <li>
        <NavLink className='db pa3 bb b--near-white' activeClassName='bg-near-white' to={`${match.url}/build/successful`}>
          a successful build
        </NavLink>
      </li>
      <li>
        <NavLink className='db pa3 bb b--near-white' activeClassName='bg-near-white' to={`${match.url}/build/failed`}>
          a failed build
        </NavLink>
      </li>
    </ul>
    <div className='flex-auto'>
      <Switch>
        <Route path={`${match.url}/build/:id`} component={Build} />
        <Route>
          <div className='pa3'>
            <p className='mt0'>no build selected</p>
          </div>
        </Route>
      </Switch>
    </div>
  </div>
)
