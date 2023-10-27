import { css } from '@emotion/react'
import { SerializedStyles } from '@emotion/react'
import SvgIcon from '@mui/material/SvgIcon'
interface Props { css?: SerializedStyles }

export default function UploadPhotoIcon(props?: Props) {
  const cls1 = css`fill: #E1E1E1;`
  return (
    <SvgIcon {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" css={cls1}>
      <circle cx="6.5" cy="6.5" r="2.5" />
      <path d="m14 7-5.223 8.487L7 13l-5 7h20z" />
    </SvgIcon>
  )
}
