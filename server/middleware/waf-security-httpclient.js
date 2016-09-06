import axios from 'axios'
import config from '../../.shouldnotpublic'

let cached = null
const {
  login_name, password
} = config
if (!login_name || !password) {
  throw new Error('need login_name and password')
}
const ucUrl = 'https://ucbetapi.101.com/v0.93'
const getBearerToken = () => {
  return new Promise((resolve, reject) => {
    if (cached) {
      return resolve(cached)
    }
    axios({
      url: ucUrl + '/bearer_tokens',
      data: {
        login_name: login_name,
        password: password
      },
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then(({
      data
    }) => {
      cached = {
        token: data
      }
      resolve(cached)
    }, () => {
      reject((cached = null))
    })
  })
}
export default ({url, reqData, method = 'GET', headers}) => {
  return new Promise((resolve, reject) => {
    getBearerToken().then(({token}) => {
      axios({
        url: url,
        data: reqData,
        method: method,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Authorization': 'Bearer "' + token.access_token + '"',
          ...headers
        }
      }).then(data => {
        resolve(data)
      }).catch(data => {
        reject(data)
      })
    })
  })
}
