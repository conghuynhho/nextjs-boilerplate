import {ForwardedRef, forwardRef, memo} from 'react'
import {css} from '@emotion/react'
import {Button, ButtonProps} from '@mui/material'
import {styled} from '@mui/material/styles'
import {rgba} from 'emotion-rgba'
import {GgjButtonProps} from './const'

const TextButton = styled(Button)<ButtonProps>(({theme}) => {
  return {
    fontSize: 16,
    fontWeight: 500,
    padding: `10px ${theme.spacing(2)}`,
    height: '44px',
    border: 'none',
    lineHeight: theme.spacing(3),
    backgroundColor: 'transparent',
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.primary.main,
    letterSpacing: '1.42px',
    borderRadius: 'none',
    '&:hover': {
      backgroundColor: rgba(theme.palette.primary.main, 0.1),
      color: theme.palette.primary.main,
      boxShadow: 'none',
      cursor: 'pointer',
    },
    '&:active': {
      backgroundColor: rgba(theme.palette.primary.main, 0.1),
      color: theme.palette.primary.main,
      boxShadow: 'none',
      cursor: 'pointer',
    },
    '&:focus': {
      boxShadow: 'none',
    },
    '&:disabled': {
      boxShadow: 'none',
      color: rgba(theme.palette.primary.main, 0.5),
    },
  }
})

const GgjButton = forwardRef(({
  cssStr,
  ...props
}: GgjButtonProps, ref: ForwardedRef<HTMLButtonElement>) => {
  return (
    <TextButton
      {...props}
      ref={ref}
      css={css`
        ${cssStr}
      `}
    />
  )
})
GgjButton.displayName = 'GgjButton'
export const GgjTextButton = memo(GgjButton)

