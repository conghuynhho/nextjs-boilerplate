import {useEffect} from 'react'
import {renderConsentCookie} from '@ggj/consent-cookie'
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()
export default function useConsentCookie() {
  useEffect(() => {
    renderConsentCookie({
      lang: 'ja',
      domain: publicRuntimeConfig.SKJ_DOMAIN,
      isSkijan: true,
    }).then()
  }, [])
}