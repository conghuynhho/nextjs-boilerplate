import {css} from '@emotion/react'
import {forwardRef, Ref} from 'react'

const GgjOutlineContent = forwardRef(function GgjOutlineComp({outline}: { outline: string }, ref: Ref<HTMLDivElement> | undefined) {
  return (
    <div
      ref={ref}
      dangerouslySetInnerHTML={{__html: outline}}
      css={css`
        white-space: pre-wrap;
        word-break: break-word;
        overflow: hidden; // handle case user content make layout break.
        * {
          white-space: pre-wrap;
          word-break: break-word;
          max-width: 100%!important;
        }
      `}
    />
  )
})

export default GgjOutlineContent
