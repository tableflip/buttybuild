import React from 'react'

export default ({ match }) => (
  <div className='pa3'>
    <p className='mt0'>Info for a {match.params.id} build</p>
  </div>
)
