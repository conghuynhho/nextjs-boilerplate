import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NextRequest } from 'next/server'
import {IncomingMessage} from 'http'

export async function ggjServerSideTranslations(
  req: NextRequest | IncomingMessage,
  ns: string[]|string,
  layoutNS?: string|string[],
) {
  if (typeof ns == 'string') {
    ns = [ns]
  }
  // add common i18n
  typeof layoutNS == 'string' && (layoutNS = [layoutNS])
  layoutNS && (ns = ns.concat([...layoutNS,'common@common-error']))
  // req.cookies.lang = 'ja' // In this phase, we only have ja language
  // return serverSideTranslations(req.cookies?.lang || 'ja', ns)
  return serverSideTranslations('ja', ns)
}
