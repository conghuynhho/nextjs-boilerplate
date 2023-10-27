import { MouseEvent, ReactNode, memo } from 'react'
import { css } from '@emotion/react'
import { useTheme } from '@mui/material/styles'
import { DialogTitle, IconButton, Typography } from '@mui/material'
import { Close } from '@mui/icons-material'

function ModalTitle(props: {
  onClose: (e: MouseEvent<HTMLElement>) => void
  title?: ReactNode
}) {
  const theme = useTheme()
  return (
    <DialogTitle css={css`
      padding: ${theme.spacing(1)};
    `}>
      <div css={css`
        min-height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
      `}>
        <Typography variant='body2'>
          <b>{props.title}</b>
        </Typography>
        <IconButton
          onClick={props.onClose}
          aria-label="close"
          css={css`position: absolute; right: 0;`}
        >
          <Close/>
        </IconButton>
      </div>
    </DialogTitle>
  )
}

export default memo(ModalTitle)
