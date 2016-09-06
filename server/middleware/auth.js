import {getSuid, getUser} from './authentication-extractor'
import WafSecurityHttpClient from './waf-security-httpclient'
const debug = require('debug')('app:server:auth')
const url = 'https://ucbetapi.101.com/v0.93'
const config = {
  'ADMIN_REALM': 'admin.sdp.nd',
  'UC_REALM': 'uc.sdp.nd',
  'SOCIAL_REALM': 'social.sdp.nd',
  'APPPORTAL_REALM': 'accounts.app-portal'
}
const realmRole = {
  'SOCIAL_REALM': 'SOCIAL_ADMIN',
  'UC_REALM': 'ORG_ADMIN',
  'APPPORTAL_REALM': 'SERVICE_CONFIG',
  'INITIALADMIN': 'ADMINISTRATOR'
}
const realmUserLevel = {
  'SOCIAL_ADMIN': 'SOCIALADMIN',
  'UC_REALM': 'ORGADMIN',
  'SERVICE_CONFIG': 'ORGADMIN',
  'ADMINISTRATOR': 'INITIALADMIN'
}
const userLevel = {
  'SOCIALADMIN': 9,
  'ORGADMIN': 8,
  'INITIALADMIN': 7,
  'Operator': 6,
  'Boss': 5,
  'NORMAL': 0
}
const getUserRoles = (uid, realm) => {
  const requestUrl = url + '/users/' + uid + '/roles?realm=' + realm
  return new Promise((resolve, reject) => {
    WafSecurityHttpClient({
      url: requestUrl
    }).then(({data}) => {
      const items = data.items
      resolve(items)
    }, ({data}) => {
      console.error('获取用户角色失败')
      reject(data)
    })
  })
}

export default (database) => {
  debug('Enable Auth middleware.')

  return async (ctx, next) => {
    const req = ctx.request
    if (!/\/auth/.test(req.url)) {
      return next()
    }
    const {
      authorization
    } = req.headers
    if (!authorization) {
      ctx.status(403)
      ctx.body({'code': 'ADMIN/UN_AUTH', 'message': '请先登录'})
    }
    const userLoginInfo = {}
    const uid = await getSuid(authorization, req.headers.host, req.method, req.originalUrl)
    const userInfo = await getUser(uid)
    userLoginInfo.user_info = userInfo
    let flag = false
    const hasRole = async realm => {
      if (!flag) {
        const realmRoles = await getUserRoles(uid, config[realm])
        if (realmRoles.some(role => (role.role_name.toUpperCase() === realmRole[realm]))) {
          userLoginInfo.level = userLevel[realmUserLevel[realm]]
          flag = true
        }
      }
    }
    hasRole('SOCIAL_REALM')
    hasRole('UC_REALM')
    hasRole('APPPORTAL_REALM')
    if (!flag) {
      const orgRealm = userInfo.org_exinfo.org_id + '.sdp.nd'
      const orgRealmRoles = await getUserRoles(uid, orgRealm)
      const roleIds = []
      orgRealmRoles.map(role => {
        roleIds.push(role.role_id)
        if (role.role_name.toUpperCase() === 'ADMINISTRATOR') {
          userLoginInfo.level = userLevel.INITIALADMIN
          flag = true
        } else {
          const level = userLevel[role.role_name]
          if (level && !userLoginInfo.level || userLoginInfo.level < level) {
            userLoginInfo.level = level
            flag = true
          }
        }
      })
      if (!flag) {
        const cursor = database.collection('authorization').find({'realm': orgRealm, 'roleId': {'$in': roleIds}})
        cursor.each((err, roleAuths) => {
          if (err) {
            console.dir(err)
          } else {
            const apiIdMap = {}
            if (roleAuths) {
              roleAuths.forEach(roleAuth => {
                if (!apiIdMap[roleAuth.id]) {
                  apiIdMap[roleAuth.id] = roleAuth.apis
                }
              })
            }
            userLoginInfo.level = userLevel.NORMAL
            userLoginInfo.apis = Object.keys(apiIdMap).map(key => (apiIdMap[key]))
            ctx.status = 200
            ctx.body = userLoginInfo
          }
        })
      } else {
        ctx.status = 200
        ctx.body = userLoginInfo
      }
    } else {
      ctx.status = 200
      ctx.body = userLoginInfo
    }
  }
}
