import {css} from '@emotion/react'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import GgjOutlineContent from 'components/commons/GgjOutlineContent'
import {useCallback, useEffect, useRef, useState} from 'react'
import {useTheme} from '@mui/material/styles'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import {scrollToElSmoothly} from 'common/utils'

type ProductDescriptionProps = {
  className?: string
  collapseHeight: number
  content: string
  openTextDefault?: string
  closeTextDefault?: string
  isOpen?: boolean
  children?: (open: boolean, handleCollapse: () => void) => JSX.Element
  containerId?: string
}

export default function GgjCollapseText({
  className,
  collapseHeight = 310,
  content,
  openTextDefault = 'OPEN',
  closeTextDefault = 'CLOSE',
  children,
  isOpen = false,
  containerId,
}: ProductDescriptionProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(isOpen) // true: open, false: close
  const [shouldShowPlainText, setShouldShowPlainText] = useState(false) // if true, show plain text without collapse
  const handleCollapse = useCallback(() => {
    if(!open || (contentRef?.current?.clientHeight ?? 0) <= screen.height) {
      setOpen(!open)
    } else {
      scrollToElSmoothly({
        el: contentRef.current as HTMLElement,
        duration: 300,
        cb: () => setOpen(!open),
        containerId: containerId,
      })
    }
  }, [open])
  useEffect(() => {
    contentRef?.current?.clientHeight && setShouldShowPlainText(contentRef?.current?.clientHeight <= collapseHeight)
  }, [collapseHeight, contentRef])

  return (
    <div className={className}>
      {
        shouldShowPlainText
          ? <GgjOutlineContent outline={content} ref={contentRef}/>
          : <>
            <div css={css`position: relative`}>
              <Collapse in={open} collapsedSize={collapseHeight}>
                <GgjOutlineContent outline={content} ref={contentRef}/>
              </Collapse>
              <OpacityDiv open={open}/>
            </div>
            {
              children
                ? children(open, handleCollapse)
                : (
                  <div css={css`text-align: right`}>
                    <ButtonCollapse handleCollapse={handleCollapse} open={!open}>
                      <span>{!open ? openTextDefault : closeTextDefault}</span>
                    </ButtonCollapse>
                  </div>
                )
            }
          </>
      }
    </div>
  )
}

type ButtonCollapseProps = {
  handleCollapse: () => void
  open: boolean
  children?: JSX.Element
}
function ButtonCollapse(props: ButtonCollapseProps) {
  const theme = useTheme()
  const {handleCollapse, open} = props

  return (
    <Button onClick={handleCollapse}>
      {props.children}
      <KeyboardArrowUpIcon
        css={css`
          transition: transform .3s;
          transition-delay: .${theme.transitions.duration.standard}s;
          transform: rotate(0);

          &.open {
            transform: rotate(180deg);
          }
        `}
        className={open ? 'open' : ''}
      />
    </Button>
  )
}

function OpacityDiv({open}: { open: boolean }) {
  const theme = useTheme()
  return (
    <div
      css={css`
        background: transparent linear-gradient(180deg, #FFFFFF59 0%, #FFFFFFF2 100%) 0 0 no-repeat padding-box;
        position: absolute;
        height: 80%;
        bottom: 0;
        width: 100%;
        visibility: hidden;
        opacity: 0;
        transition: opacity .${theme.transitions.duration.standard}s;

        &.show {
          opacity: 1;
          visibility: visible;
        }
      `}
      className={`OpacityDiv ${open ? '' : 'show'}`}
    />
  )
}
