import axios from 'axios'

const debug = require('debug')('app:server:tokens')


export default () => {
  debug('Enable Token middleware.')

  return async (ctx, next) => {
    const req = ctx.request
    const url = req.url
    if (!/\/tokens/.test(url)) {
      return next()
    }
    const {
      orgName
    } = req.headers
    const responder = ({ data, status }) => {
      ctx.status = status
      ctx.body = data
    }
    // if (orgName) {
    //   //  todo: vorg
    // }
    const paths = url.split('?')[0].split('/')
    if (paths.length > 3) {
      await axios({
        url: 'https://ucbetapi.101.com/v0.93/tokens/' + paths[paths.length - 1] + '/actions/valid',
        data: req.body,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).then(responder, responder)
    } else {
      await axios({
        url: 'https://ucbetapi.101.com/v0.93/tokens',
        data: req.body,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).then(responder, responder)
    }
  }
}
