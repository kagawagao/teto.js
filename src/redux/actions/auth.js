import { createAction } from 'redux-actions'
import {USER_AUTH} from '../constants'
import Auth from '../models/auth'

export const fetchAuth = createAction(
  USER_AUTH,
  async ({payload}) => await new Auth().GET(payload),
  ({meta = {}}) => meta
)
