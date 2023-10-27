import {Typography} from '@mui/material'
import {memo, ReactNode} from 'react'
import { css } from '@emotion/react'
import { useTheme } from '@mui/material/styles'

const Title = ({children}:{children:ReactNode}) => {
  const theme = useTheme()
  return <Typography variant='caption' css={css`color: ${theme.palette.text.primary};line-height: 20px; font-weight: 500;`}>
    {children}
  </Typography>
}

export default memo(Title)
