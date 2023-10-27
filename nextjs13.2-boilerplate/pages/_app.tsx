import 'common/app.css'
import 'common/nprogress.css'
import 'yakuhanjp'

import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { timeZone } from 'common/date'
import { auPayload } from 'common/variables'
import I18nProvider from 'contexts/I18nContext'
import { LayoutProvider } from 'contexts/LayoutContext'
import LoadingProvider from 'contexts/LoadingContext'
import ToastProvider from 'contexts/ToastContext'
import http from 'http'
import type { NextPage } from 'next'
import { appWithTranslation } from 'next-i18next'
import type { AppContext, AppProps } from 'next/app'
import App from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import NProgress from 'nprogress'
import type { ReactElement, ReactNode } from 'react'
import { useEffect, useMemo } from 'react'
import { IAuth, actions } from 'store/appSlice'
import { AppStore, reducerManager, sw } from 'store/store'
import { createThemeObject } from 'theme.config'
import parse from 'ua-parser-js'
import nextI18nConfig from '../next-i18next.config'


export const SCROLL_RESTORATION = 'scrollRestoration'
export const restorationScrollUrls = ['/', '/search'] as const
// import {PWAHead} from '../components/pages/PWAHead'

type AppPropsWithLayout = AppProps & {
  Component: NextPage & {
    Layout: (props: { children: ReactNode }) => ReactElement
  },
  locale: string
  deviceType: string
}


function CommonHead({locale}: { locale: string }) {
  return (
    <Head>
      <link
        rel="icon"
        type="image/x-icon"
        href={`/${locale}/favicon.ico`}
      />
      <meta property="og:title" content="Skijan -スキジャン-" key="og:title"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=no"/>
      <meta charSet="utf-8"/>

      {/*disable browser scroll restoration*/}
      <script
        dangerouslySetInnerHTML={{
          __html: 'history.scrollRestoration = "manual"',
        }}
      />
      {/*<PWAHead />*/}
    </Head>
  )
}

function GgjApp({
  Component, pageProps, deviceType, locale
}: AppPropsWithLayout) {

  const theme = useMemo(() => createThemeObject(deviceType), [deviceType])

  if (!Component.Layout) {
    throw 'Please specific Layout for this page.'
  }
  useAppRouter()

  useEffect(() => {
    // TODO(HUYNH): remove after enable pwa
    if(navigator.serviceWorker){
      navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (const registration of registrations) {
          registration.unregister()
        }
      })
    }
  }, [])


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <I18nProvider locale={locale}>
        <CommonHead locale={locale}/>
        <LayoutProvider>
          <Component.Layout>
            <LoadingProvider>
              <ToastProvider>
                <Component {...pageProps} />
              </ToastProvider>
            </LoadingProvider>
          </Component.Layout>
        </LayoutProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}

interface IncomingMessage extends http.IncomingMessage {
  get cookies(): {
    [key: string]: string;
  }
}

function appendAuth(req: IncomingMessage, store: AppStore) {
  if (typeof window !== 'undefined' /*is client*/) {
    return
  }
  let pl: IAuth | Record<string, never> = {}
  try {
    pl = JSON.parse(req.headers[auPayload] as string || '')
  } catch (e) {
    // do nothing
  } finally {
    store.dispatch(actions.setAuth(pl))
  }
}

function useAppRouter() {
  const router = useRouter()

  useEffect(() => {
    const handleStart = () => {
      NProgress.start()
    }

    const handleComplete = () => {
      handleStop()
    }
    const handleStop = () => NProgress.done()
    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleStop)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router])

  return null
}

GgjApp.getInitialProps = sw.getInitialAppProps(store => async (appContext: AppContext) => {
  const req = appContext?.ctx?.req as IncomingMessage

  const deviceType = parse(req?.headers['user-agent'])?.device.type || 'desktop'
  let locale = req?.cookies?.lang || 'ja'
  if (!timeZone[locale]) {
    // TODO: Hieu Nguyen - set cookie
    locale = 'ja'
  }
  reducerManager.restoreReducer()
  appendAuth(req, store)
  return {
    ...(await App.getInitialProps(appContext)),
    locale,
    deviceType
  }
})

export default sw.withRedux(appWithTranslation(GgjApp, nextI18nConfig))
