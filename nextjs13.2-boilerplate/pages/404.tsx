// import {nsTranSurfaceLayout, SurfaceLayout} from 'components/layouts'
import {css} from '@emotion/react'
import image404 from 'components/pages/404.png'
import {NoSsr, Stack, Typography} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import Image from 'next/legacy/image'
import {GgjOutlineButton} from 'components/commons/GgjButton'
import Link from 'next/link'
import {ReactElement} from 'react'
import { BlankLayout } from 'components/layouts/BlankLayout'
import { useTranslation } from 'next-i18next'

const nsTran = 'common@common-error'

export function withNoSsr(Component: React.FC<{ children: ReactElement }>) {
  const NoSsrWrapper = (props: { children: ReactElement }) => {
    return (
      <NoSsr>
        <Component {...props} />
      </NoSsr>
    )
  }
  return NoSsrWrapper
}



export default function MyError() {
  const {t} = useTranslation(nsTran)

  // nsTranSurfaceLayout.push(nsTran)
  // for (const ns of nsTranSurfaceLayout) {
  //   // eslint-disable-next-line @typescript-eslint/no-var-requires
  //   const json = require(`lang/ja/${ns}.json`)
  //   i18n?.addResourceBundle('ja', ns, json)
  // }
  const theme = useTheme()
  return (
    <Stack justifyContent="center" alignItems="center" direction="column" css={css`
      background-color: ${theme.palette.primary.main};
      width: 100%;
      height: 100vh;
      padding: 0 16px;
      @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
        padding: unset;
      }`}>
      <div css={css`
        width: 240px;
        height: 240px;
        @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
          width: 300px;
          height: 300px;

        }`}>
        <Image objectFit="contain" src={image404} alt="404ErrorSkjian"/>
      </div>
      <Typography css={css`
        margin: 24px 0 16px 0;
        color: white;
        font-weight: 600;
        font-size: 16px;
        @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
          font-size: 24px;
          margin-bottom: 24px;
        }`}>{t('1')}</Typography>
      <Typography css={css`
        margin-bottom: 24px;
        @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
          margin-bottom: 41px;
        }
        text-align: center;
        color: white;
        line-height: 20px;
      `} variant="subtitle2">{t('2')}</Typography>
      <Link
        href="/"
        passHref
        css={css`
          text-decoration: none;`}>

        <GgjOutlineButton css={css`
          background-color: white;
          font-weight: 600;
          width: 210px;
          height: 44px;

          :hover {
            color: ${theme.palette.primary.main};
            background-color: white;
          }`}>
          {t('3')}
        </GgjOutlineButton>

      </Link>
    </Stack>
  )
}

MyError.Layout = withNoSsr(BlankLayout)
