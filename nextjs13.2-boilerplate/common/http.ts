import axios, { AxiosRequestHeaders } from 'axios'
import getConfig from 'next/config'
import { NextRequest } from 'next/server'
import { auPayload } from './variables'
import { IncomingMessage } from 'http'
import { GGJ_REDIRECT_CODE } from './constant'
import Router from 'next/router'

let options = {
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    // 'au-payload':'{"userId":182312}'
  },
}

// if is in server
if (typeof window === 'undefined') {
  const {serverRuntimeConfig} = getConfig()
  options = Object.assign({}, options, {
    baseURL: serverRuntimeConfig.SKIJAN_API_URL,
  })
} else {
  options = Object.assign({}, options, {
    baseURL: '/ja',
  })
}

const http = axios.create(options)

if(typeof window !== 'undefined') {
  const {publicRuntimeConfig} = getConfig()
  http.interceptors.response.use(function (response) {
    return response
  }, async function (error) {
    if(error?.response?.status === GGJ_REDIRECT_CODE) {
      await Router.push({
        pathname: `${publicRuntimeConfig.ACCOUNT_HOST_URL}/login`,
        query: {clientId: 'skj', u: window.location.href}
      })
      await new Promise(resolve => setTimeout(resolve, 5e3))
    }
    return Promise.resolve(error)
  })
}

export default http

// using to append request header at server side
export function appendGgjHeader({req}: { req: NextRequest | IncomingMessage }): AxiosRequestHeaders {
  const headerKeys = [auPayload,'user-agent', 'x-forwarded-for']
  const headers = req.headers as unknown as Record<string, string>
  const reqHeader = {} as unknown as Record<string, string>
  headerKeys.forEach(item => headers[item] ? reqHeader[item] = headers[item] : '')
  return reqHeader
}
