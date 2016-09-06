import { createAction } from 'redux-actions'
import {LOAD_LANG} from '../constants'
import {message} from 'antd'
const defaultLocale = 'zh-CN'
function getLangData (locale) {
  // here we use promise-loader to load lang data by demand
  let localeData
  try {
    localeData = require('i18n/' + locale + '.json')
  } catch (e) {
    message.error('找不到对应的多语言数据，已自动切换至默认语言')
    locale = defaultLocale
    localeData = require('i18n/zh-CN.json')
  }
  return {locale, localeData}
}

export const loadLang = createAction(LOAD_LANG, (locale = defaultLocale, data) => {
  const loader = data || getLangData
  let langData

  if (typeof loader === 'function') {
    langData = loader(locale)
  } else {
    langData = loader
  }
  return {
    locale: langData.locale,
    lang: langData.localeData
  }
})
