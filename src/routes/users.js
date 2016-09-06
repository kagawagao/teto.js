export default {
  users: {
    title: '用户',
    component: 'users/index',
    indexroute: 'users/_indexroute/index',
    hide: true,
    childroutes: {
      ':userId': {
        title: '资料',
        component: 'users/user/index'
      }
    }
  }
}
