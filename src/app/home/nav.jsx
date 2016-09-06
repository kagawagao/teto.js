import React, {PropTypes} from 'react'
import { Menu } from 'antd'
import autobind from 'autobind-decorator'
import { connect } from 'react-redux'
import Route from 'utils/route'

@connect(state => ({
  auth: state.auth
}))
export default class Nav extends React.Component {
  static propTypes = {
    auth: PropTypes.object
  }
  constructor (props) {
    super(props)
    this.state = {
      current: '',
      openKeys: []
    }
  }
  @autobind
  handleClick (e) {
    this.setState({
      current: e.key,
      openKeys: e.keyPath.slice(1)
    })
  }
  @autobind
  onToggle (info) {
    this.setState({
      openKeys: info.open ? info.keyPath : info.keyPath.slice(1)
    })
  }
  render () {
    return (
      <aside className="nav-menu">
        <Menu onClick={this.handleClick}
          openKeys={this.state.openKeys}
          onOpen={this.onToggle}
          onClose={this.onToggle}
          selectedKeys={[this.state.current]}
          mode="inline">
          {this.props.auth && typeof this.props.auth.level !== 'undefined' && Route.getLinks('/')}
        </Menu>
      </aside>
    )
  }
}
