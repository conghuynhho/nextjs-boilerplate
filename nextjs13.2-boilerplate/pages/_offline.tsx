
import { BlankLayout } from 'components/layouts/BlankLayout'
import { NextPageContext } from 'next'
import NextErrorComponent, { ErrorProps } from 'next/error'

// interface INetworkErr {
//   offlineTitle: string,
//   offlineContent: string,
// }

// const NetWorkErrorComp = (props: INetworkErr) => {
//   const theme = useTheme()
//   const errorMessage = {
//     title: props.offlineTitle,
//     content: props.offlineContent
//   }
//   return (
//     <Stack justifyContent="center" alignItems="center" direction="column" css={css`
//       background-color: ${theme.palette.smoke.light};
//       width: 100%;
//       padding: 0 16px;
//       height: 100vh;`}>
//       <div css={css`
//         width: 240px;
//         height: 240px;
//         @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
//           width: 300px;
//           height: 300px;
//         }`}>
//         <img css={css` object-fit: contain;
//           width: 100%;
//           height: auto;`} src="static/pwa/images/offline.png" alt="Offline Image"/>
//       </div>
//       <Typography css={css`
//         margin: 24px 0 16px 0;
//         color: ${theme.palette.jade.dark};
//         font-size: 16px;
//         font-weight: bold;
//         @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
//           font-size: 24px;
//           margin-bottom: 27px;
//         }`}>
//         {errorMessage.title}
//       </Typography>
//       <Typography
//         css={css`
//           margin-bottom: 41px;
//           text-align: center;
//           color: ${theme.palette.jade.dark};
//           line-height: 20px;
//         `}
//         variant="subtitle2"
//       >
//         {errorMessage.content}
//       </Typography>
//     </Stack>
//   )
// }

function Offline() {
  // for (const ns of nsTranSurfaceLayout) {
  //   // eslint-disable-next-line @typescript-eslint/no-var-requires
  //   const json = require(`lang/ja/${ns}.json`)
  //   i18n?.addResourceBundle('ja', ns, json)
  // }
  // const {t} = useTranslation(nsTranSurfaceLayout)

  // const headData = useMemo(() => ({
  //   title: t('meta-err-title'),
  //   description: t('meta-err-desc'),
  //   keywords: t('meta-err-keywords'),
  // }), [])

  return (
    <>
      {/* <GgjCommonHead data={headData}/> */}
      {/* <NetWorkErrorComp offlineTitle={t('offline-title')} offlineContent={t('offline-content')}/> */}
      <h2>OFFLINE</h2>
    </>
  )
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  // const {err, req} = ctx
  const props = NextErrorComponent.getInitialProps(ctx) as ErrorProps
  const statusCode = props.statusCode

  if (statusCode === 500) {
    console.log('Error 500')
  }

  return {props: {}}
}

Offline.Layout = BlankLayout
export default Offline
