import React, { Component } from 'react'
import i18n from 'utils/i18n'
import {connect} from 'react-redux'

@connect(state => ({
  i18n: state.i18n
}))
export default class extends Component {
  render () {
    return (
      <div className="content">
        <div className="coffee">
          <h1 className="welcome">{i18n('欢迎回来')}</h1>
        </div>
      </div>
    )
  }
}
