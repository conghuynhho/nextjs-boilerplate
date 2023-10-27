import {SerializedStyles} from '@emotion/react'
import SvgIcon from '@mui/material/SvgIcon'
import {css} from '@emotion/css'

interface Props {
  css?: SerializedStyles
}

export default function EditDraftIcon(props?: Props) {
  const cls1 = css`fill:#fff;opacity:0;`

  return (
    <SvgIcon viewBox="0 0 24 24" {...props}>
      <rect className={cls1} width="24" height="24" />
      <path xmlns="http://www.w3.org/2000/svg" d="M19,3h-6c-1.1,0-2,.9-2,2v7.15l-1.6-1.55-1.4,1.4,4,4,4-4-1.4-1.4-1.6,1.55V4.8h6.2v14.4H4.8V4.8h3.6v-1.8h-3.4c-1.1,0-2,.9-2,2v14c0,1.1,.9,2,2,2h14c1.1,0,2-.9,2-2V5c0-1.1-.9-2-2-2Z"/>
    </SvgIcon>
  )
}
