import store from 'redux/store'
function format (s, args) {
  if (args && args.length > 0) {
    const pattern = new RegExp(`\\{[0-${args.length - 1}]\\}`, 'g')
    return s.replace(pattern, match => (args[match.charAt(1)]))
  }
  return s
}

function i18nResolver (locale, data, key, args) {
  if (!locale) {
    return key
  }
  if (!data) {
    return key
  }
  if (data.hasOwnProperty(locale) && typeof data[locale] === 'object' && data[locale].hasOwnProperty(key)) {
    return format(data[locale][key].toString(), args)
  }
  return format(key, args)
}

export const i18n = (key, ...args) => {
  const state = store.getState()
  const _i18n = state.i18n || {}
  const { data, locale } = _i18n
  return i18nResolver(locale, data, key, args)
}

export const i18nFactory = path => (key, ...args) => i18n(path + key, ...args)
export default i18n
