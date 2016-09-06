import { handleActions } from 'redux-actions'
import {LOAD_LANG} from '../constants'
import zhCN from 'i18n/zh-CN'

const i18n = handleActions({
  [LOAD_LANG]: (state, action) => ({
    ...state,
    data: {
      ...state.data,
      [action.payload.locale]: action.payload.lang
    },
    locale: action.payload.locale,
    __version__: state.__version__ + 1
  })
}, {
  __version__: 0,
  locale: 'zh-CN',
  data: {
    'zh-CN': zhCN
  }
})

export default i18n
