import {useCallback, useEffect, useState} from 'react'
import RefreshIcon from '@mui/icons-material/Refresh'
import {css, keyframes} from '@emotion/react'
import {useTheme} from '@mui/material'

const around = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

export const GgjInfinitySwipeDown = ({
  element,
  callback,
  conditional=true,
  limit = 60
}: { element: HTMLElement, callback: (handleClose: () => void) => void, conditional?: boolean, limit?: number }) => {
  const theme = useTheme()
  // @ts-ignore
  let yDown = null
  // @ts-ignore
  let yDiff = null
  let isShowLoading = false
  const [isShow, setIsShow] = useState(false)
  const [count, setCount] = useState(-360)
  const [isLimit, setIsLimit] = useState(false)
  const handleClose = useCallback(() => {
    setIsShow(false)
    setIsLimit(false)
    setCount(-360)
    yDown = null
    yDiff = null
    isShowLoading = false
  }, [])

  const handleEventStart = useCallback((event: TouchEvent | MouseEvent) => {

    if (element.scrollHeight - element.clientHeight == 0 || element.scrollHeight - element.clientHeight <= -(element.scrollTop - 10)) {
      // @ts-ignore
      yDown = event instanceof MouseEvent ? event.clientY : event?.touches[0]?.clientY
      isShowLoading = false
      event.preventDefault()
    }

  }, [])
  const handleEventMove = useCallback((event: TouchEvent | MouseEvent) => {
    if (element.scrollHeight - element.clientHeight == 0 || element.scrollHeight - element.clientHeight <= -(element.scrollTop - 10)) {
      // @ts-ignore
      if (!yDown) {
        return
      }
      const yMove = event instanceof MouseEvent ? event.clientY : event?.touches[0]?.clientY
      // @ts-ignore
      const diff = Number(yMove) - Number(yDown)
      const number = Math.floor(diff)

      if (number <= 360) {
        setCount(number)
      }
      if (diff > 0) {
        yDiff = null
        if (diff > 5) {
          if (!isShowLoading) {
            isShowLoading = true
            setIsShow(true)
          }
          if (diff >= limit) {
            yDiff = limit
          }
        }
      }
    }
  }, [])

  const handleEventEnd = useCallback(() => {
    // @ts-ignore
    if (yDiff !== limit) {
      handleClose()
      return
    }
    setIsLimit(true)
    callback.call(null, handleClose)
  }, [])


  useEffect(() => {
    element.addEventListener('mousedown', handleEventStart, false)
    element.addEventListener('mousemove', handleEventMove, false)
    element.addEventListener('mouseup', handleEventEnd, false)
    element.addEventListener('touchstart', handleEventStart, false)
    element.addEventListener('touchmove', handleEventMove, false)
    element.addEventListener('touchend', handleEventEnd, false)
    return () => {
      element.removeEventListener('mousedown', handleEventStart, false)
      element.removeEventListener('mousemove', handleEventMove, false)
      element.removeEventListener('mouseup', handleEventEnd, false)
      element.removeEventListener('touchstart', handleEventStart, false)
      element.removeEventListener('touchmove', handleEventMove, false)
      element.removeEventListener('touchend', handleEventEnd, false)
    }
  }, [])

  if (!conditional) {
    element.removeEventListener('mousedown', handleEventStart, false)
    element.removeEventListener('mousemove', handleEventMove, false)
    element.removeEventListener('mouseup', handleEventEnd, false)
    element.removeEventListener('touchstart', handleEventStart, false)
    element.removeEventListener('touchmove', handleEventMove, false)
    element.removeEventListener('touchend', handleEventEnd, false)
    return null
  }
  if (!isShow) return null

  return <div
    css={css`
      position: absolute;
      top: ${count >= limit ? limit : count}px;
      left: 0;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      transition: all .5s linear;
    `}>
    <div css={css`
      width: 40px;
      height: 40px;
      min-width: 40px;
      min-height: 40px;
      background-color: #ffffff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      -webkit-box-shadow: -1px 2px 13px -6px #424242;
      box-shadow: -1px 2px 13px -6px #424242;
      z-index: inherit;
    `}>
      <RefreshIcon css={css`
        height: 30px;
        width: 30px;
        color: ${theme.palette.primary.main};
        z-index: inherit;
        ${isLimit ? css`animation: ${around} 0.8s linear infinite;` : `transform: rotate(${count * 2}deg); transition: all .8s linear;`}
      `}/>
    </div>
  </div>
}

