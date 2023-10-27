import {ReactNode} from 'react'
import {useTheme} from '@mui/material/styles'
import {css, SerializedStyles} from '@emotion/react'
import {useLayoutContext} from 'contexts/LayoutContext'

export function BodyBase(props: { children: ReactNode, maxWidth?: number, wCss?: SerializedStyles }) {
  const theme = useTheme()
  const {layoutSetting} = useLayoutContext()
  const {maxWidth} = layoutSetting
  const maxWidthBody = typeof (maxWidth) === 'number' ? `${maxWidth}px` : 'unset'
  return (
    <main
      css={css`
        max-width: ${maxWidthBody};
        margin: 0 auto;
        padding: 0 ${theme.spacing(3)};
        @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
          padding: 0 ${theme.spacing(5)};
        }
        @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
          padding: 0 ${theme.spacing(4)};
        }
        ${props.wCss}
      `}
    >
      {props.children}
    </main>
  )
}
