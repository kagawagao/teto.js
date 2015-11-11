import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

export default class Index extends Component {

  static propTypes = {
    navs: PropTypes.array.isRequired
  }

  // constructor(props, context) {
  //   super(props, context)
  // }

  render () {
    let { navs } = this.props

    return (
      <div>
        <h1><Link to="/">home</Link></h1>
        <ul>
          {navs.map((nav, i) =>
            <li key={i}><Link to={nav.route}>{nav.title}</Link></li>
          )}
        </ul>
      </div>
    )
  }

}