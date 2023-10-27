import {ReactNode} from 'react'
import {css} from '@emotion/react'
import {useLayoutContext,} from 'contexts/LayoutContext'


export function BlankLayout(props: { children: ReactNode }) {
  const { layoutSetting } = useLayoutContext()
  const { backgroundColor } = layoutSetting
  return <div css={css`
    height: 100%;
    width: 100%;
    background-color:${backgroundColor}
  `}>
    {props.children}
  </div>
}
