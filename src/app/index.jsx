import React, { Component, PropTypes } from 'react'

export default class App extends Component {

  static propTypes = {
    children: PropTypes.element
  };

  render () {
    return (
      <div style={{height: '100%'}}>
        {this.props.children}
      </div>
    )
  }
}
