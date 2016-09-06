import React, { Component } from 'react'
import { IndexLink } from 'react-router'
import i18n from 'utils/i18n'

export default class extends Component {

  render () {
    return (
      <h1 className="logo">
        <IndexLink to="/">{i18n('XX管理系统')}</IndexLink>
      </h1>
    )
  }

}
