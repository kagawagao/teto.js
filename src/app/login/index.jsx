import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import autobind from 'autobind-decorator'
import CONFIG, {configVorg} from 'utils/config'
import { Form, Input, Button, Select } from 'antd'
import md5 from 'utils/md5'
import { login, validToken } from 'redux/actions/tokens'
import {fetchAuth} from 'redux/actions/auth'
import {loadLang} from 'redux/actions/i18n'
import i18n from 'utils/i18n'
import auth from 'utils/auth'

import 'styles/app/login/index.less'

const createForm = Form.create

@connect(state => ({
  users: state.users,
  tokens: state.tokens,
  i18n: state.i18n,
  auth: state.auth
}), dispatch => ({
  ...bindActionCreators({ login, loadLang, fetchAuth, validToken }, dispatch)
}))
export default createForm()(class Login extends Component {
  static propTypes = {
    users: PropTypes.object,
    tokens: PropTypes.object,
    login: PropTypes.func.isRequired,
    form: PropTypes.object,
    loadLang: PropTypes.func,
    i18n: PropTypes.object,
    fetchAuth: PropTypes.func,
    auth: PropTypes.object,
    location: PropTypes.object,
    validToken: PropTypes.func
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props)
    this.state = {
      serviceModal: false
    }
  }

  _checkProps (props) {
    // from tokens
    if (auth.hasAuthorization) {
      // from auth
      if (props.auth && typeof props.auth.level !== 'undefined' && !this.single) {
        this.context.router.push('/')
      } else {
        this.props.fetchAuth({paylaod: {}})
        this.single = false
      }
    }
  }
  componentWillMount () {
    const {location} = this.props
    const {query} = location
    const {auth, vorg} = query
    if (vorg) {
      configVorg(vorg)
    }
    if (auth) {
      const macToken = {}

      auth.trim().split(',').forEach(s => {
        const index = s.indexOf('=')
        if (index > -1) {
          const key = s.substring(0, index).trim()
          let value = s.substring(index + 1).trim()
          value = value.substring(1, value.length - 1)
          macToken[key] = value
        }
      })

      const access_token = macToken['MAC id']
      const mac = macToken.mac
      const nonce = macToken.nonce
      this.props.validToken({
        vars: {
          access_token
        },
        data: {
          nonce,
          mac: mac,
          host: CONFIG.LOC_RES.host,
          // host: 'personal-info-admin.beta.web.sdp.101.com',
          http_method: 'GET',
          request_uri: '/'
        }
      })
      this.single = true
    } else {
      this._checkProps(this.props)
    }
  }

  componentWillReceiveProps (props) {
    this._checkProps(props)
  }

  @autobind
  handleSubmit (event) {
    event.preventDefault()
    const data = this.props.form.getFieldsValue()
    const { login_name, password } = data
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        console.log('Errors in form!!!')
      } else {
        this.props.login({
          data: {
            login_name: login_name,
            password: md5(password)
          }
        })
      }
    })
  }

  @autobind
  changeLocale (value) {
    this.props.loadLang(value)
    this.props.form.resetFields()
  }

  render () {
    const Option = Select.Option
    const {form} = this.props
    const {locale} = this.props.i18n
    const { getFieldProps } = form
    const loginNameProps = getFieldProps('login_name', {
      rules: [
        { required: true, whitespace: true, message: i18n('用户名必填') }
      ]
    })
    const passwordProps = getFieldProps('password', {
      rules: [
        { required: true, whitespace: true, message: i18n('密码必填') }
      ]
    })
    return (
      <div className="login">
        <div className="container">
          <div className="title">
            <h1 title={i18n('XX管理系统')}>{i18n('XX管理系统')}</h1>
            <Select value={locale} size="large" onChange={this.changeLocale}>
              {Object.keys(CONFIG.I18N).map((key, index) => {
                return <Option key={index} value={key}>{CONFIG.I18N[key]}</Option>
              })}
            </Select>
          </div>
          <Form horizontal onSubmit={this.handleSubmit}>
            <Form.Item
              hasFeedback>
              <Input placeholder={i18n('请输入用户名')} {...loginNameProps} />
            </Form.Item>
            <Form.Item
              hasFeedback>
              <Input type="password" {...passwordProps} placeholder={i18n('请输入密码')} />
            </Form.Item>
            <Form.Item>
              <div className="button-group">
                <Button size="large" type="primary" htmlType="submit">{i18n('登录')}</Button>
              </div>
            </Form.Item>
          </Form>
          <div className="copyright">
            <div>&copy;{new Date().getFullYear()} {i18n('网龙网络公司 版权所有')}</div>
          </div>
        </div>
      </div>
    )
  }
})
