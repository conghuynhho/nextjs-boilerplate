import {SvgIcon} from '@mui/material'
import {SerializedStyles} from '@emotion/react'
import {css} from '@emotion/css'
interface Props {
  css?: SerializedStyles
}
export default function TrashIcon(props?: Props) {
  const cls1 = css`fill:none;`
  return (
    <SvgIcon width="32px" height="32px" viewBox="0 0 32 32" {...props}>
      <rect x="12" y="12" width="2" height="12"/>
      <rect x="18" y="12" width="2" height="12"/>
      <path d="M4,6V8H6V28a2,2,0,0,0,2,2H24a2,2,0,0,0,2-2V8h2V6ZM8,28V8H24V28Z"/>
      <rect x="12" y="2" width="8" height="2"/>
      <rect id="_Transparent_Rectangle_" data-name="&lt;Transparent Rectangle&gt;" className={cls1} width="32" height="32"/>
    </SvgIcon>
  )
}
