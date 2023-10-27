import { ReactElement } from 'react'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import Slide from '@mui/material/Slide'

export default function HideOnScroll(props: {window?: () => Window, children: ReactElement}) {
  const {children, window} = props
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  })
  return (
    <Slide
      appear={true}
      direction="down"
      in={!trigger}
    >
      {children}
    </Slide>
  )
}
