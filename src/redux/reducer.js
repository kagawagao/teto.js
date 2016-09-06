import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'

import tokens from './reducers/tokens'
import users from './reducers/users'
import i18n from './reducers/i18n'
import auth from './reducers/auth'

export default combineReducers({
  tokens,
  users,
  i18n,
  auth,
  router
})
