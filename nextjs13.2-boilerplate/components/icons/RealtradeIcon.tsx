import { css } from '@emotion/css'
import { SerializedStyles } from '@emotion/react'
import SvgIcon from '@mui/material/SvgIcon'
interface Props { css?: SerializedStyles }

export default function RealtradeIcon(props?: Props) {
  const cls1 = css`fill: none;`
  const cls2 = css`fill: #f28008;`
  const cls3 = css`clip-path:url(#clip-path);`
  const cls4 = css`fill:#fff;`
  return (
    <SvgIcon {...props} viewBox="0 0 80 80">
      <defs>
        <clipPath id="clip-path">
          <rect className={cls1} y="12.26" width="80" height="55.47" />
        </clipPath>
      </defs>
      <rect className={cls2} width="80" height="80" />
      <g id="グループ_4897" data-name="グループ 4897">
        <g className={cls3}>
          <g id="グループ_4895" data-name="グループ 4895">
            <path id="パス_1087" data-name="パス 1087" className={cls4}
              d="M71.13,57a66,66,0,0,0-6.79-7.3C72.28,47.84,77,40.7,77,32.08c0-15.84-13.85-19.82-24.82-19.82H40.63L30.06,26.69H53.38c5.12,0,8.22,2.16,8.22,6.47,0,3.81-3.61,6.22-8.22,6.22H20.77L0,67.73H16.92L27.65,53.06H49.27L60,67.73H80Z" />
          </g>
        </g>
      </g>
    </SvgIcon>
  )
}
