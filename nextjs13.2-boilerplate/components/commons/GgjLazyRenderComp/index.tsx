import { ElementType, useEffect, useMemo, useRef, useState } from 'react'
import { css } from '@emotion/react'

type LazyRenderProps = {
  component: ElementType
  componentProps?: Record<string, unknown>
  minHeight: number|string
  alwaysShow?: boolean
  componentsReady?: (() => void)|null
  className?: string
}
export default function GgjLazyRenderComp(props: LazyRenderProps) {
  const $el = useRef<HTMLDivElement>(null)
  const [isBot] = useState<boolean>(false) // TODO: Binh, need consider. How check isBot?
  const [shouldShow, setShouldShow] = useState<boolean>(false)
  const cKey = useMemo(() => `LazyRenderComponent-${Math.random()}`, [])
  const {
    alwaysShow = false,
    component: Component,
    componentProps = {},
    componentsReady = null,
    className = '',
  } = props
  let minHeight

  if (typeof props.minHeight == 'number') {
    minHeight = `${props.minHeight}px`
  }

  useEffect(() => {
    if (props.alwaysShow) {
      componentsReady && componentsReady()
      return
    }
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (!e.isIntersecting || shouldShow) return
          $el.current && observer.unobserve($el.current)
          setShouldShow(true)
          componentsReady && componentsReady()
        })
      },
      {root: null, threshold: 0},
    )
    $el.current && observer.observe($el.current)
  }, [props, componentsReady])
  return (
    <div ref={$el} className={className} key={cKey}
      css={css`
        min-height: ${minHeight};
      `}>
      {(alwaysShow || shouldShow || isBot) && <Component {...componentProps} />}
    </div>
  )
}
