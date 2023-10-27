import getConfig from 'next/config'
import { NextRouter } from 'next/dist/shared/lib/router/router'
import { UTMStore } from 'common/utmTracking/index'

export const EMAIL = 'email'
export const BANK = 'bank'
export const PASSWORD = 'password'
export const MEMBER = 'member'
export const VERIFY_PHONE = 'verify-phone'

const {publicRuntimeConfig: {ACCOUNT_HOST_URL, SKJ_HOST_URL, MYACCOUNT_HOST_URL}} = getConfig()

export function encodeURL(str: string) {
  return encodeURIComponent(str)
    .replace('[]', '')
    .replace(/['()*]/g, c => '%' + c.charCodeAt(0).toString(16))
    .replace(/%(7C|60|5E)/g, (str, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    )
}

export function genAuthUrl(router: NextRouter | null, path: string) {
  const addQuery = UTMStore.getUTMAsQuery(router?.asPath) || ''

  return [ACCOUNT_HOST_URL, path + (!router ? '' : `?${addQuery ? (addQuery + '&') : '' }u=` + SKJ_HOST_URL + (`${router.asPath}` == '/' ? '' : encodeURL(router.asPath)))].join('/')
}

export function getAuthUrl(path: string, currentPath: string) {
  return [ACCOUNT_HOST_URL, path + '?u=' + SKJ_HOST_URL + encodeURL(currentPath)].join('/')
}

export function getInvalidUrl(path: string, currentPath: string) {
  return [ACCOUNT_HOST_URL, path + (currentPath ? '?u=' + encodeURL(currentPath) : '')].join('/')
}

export function genMyaccountUrl(router: NextRouter | null, currentPath: string) {
  // append full url (includes host origin) of current site to ?u= query param
  return `${MYACCOUNT_HOST_URL}/${currentPath}?u=${SKJ_HOST_URL}${router ? encodeURL(router.asPath) : ''}`
}
