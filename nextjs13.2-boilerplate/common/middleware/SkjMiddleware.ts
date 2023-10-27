import {auPayload} from '../variables'
import getConfig from 'next/config'
//TODO: Unused it https://gogojungle.backlog.jp/view/OAM-85376
export function skjMiddleware(req: any, resolvedUrl: string) {
  const redirectUrl = `/mypage/display/register?u=${resolvedUrl}`
  const apl = req.headers[auPayload] as string
  const {publicRuntimeConfig: {ACCOUNT_HOST_URL, SKJ_HOST_URL}} = getConfig()
  try {
    const auPayloadHeader = JSON.parse(apl)

    // eslint-disable-next-line no-prototype-builtins
    if (!auPayloadHeader.hasOwnProperty('isSkjDeveloper')) {
      return {
        redirect: {
          destination: `${ACCOUNT_HOST_URL}/login?clientId=skj&u=${SKJ_HOST_URL}${resolvedUrl}`,
          permanent: false,
        },
      }
    }

    if (auPayloadHeader.isSkjDeveloper) {
      return true
    } else {
      return {
        redirect: {
          destination: redirectUrl,
          permanent: false,
        },
      }
    }
  } catch (e) {
    console.error(e)
  }
  return {
    redirect: {
      destination: redirectUrl,
      permanent: false,
    },
  }
}
