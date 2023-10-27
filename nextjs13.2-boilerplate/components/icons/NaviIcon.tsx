import { css } from '@emotion/css'
import SvgIcon from '@mui/material/SvgIcon'
import { SerializedStyles } from '@emotion/react'
interface Props { css?: SerializedStyles }

export default function NaviIcon(props?: Props) {
  const cls1 = css`fill: #fff;`
  const cls2 = css`fill: url(#名称未設定グラデーション_12);`
  const cls3 = css`fill: url(#名称未設定グラデーション_12-2);`
  return (
    <SvgIcon {...props} viewBox="0 0 80 80">
      <defs>
        <linearGradient id="名称未設定グラデーション_12" x1="40" y1="80" x2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f0ea4b" />
          <stop offset="1" stopColor="#2772a4" />
        </linearGradient>
        <linearGradient id="名称未設定グラデーション_12-2" y1="33.68" x2="40" y2="33.6"/>
      </defs>
      <rect className={cls1} width="80" height="80" rx="15" />
      <path className={cls2}
        d="M80,0H0V80H80ZM71.19,75.21,48.78,65.92,53.13,49,41.66,35.54V50.1a3.35,3.35,0,0,1,.69,5.11c-2.65,2-5.57.17-5.57-2.36a3.21,3.21,0,0,1,1.56-2.75V35.54L26.87,49l4.35,16.94L8.81,75.21a2,2,0,0,1,0-2.84L38.58,6.5a2,2,0,0,1,2.84,0L71.19,72.37A2,2,0,0,1,71.19,75.21Z" />
      <polygon className={cls3} points="39.93 33.68 40.07 33.68 40 33.6 39.93 33.68" />
    </SvgIcon>
  )
}
