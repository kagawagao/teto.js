import React, {PropTypes} from 'react'
import { Breadcrumb } from 'antd'
import {Link} from 'react-router'
import routes from 'routes'
import i18n from 'utils/i18n'
import {connect} from 'react-redux'

@connect(state => ({
  i18n: state.i18n
}))
export default class BreadcrumbComponent extends React.Component {
  static propTypes = {
    location: PropTypes.object,
    params: PropTypes.object,
    routes: PropTypes.array
  }
  render () {
    const {location, params, routes: routesArray} = this.props
    const {pathname} = location
    const pathObjArr = []
    if (!routes.hasOwnProperty(pathname)) {
      const paths = []
      routesArray.map(route => {
        if (route.path) {
          paths.push(route.path)
        }
      })
      let currentPath = paths[0]
      let currentRoute = routes[paths[0]]
      pathObjArr.push({
        path: paths[0],
        title: currentRoute.title
      })
      paths.shift()
      paths.map(path => {
        currentRoute = currentRoute.childroutes[path]
        if (currentRoute) {
          currentPath = currentPath === '/' ? currentPath + path : currentPath + '/' + path
          Object.keys(params).map(key => {
            currentPath = currentPath.replace(`:${key}`, params[key])
          })
          pathObjArr.push({
            path: currentPath,
            title: currentRoute.title
          })
        } else {
          return
        }
      })
    }
    return (
      pathObjArr.length > 0 ? (
        <div className="breadcrumb">
          <Breadcrumb separator=">">
          {pathObjArr.map((item, index) => {
            if (index !== pathObjArr.length - 1) {
              return (
                <Breadcrumb.Item key={index}>
                  {item.title && <Link to={item.path}>{i18n(item.title)}</Link>}
                </Breadcrumb.Item>
              )
            }
            return item.title && <Breadcrumb.Item key={index}>{i18n(item.title)}</Breadcrumb.Item>
          })}
          </Breadcrumb>
        </div>) : null
    )
  }
}
