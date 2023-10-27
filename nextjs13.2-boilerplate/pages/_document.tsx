import Document, {DocumentContext, DocumentInitialProps, Head, Html, Main, NextScript,} from 'next/document'
import createEmotionServer from '@emotion/server/create-instance'
import {cache} from '@emotion/css'

export const renderStatic = async (html: DocumentInitialProps['html']) => {
  if (html === undefined) {
    throw new Error('did you forget to return html from renderToString?')
  }
  const {extractCritical} = createEmotionServer(cache)
  const {ids, css} = extractCritical(html)
  return {html, ids, css}
}


// related next document: https://nextjs.org/docs/advanced-features/custom-document
export default class AppDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    const {css, ids} = await renderStatic(initialProps.html)
    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          <style
            data-emotion={`css ${ids.join(' ')}`}
            dangerouslySetInnerHTML={{__html: css}}
          />
        </>
      ),
    }
  }

  render() {
    return (
      <Html lang='ja'>
        <Head>
          <meta httpEquiv="content-language" content="ja"/>
          {/* eslint-disable-next-line @next/next/no-page-custom-font */}
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
            rel="stylesheet"/>
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans&family=Noto+Sans+JP:wght@100;300;400;500;700;900&family=Roboto:wght@300;400;500;700&display=swap"
            rel="stylesheet"/>
        </Head>
        <body>
          <Main/>
          <NextScript/>
        </body>
      </Html>
    )
  }
}
