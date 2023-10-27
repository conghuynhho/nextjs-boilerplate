import { ReactNode } from 'react'
import { Header } from './Header'
import { NavBar } from 'components/layouts/common/NavBar'

import { BodyBase } from 'components/layouts/common/BodyBase'
import { css } from '@emotion/react'
import {
  SPACING_HEADER,
  HEADER_HEIGHT_XS,
  HEADER_HEIGHT_LG,
} from 'components/layouts/const'
import { useTheme } from '@mui/material/styles'
import { useLayoutContext } from 'contexts/LayoutContext'
import { nsNavBarComp } from 'components/layouts/common/NavBar'
import {nsCommonCategories} from '../../../common/categories'

export const nsTranInquiryLayout = ['layouts@inquiry-layout', nsNavBarComp, nsCommonCategories]

export function InquiryLayout(props: { children: ReactNode }) {
  const theme = useTheme()
  const { layoutSetting } = useLayoutContext()
  const { backgroundColor } = layoutSetting
  return (
    <div
      css={css`
        background-color: ${backgroundColor};
      `}
    >
      <Header />
      <div
        css={css`
          background-color: ${theme.palette.canvas.main};
          padding-top: calc(${HEADER_HEIGHT_XS}px + ${theme.spacing(2)});
          @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
            padding-top: ${HEADER_HEIGHT_LG + SPACING_HEADER}px;
          }
        `}
      >
        <BodyBase>{props.children}</BodyBase>
      </div>
      <NavBar />
    </div>
  )
}
