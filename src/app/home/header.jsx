import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {loadLang} from 'redux/actions/i18n'
import autobind from 'autobind-decorator'
import CONFIG from 'utils/config'
import {Select} from 'antd'
import Logo from './logo'
import User from './user'
const Option = Select.Option

@connect(state => ({
  i18n: state.i18n
}), dispatch => ({
  ...bindActionCreators({ loadLang }, dispatch)
}))
export default class extends Component {

  static propTypes = {
    i18n: PropTypes.object,
    loadLang: PropTypes.func
  };

  // constructor(props, context) {
  //   super(props, context)
  // }

  @autobind
  changeLocale (value) {
    this.props.loadLang(value)
  }
  render () {
    const {locale} = this.props.i18n
    return (
      <header className="app-home-header">
        <Logo />
        <div className="header-right">
          <div className="language">
            <Select value={locale} size="large" onChange={this.changeLocale}>
              {Object.keys(CONFIG.I18N).map((key, index) => {
                return <Option key={index} value={key}>{CONFIG.I18N[key]}</Option>
              })}
            </Select>
          </div>
          <User />
        </div>
      </header>
    )
  }

}
