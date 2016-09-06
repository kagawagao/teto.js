import React, { Component, PropTypes } from 'react'
import {connect} from 'react-redux'
import Header from './header'
import Nav from './nav'
import Breadcrumb from 'components/breadcrumb'
import 'styles/app/home/index.less'

@connect(state => ({
  i18n: state.i18n
}))
export default class Home extends Component {

  static propTypes = {
    children: PropTypes.element
  };

  // constructor(props, context) {
  //   super(props, context)
  // }

  render () {
    return (
      <div className="app-home">
        <Header />
        <main className="app-main-container">
          <Nav {...this.props} />
          <main className="app-main">
            <Breadcrumb {...this.props} />
            {this.props.children}
          </main>
        </main>
      </div>
    )
  }

}
