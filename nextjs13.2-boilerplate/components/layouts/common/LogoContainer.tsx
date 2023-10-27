import {ComponentPropsWithoutRef} from 'react'
import {useTheme} from '@mui/material/styles'
import Link from 'next/link'
import {Button} from '@mui/material'
import {css, SerializedStyles} from '@emotion/react'

export default function LogoContainer(props: ComponentPropsWithoutRef<'div'> & { href: string, cssStr?: SerializedStyles }) {
  const theme = useTheme()
  return (
    <Link href={props.href} passHref >
      <Button
        css={css`
          min-width: 0;
          overflow: hidden;
          border-radius: 0;
          height: ${theme.spacing(6)};
          width: ${theme.spacing(6)};
          transition: ${theme.transitions.create(['box-shadow'], { duration: 'complex' })};
          cursor: pointer;
          box-shadow: ${theme.shadows[0]};
          display: block;
          padding: 0;
          transition: box-shadow ${theme.transitions.duration.standard};
          svg {
            height: 100%;
            width: 100%;
          }
          &:hover {
            background: transparent;
          }
          &:active {
            box-shadow: ${theme.shadows[0]};
          }
          ${props.cssStr}
      `}
      >{props.children}</Button>
    </Link>
  )
}
