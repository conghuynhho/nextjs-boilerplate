import getConfig from 'next/config'

const {publicRuntimeConfig} = getConfig()
const {
  WEBSITE_LANGUAGE,         // 'ja', 'en', 'th', 'vi'
  WEBSITE_CURRENCY_SYMBOL,  // '￥', '₫', '$'
} = publicRuntimeConfig

export { WEBSITE_LANGUAGE, WEBSITE_CURRENCY_SYMBOL }
export * from './types'
