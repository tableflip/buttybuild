# react-pull-container

Container for React components to connect pull streams to props.

## Usage

```js
import React from 'react'
import pullContainer from 'react-pull-container'

const List = ({ items }) => (
  <ul>
    {items.map((item) => (
      <li>{item.name}</li>
    ))}
  </ul>
)

// Get pull sources and to map onto our component props
function getSources (props) {
  // use the props passed to the component to setup the pull sources
  return {
    items: pull.values([{ name: 'first' }, { name: 'second' }])
  }
}

export default pullContainer(getSources)(List)
```

Data from each source `getSources` provides is collected (with `pull.collect`) and passed as props to the wrapped component.

Streams created by `getSources` are automatically aborted when the component unmounts.
