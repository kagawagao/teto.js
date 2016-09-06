import { handleActions } from 'redux-actions'
import {USER_AUTH} from '../constants'
const auth = handleActions({
  [USER_AUTH]: (state, action) => ({
    ...state, ...action.payload
  })

}, {})

export default auth
