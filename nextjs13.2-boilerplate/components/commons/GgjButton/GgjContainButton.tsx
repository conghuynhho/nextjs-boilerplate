import {ForwardedRef, forwardRef, memo} from 'react'
import {css} from '@emotion/react'
import {Button, ButtonProps} from '@mui/material'
import {styled} from '@mui/material/styles'
import {rgba} from 'emotion-rgba'
import {GgjButtonProps} from './const'

const ContainButton = styled(Button)<ButtonProps>(({theme}) => {
  return {
    fontSize: 16,
    fontWeight: 500,
    padding: `10px ${theme.spacing(3)}`,
    height: '44px',
    border: '1px solid',
    lineHeight: theme.spacing(3),
    backgroundColor: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    fontFamily: theme.typography.fontFamily,
    letterSpacing: '1.42px',
    color: '#FFFFFF',
    borderRadius: '10px',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      borderColor: theme.palette.primary.dark,
      boxShadow: 'none',
      cursor: 'pointer',
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: theme.palette.primary.main,
      borderColor: theme.palette.primary.main,
      color: '#FFFFFF',
    },
    '&:focus': {
      boxShadow: 'none',
    },
    '&:disabled': {
      boxShadow: 'none',
      cursor: 'not-allowed',
      backgroundColor: rgba(theme.palette.primary.main, 0.5),
      borderColor: 'transparent',
      color: '#FFFFFF',
    },
  }
})

const GgjButton = forwardRef(({
  cssStr,
  ...props
}: GgjButtonProps, ref: ForwardedRef<HTMLButtonElement>) => {
  return (
    <ContainButton
      {...props}
      ref={ref}
      css={css`
        ${cssStr}
      `}
    />
  )
})
GgjButton.displayName = 'GgjButton'
export const GgjContainButton = memo(GgjButton)
