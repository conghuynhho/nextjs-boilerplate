import {SerializedStyles} from '@emotion/react'
import SvgIcon from '@mui/material/SvgIcon'

interface Props {
  css?: SerializedStyles
}

export default function DealChat(props?: Props) {
  return (
    <SvgIcon viewBox="0 0 24 24" {...props}>
      <g>
        <g>
          <path
            d="M12,5a7,7,0,0,1,7,7.37A7.25,7.25,0,0,1,11.68,19H6.9a2.54,2.54,0,0,0-.35-2.6A7,7,0,0,1,11.13,5.05,8.46,8.46,0,0,1,12,5m0-2a8.23,8.23,0,0,0-1.1.07A9,9,0,0,0,5,17.66c.39.48-.52,1.69-1.23,2.51a.5.5,0,0,0,.38.83h7.53A9.22,9.22,0,0,0,21,12.48,9,9,0,0,0,12,3Z"/>
          <circle cx="8" cy="12" r="1"/>
          <circle cx="12" cy="12" r="1"/>
          <circle cx="16" cy="12" r="1"/>
        </g>
      </g>
    </SvgIcon>
  )
}
