import { css } from '@emotion/react'
import { SerializedStyles } from '@emotion/react'
import SvgIcon from '@mui/material/SvgIcon'
interface Props { css?: SerializedStyles }

export default function UserCheck(props?: Props) {
  const cls1 = css`fill: #E1E1E1;`
  return (
    <SvgIcon {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" css={cls1}>
      <path d="M0 0h24v24H0z" fill="none" fillRule="evenodd" />
      <g fillRule="evenodd">
        <path d="M9 17l3-2.94c-.39-.04-.68-.06-1-.06-2.67 0-8 1.34-8 4v2h9l-3-3zm2-5c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4" />
        <path d="M15.47 20.5L12 17l1.4-1.41 2.07 2.08 5.13-5.17 1.4 1.41z" />
      </g>
    </SvgIcon>
  )
}
