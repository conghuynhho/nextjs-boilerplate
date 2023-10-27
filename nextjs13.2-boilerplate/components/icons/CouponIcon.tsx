import {SvgIcon} from '@mui/material'
import {SerializedStyles} from '@emotion/react'

interface Props {
  css?: SerializedStyles
}

export default function IconCouponSvg(props?: Props) {
  return (
    <SvgIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
      <g id="_レイヤー_1-2">
        <g>
          <rect style={{opacity: '0'}} width="24" height="24"/>
          <g>
            <path
              d="M20,6v2.54c-1.19,.69-2,1.99-2,3.46s.81,2.77,2,3.46v2.54H4v-2.54c1.19-.69,2-1.99,2-3.46s-.81-2.77-2-3.46v-2.54H20m0-2H4c-1.1,0-2,.9-2,2v4c1.1,0,2,.9,2,2s-.9,2-2,2v4c0,1.1,.9,2,2,2H20c1.1,0,2-.9,2-2v-4c-1.1,0-2-.9-2-2s.9-2,2-2V6c0-1.1-.9-2-2-2h0Z"/>
            <g>
              <rect x="8" y="5" width="2" height="2"/>
              <rect x="8" y="8" width="2" height="2"/>
              <rect x="8" y="11" width="2" height="2"/>
              <rect x="8" y="14" width="2" height="2"/>
              <rect x="8" y="17" width="2" height="2"/>
            </g>
          </g>
        </g>
      </g>
    </SvgIcon>
  )
}
