import { css } from '@emotion/css'
import { SerializedStyles } from '@emotion/react'
import SvgIcon from '@mui/material/SvgIcon'
interface Props { css?: SerializedStyles }

export default function GogojungleIcon(props?: Props) {
  const cls1 = css`fill: #FAFAFA;`
  const cls2 = css`fill: #f60;`
  const cls3 = css`fill: #9c3;`
  const cls4 = css`fill: #39f;`
  return (
    <SvgIcon {...props} viewBox="0 0 80 80">
      <rect className={cls1} width="80" height="80" />
      <path className={cls2} d="M53.9,24.63a1.11,1.11,0,1,1,1.1,1.1h0a1.1,1.1,0,0,1-1.1-1.1" />
      <path className={cls2} d="M10,55.37a1.11,1.11,0,0,1,2.21,0,1.11,1.11,0,1,1-2.21,0h0" />
      <path className={cls2} d="M25.52,54.49a1.11,1.11,0,1,1,1.1,1.1,1.11,1.11,0,0,1-1.1-1.1h0" />
      <path className={cls2} d="M36.31,42.51a1.11,1.11,0,0,1,2.21,0,1.11,1.11,0,1,1-2.21,0h0" />
      <path className={cls2} d="M45.47,52.86a1.11,1.11,0,1,1,2.21,0,1.1,1.1,0,0,1-1.1,1.1h0a1.11,1.11,0,0,1-1.11-1.1h0" />
      <path className={cls2} d="M17,37.63a1.1,1.1,0,1,1,1.1,1.11h0A1.11,1.11,0,0,1,17,37.63" />
      <path className={cls3} d="M44.73,44.43a1.11,1.11,0,1,1,1.11,1.11,1.11,1.11,0,0,1-1.11-1.11h0" />
      <path className={cls3} d="M60.55,28.92A1.11,1.11,0,1,1,61.66,30h0a1.1,1.1,0,0,1-1.1-1.1h0" />
      <path className={cls3} d="M37.2,36.9a1.11,1.11,0,0,1,2.21,0A1.11,1.11,0,0,1,38.3,38h0a1.1,1.1,0,0,1-1.1-1.1h0" />
      <path className={cls3} d="M29.07,44.88a1.11,1.11,0,1,1,1.1,1.1h0a1.1,1.1,0,0,1-1.1-1.1h0" />
      <path className={cls3} d="M21.09,36.9a1.1,1.1,0,1,1,1.1,1.1,1.11,1.11,0,0,1-1.1-1.1" />
      <path className={cls3} d="M10,47.83a1.11,1.11,0,1,1,1.1,1.11A1.1,1.1,0,0,1,10,47.83h0" />
      <path className={cls3}
        d="M11.38,48.25l-.62-.63,11-11a.45.45,0,0,1,.63,0l7.76,7.77,7.75-7.74a.44.44,0,0,1,.62,0l7.3,7.3L61.29,28.47l.63.63L46.17,44.84a.44.44,0,0,1-.62,0l-7.3-7.3-7.74,7.74a.45.45,0,0,1-.63,0l-7.77-7.77Z" />
      <polygon className={cls2}
        points="11.48 55.58 10.65 55.26 17.59 37.31 18.4 37.27 26.71 53.75 37.06 42.16 37.73 42.16 46.39 51.98 54.54 24.55 55.39 24.8 47.01 53 46.25 53.17 37.39 43.12 26.94 54.83 26.21 54.73 18.06 38.56 11.48 55.58" />
      <path className={cls4} d="M44.44,38.82a1.11,1.11,0,1,1,1.11,1.1,1.11,1.11,0,0,1-1.11-1.1h0" />
      <path className={cls4} d="M28.18,38.82a1.11,1.11,0,1,1,1.11,1.1h0a1.1,1.1,0,0,1-1.1-1.1h0" />
      <path className={cls4} d="M18,49a1.11,1.11,0,1,1,1.11,1.1h0A1.11,1.11,0,0,1,18,49h0" />
      <path className={cls4} d="M36.31,46.8a1.11,1.11,0,1,1,1.1,1.1,1.1,1.1,0,0,1-1.1-1.1h0" />
      <path className={cls4} d="M52,46.5a1.11,1.11,0,0,1,2.21,0,1.11,1.11,0,0,1-1.11,1.11h0a1.1,1.1,0,0,1-1.1-1.1h0" />
      <path className={cls4} d="M67.79,30.69a1.11,1.11,0,1,1,1.11,1.1,1.11,1.11,0,0,1-1.11-1.1h0" />
      <path className={cls4}
        d="M19.46,49.29l-.63-.63L29,38.47a.44.44,0,0,1,.62,0h0l7.77,7.77,7.74-7.73a.45.45,0,0,1,.63,0l7.32,7.32L68.53,30.4l.63.62L53.42,46.77a.45.45,0,0,1-.63,0l-7.32-7.32-7.74,7.74a.45.45,0,0,1-.63,0l-7.76-7.77Z" />
    </SvgIcon>
  )
}
