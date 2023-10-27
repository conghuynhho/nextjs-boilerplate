import {memo, useMemo, ReactNode} from 'react'
import Head from 'next/head'
import {useI18nContext} from 'contexts/I18nContext'
import {useRouter} from 'next/router'
import getConfig from 'next/config'
import parse from 'html-react-parser'
import {uppercaseFirstLetter} from '../../../common/utils'

const MAX_DES_AND_KEY_LENGTH = 160

interface IHeadData {
  title: string
  description: string
  keywords: string
  imageUrl?: string
  canonicalUrl?: string
}

const processingData = (data: IHeadData) : IHeadData => {
  const formatTitle = uppercaseFirstLetter(data.title)
  const formatDes = uppercaseFirstLetter(data.description)
  let title = formatTitle
  try {
    title = parse(formatTitle) as string
  } catch(e) {
    console.log(e)
  }

  let description = formatDes
  try {
    description = parse(formatDes) as string
  } catch(e) {
    console.log(e)
  }

  return {
    ...data,
    title,
    description: description.substring(0, MAX_DES_AND_KEY_LENGTH),
    keywords: data.keywords.substring(0, MAX_DES_AND_KEY_LENGTH)
  }
}

function GgjCommonHead(props: {data: IHeadData, children?: ReactNode}) {
  const {data, children} = props
  const {locale} = useI18nContext()
  const resultData = processingData(data)
  const router = useRouter()
  const { publicRuntimeConfig: {SKJ_HOST_URL, WEBSITE_LANGUAGE} } = getConfig()
  const SKJ_URL = SKJ_HOST_URL + '/' + WEBSITE_LANGUAGE
  const currentUrl = useMemo(() => SKJ_URL + (router.asPath === '/' ? '' : router.asPath), [])
  return (
    <Head>
      {/* common */}
      <title key="title">{resultData.title}</title>
      <meta key="meta-title" name="title" content={resultData.title}/>
      <meta key="meta-description" name="description" content={resultData.description}/>
      <meta key="meta-keywords" name="keywords" content={resultData.keywords}/>
      <link key="canonical" rel="canonical" href={data?.canonicalUrl || currentUrl} />

      {/* facebook */}
      <meta key="og:title" name="og:title" content={resultData.title}/>
      <meta key="og:description" name="og:description" content={resultData.description}/>
      <meta key="og:type" name="og:type" content="website"/>
      <meta key="og:image" name="og:image" content={SKJ_URL + (resultData.imageUrl || '/static/images/SkijanSNSImage.png')}/>
      <meta key="og:url" name="og:url" content={currentUrl}/>
      <meta key="og:locale" name="og:locale" content={locale}/>
      <meta key="og:site_name" name="og:site_name" content="Skijan"/>

      {/* twitter */}
      <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
      <meta key="twitter:site" name="twitter:site" content="@skijan" />

      {Boolean(children) && children}
    </Head>
  )
}


export default memo(GgjCommonHead)
