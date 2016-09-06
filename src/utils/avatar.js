import CONFIG from './config'

const CS_RES = CONFIG.CS_RES

export default (uid, size = 80) => {
  const CS_API_ORIGIN = CS_RES.protocol + CS_RES.host
  if (CS_API_ORIGIN.indexOf('beta') === -1) {
    return `${CS_API_ORIGIN}/v0.1/static/cscommon/avatar/${uid}/${uid}.jpg?size=${size}`
  }
  return `${CS_API_ORIGIN}/v0.1/static/preproduction_content_cscommon/avatar/${uid}/${uid}.jpg?size=${size}`
}

export const avatarReal = (uid, size = 80) => {
  const CS_API_ORIGIN = CS_RES.protocol + CS_RES.host
  if (CS_API_ORIGIN.indexOf('beta') === -1) {
    return `${CS_API_ORIGIN}/v0.1/static/cscommon/avatar/${uid}/${uid}.jpg?size=${size}&_=${Date.now()}`
  }
  return `${CS_API_ORIGIN}/v0.1/static/preproduction_content_cscommon/avatar/${uid}/${uid}.jpg?size=${size}&_=${Date.now()}`
}
