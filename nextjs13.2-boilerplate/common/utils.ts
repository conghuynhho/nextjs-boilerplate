import { NextRouter } from 'next/router'

/**
 * This function is using for set cookies in browser.
 */
export function setCookie(
  name: string,
  value = '',
  expiredInMinutes = 24 * 60,
  path = '/',
  domain?: string,
) {
  if (typeof window === 'undefined') {
    return
  }
  const date = new Date()
  date.setTime(date.getTime() + expiredInMinutes * 60 * 1000)
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=${path}; ${
    domain ? `domain=${domain}` : ''
  }`
}

/**
 * This function is using for get cookies in browser.
 */
export function getCookie(cookieName: string, stringCookie?: string) {
  if (typeof window === 'undefined') {
    return ''
  }
  const _stringCookie =
    stringCookie === undefined ? document.cookie : stringCookie
  const cookies = _stringCookie.split(';')
  for (let i = 0, l = cookies.length; i < l; i++) {
    const parts: Array<string> = cookies[i].split('=') || []
    // compare cookie name
    if (parts.shift()?.trim() == cookieName) {
      return parts.shift() || ''
    }
  }
  return ''
}

/**
 * Debounce function, call once after timeout
 * will reset & re-wait timeout in case re-call before timeout
 * @param fn callback function
 * @param wait in milliseconds
 * @returns {(...args: any) => void}
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export function ggjDebounce(fn: any, wait?: number) {
  let timerId: any, lastArguments: any, lastThis: any
  return (...args: any) => {
    timerId && clearTimeout(timerId)
    lastArguments = args
    //@ts-ignore
    lastThis = this
    timerId = setTimeout(function () {
      fn.apply(lastThis, lastArguments)
      timerId = null
    }, wait || 400)
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * The native method "Element.scrollIntoView" is not smooth in IOS
 * This function use to "scrollToElSmoothly", support for IOS
 * @param el element scroll to
 * @param duration in milliseconds
 * @param positionOffset control position of element after scroll
 * @param cb callback function
 * @param focusEl if value is true, focus on the element (only working for HTMLInputElement)
 * @returns {(...args: any) => void}
 */
type scrollToElSmoothlyParameter = {
  el: HTMLElement
  duration?: number
  positionOffset?: number
  cb?: () => void
  focusEl?: boolean
  containerId? : string
}

export function scrollToElSmoothly({
  el,
  duration = 300,
  positionOffset,
  cb,
  focusEl = true,
  containerId = '#BodyWrapper',
}: scrollToElSmoothlyParameter) {
  const windowWidth = window.innerWidth
  const bodyBaseEle = document.querySelector(containerId)

  // TODO: Huynh get desktop width from theme
  const isDesktop = windowWidth > 960
  const containerEle = isDesktop ? bodyBaseEle : window

  if (!el || !containerEle) {
    console.error('el or containerEle is invalid!')
    return
  }
  if(isDesktop && !bodyBaseEle) {
    console.error('bodyBase is invalid!')
    return
  }
  const scrollY = (isDesktop ? bodyBaseEle?.scrollTop : window.scrollY) || 0
  const elementPos =
    scrollY +
    el.getBoundingClientRect().top -
    (positionOffset ?? screen.height * 0.3)
  const currentPos = scrollY
  let startTime = 0
  window.requestAnimationFrame(function step(currentTime) {
    startTime = !startTime ? currentTime : startTime
    const progress = currentTime - startTime
    if (currentPos < elementPos) {
      containerEle.scrollTo(
        0,
        ((elementPos - currentPos) * progress) / duration + currentPos,
      )
    } else {
      containerEle.scrollTo(
        0,
        currentPos - ((currentPos - elementPos) * progress) / duration,
      )
    }
    if (progress < duration) {
      window.requestAnimationFrame(step)
    } else {
      containerEle.scrollTo(0, elementPos)
      focusEl && el instanceof HTMLInputElement && el.focus()
      cb && cb()
    }
  })
}

// clone from packages/skijan/node_modules/next/dist/shared/lib/router/router.d.ts:20
interface TransitionOptions {
  shallow?: boolean;
  locale?: string | false;
  scroll?: boolean;
}
/**
 * buildQueryString function
 * create or remove query string and push it to the url
 * @returns {() => void}
 * @param router
 * @param add
 * @param remove
 * @param path
 * @param routerOpt
 */
export const buildQueryString = (
  router: NextRouter,
  add: Record<string, unknown>,
  remove?: Array<string>,
  path?: string,
  routerOpt?: TransitionOptions,
) => {
  const query = router.query
  // Add query string
  for (const [key, value] of Object.entries(add)) {
    if (!value) continue
    query[key] = value as string
  }
  // Remove query string
  remove && remove.map((item) => {
    delete query[item]
  })

  // Push query string
  router.push(Object.assign({
    query: query,
  }, path ? {pathname: path} : {}), undefined, routerOpt)
}

export const uppercaseFirstLetter = (title: string) => {
  if(!title) return ''
  return title.charAt(0).toUpperCase() + title.slice(1)
}

export function handleDecodeURI(str: string) {
  let res = str
  try {
    res = decodeURI(str)
  } catch(e) {
    console.log('error handleDecodeURI', e)
  }
  return res
}
