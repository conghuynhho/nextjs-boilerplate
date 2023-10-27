import {Typography} from '@mui/material'
import {css} from '@emotion/react'
import React from 'react'

export default function GgjHiddenH1({text}: {text?: string}) {
  return (
    <Typography
      variant="h1"
      css={css`
          position: absolute;
          clip: rect(1px, 1px, 1px, 1px);
          clip-path: inset(0px 0px 99.9% 99.9%);
          overflow: hidden;
          height: 1px;
          width: 1px;
          padding: 0;
          border: 0;
        `}
    >{text ?? 'SKIJAN'}</Typography>
  )
}
