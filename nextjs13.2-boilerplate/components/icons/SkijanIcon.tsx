import { SerializedStyles } from '@emotion/react'
import SvgIcon from '@mui/material/SvgIcon'
import { css } from '@emotion/react'

interface Props {
  css?: SerializedStyles,
  bg?: string
}

export default function SkijanIcon(props: Props) {
  return (
    <SvgIcon viewBox="0 0 80 80" {...props}>
      <rect fill={props.bg} width="80" height="80"/>
      <path fill="currentColor" d="M60.5,37.71l-1.56-.48a1.08,1.08,0,0,1,.12.24.87.87,0,0,1-.58,1.09l-7.65,2.37L43.49,43.2a10.39,10.39,0,0,1-6.05,0l-7.33-2.27-7.66-2.37a.86.86,0,0,1-.58-.58.83.83,0,0,1,.14-.75l-1.58.48A7,7,0,0,0,15.5,44.4v5.11a7,7,0,0,0,4.93,6.69l15.9,4.91a14,14,0,0,0,8.27,0L60.5,56.2a7,7,0,0,0,4.93-6.69V44.4A7,7,0,0,0,60.5,37.71Z"/>
      <path fill="currentColor" id="パス_505" data-name="パス 505" d="M34.5,18.11h0l5.08,21.55L26.26,26.34l-5.08-5.08Z"/>
      <circle fill="currentColor" cx="45.86" cy="27.47" r="4"/>
    </SvgIcon>
  )
}

SkijanIcon.defaultProps = {
  css: css``,
  bg: 'white'
}
