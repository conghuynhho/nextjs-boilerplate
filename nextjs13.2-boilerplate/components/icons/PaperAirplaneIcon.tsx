import {SerializedStyles} from '@emotion/react'
import SvgIcon from '@mui/material/SvgIcon'
import {css} from '@emotion/css'

interface Props {
  css?: SerializedStyles
}

export default function PaperAirplaneIcon(props?: Props) {
  const cls1 = css`fill:#fff;opacity:0;`
  const cls2 = css`fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;`

  return (
    <SvgIcon viewBox="0 0 24 24" {...props}>
      <g xmlns="http://www.w3.org/2000/svg" id="b">
        <g id="c">
          <g>
            <rect className={cls1} width="24" height="24"/>
            <g>
              <rect className={cls1} x="2" y="2" width="20" height="20"/>
              <g>
                <polyline className={cls2} points="8.56 14.05 2.5 11.55 21.5 3.95 19.15 18.42 12.11 15.52"/>
                <polyline className={cls2} points="12.95 11.05 8.64 14.08 10.46 20.05 14.04 16.31"/>
                <polyline className={cls2} points="21.5 3.95 13.14 14.08 12.67 14.65 12 15.47 10.46 20.05"/>
              </g>
            </g>
          </g>
        </g>
      </g>
    </SvgIcon>
  )
}
