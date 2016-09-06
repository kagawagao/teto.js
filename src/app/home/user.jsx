import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {bindActionCreators} from 'redux'
import { Link } from 'react-router'
import { Menu, Dropdown } from 'antd'
import {updateUser} from 'redux/actions/users'
import {avatarReal} from 'utils/avatar'
import autobind from 'autobind-decorator'
import CONFIG from 'utils/config'
import i18n from 'utils/i18n'

@connect(state => ({
  auth: state.auth,
  i18n: state.i18n,
  avatarSession: state.avatarSession,
  users: state.users
}), dispatch => ({
  ...bindActionCreators({ updateUser }, dispatch)
}))
export default class extends Component {

  static propTypes = {
    auth: PropTypes.object,
    avatarSession: PropTypes.object,
    updateUser: PropTypes.func
  };

  constructor (props) {
    super(props)
    this.state = {
      show: false
    }
  }

  @autobind
  avatarLoadError (e) {
    e.target.src = CONFIG.BLANK
  }

  @autobind
  showModal (key) {
    if (key === 'nickName' || key === 'avatar') {
      this.setState({
        ...this.state, show: true, type: key
      })
    }
  }

  @autobind
  handleCancel () {
    this.setState({
      ...this.state, show: false
    })
  }

  @autobind
  handleOk (data) {
    const {auth} = this.props
    const {user_info} = auth
    if (data && this.state.type === 'nickName') {
      this.props.updateUser({
        payload: {
          data,
          id: user_info.user_id
        }
      })
    }
    this.setState({
      ...this.state, show: false
    })
  }

  render () {
    const {auth = {}} = this.props
    const {user_info = {}} = auth
    const menu = (
      <Menu>
        <Menu.Item key="0">
          <div className="user-org">
            <span>{i18n('单位：')}{user_info.org_exinfo && user_info.org_exinfo.org_name}</span>
          </div>
        </Menu.Item>
        <Menu.Item key="1">
          <Link to="/logout">{i18n('退出')}</Link>
        </Menu.Item>
      </Menu>
    )
    return (
      <div className="user" id="user">
        <div className="user-avatar">
          <img onError={this.avatarLoadError} src={avatarReal(user_info.user_id)} />
        </div>
        <Dropdown overlay={menu}>
          <div className="user-name">
            {user_info.nick_name || user_info.user_name || user_info.org_exinfo && user_info.org_exinfo.real_name}
          </div>
        </Dropdown>
      </div>
    )
  }
}
