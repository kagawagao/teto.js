import axios from 'axios'
import WafSecurityHttpClient from './waf-security-httpclient'
const suidCached = {}
const url = 'https://ucbetapi.101.com/v0.93'
const getSuid = (authorization, host, method, api) => {
  return new Promise((resolve, reject) => {
    const macToken = {}
    authorization.trim().split(',').forEach(s => {
      const index = s.indexOf('=')
      if (index > -1) {
        const key = s.substring(0, index).trim()
        let value = s.substring(index + 1).trim()
        value = value.substring(1, value.length - 1)
        macToken[key] = value
      }
    })
    const accessToken = macToken['MAC id']
    let suid = suidCached[accessToken]
    if (suid) {
      return resolve(suid)
    }
    axios({
      url: url + '/tokens/' + accessToken + '/actions/valid',
      method: 'post',
      data: { ...macToken,
        host: host,
        http_method: method,
        request_uri: api
      },
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then(({data}) => {
      suid = data.user_id
      suidCached[accessToken] = suid
      resolve(suid)
    }, ({data}) => {
      console.log('valid access token error', data)
      reject((suid = null))
    })
  })
}
const userCache = {}
const getUser = uid => {
  return new Promise((resovle, reject) => {
    const userInfo = userCache[uid]
    if (userInfo) {
      resovle(userInfo)
      return
    }
    WafSecurityHttpClient({
      'url': url + '/users/' + uid
    }).then(({data}) => {
      userCache[uid] = data
      resovle(data)
    })
  })
}

export {getUser, getSuid}
