import React from 'react'
import { Link } from 'react-router'
import routes from 'routes'
import { i18n } from './i18n'
import { Menu, Icon } from 'antd'
import {hasAuth} from './userauth'
const SubMenu = Menu.SubMenu

const calcHasAuth = (sets, level, module, roles) => {
  Object.keys(sets).forEach(setKey => {
    const value = sets[setKey]
    const childroutes = value.childroutes
    if (!childroutes) {
      value.hasAuth = hasAuth(value.level || level, value.module || module, value.roles || roles)
    } else {
      calcHasAuth(childroutes, value.level || level, value.module || module, value.roles || roles)
      value.hasAuth = Object.keys(childroutes).map(childKey => {
        return childroutes[childKey]
      }).some(route => {
        return route.hasAuth
      })
    }
  })
}
const routeObj2Array = (obj, prefix) => {
  const routeArray = []
  Object.keys(obj).map(key => {
    if (!obj[key].hide && obj[key].hasAuth) {
      const temp = {}
      temp.title = obj[key].title
      temp.icon = obj[key].icon
      temp.path = `${prefix}${key}`
      if (obj[key].childroutes) {
        temp.childroutes = routeObj2Array(obj[key].childroutes, `${temp.path}/`)
      }
      routeArray.push(temp)
    }
  })
  return routeArray
}
const getHTMLByRouteArray = (arr, level = 0) => {
  return (
    arr.map((item, i) => {
      if (item.childroutes && item.childroutes.length > 0) {
        return (
          <SubMenu key={`sub${level}${i}`}
            title={
              <span>
                {item.icon && <Icon type={item.icon} />}
                <span>{i18n(item.title)}</span>
              </span>}>
          {getHTMLByRouteArray(item.childroutes, level + 1)}
          </SubMenu>)
      }
      return (
        <Menu.Item key={`item${level}${i}`}>
          <Link to={item.path}>
            <span>
              {item.icon && <Icon type={item.icon} />}
              <span>{i18n(item.title)}</span>
            </span>
          </Link>
        </Menu.Item>)
    })
  )
}
const walkRoutes = (options = {
  recursive: true,
  level: 0,
  prefix: '/',
  Cmp: SubMenu,
  mode: 'inline',
  title: ''
}) => {
  const { sets, level, prefix } = options
  let { Cmp, mode, title } = options
  if (!Cmp) {
    Cmp = SubMenu
  }

  if (!mode) {
    mode = 'inline'
  }

  if (!title) {
    title = ''
  }
  const RouteArray = routeObj2Array(sets, prefix)
  return getHTMLByRouteArray(RouteArray, level)
}

export default {

  /**
   * 根据给定的路径返回导航
   * @param  {string}  scope     路径
   * @param  {boolean} recursive 是否递归
   * @return {string}            HTML 代码
   */
  getLinks (scope, recursive) {
    let sets

    if (scope) {
      if (scope === '/') {
        sets = routes['/'].childroutes
      } else {
        sets = scope
        .replace(/\/$/, '')
        .split('/')
        .reduce((obj, key) => {
          return obj[key || '/'].childroutes
        }, routes)
      }
    } else {
      sets = routes
    }
    calcHasAuth(sets)
    return walkRoutes({
      sets,
      recursive,
      level: 0,
      prefix: scope
    })
  }

}
