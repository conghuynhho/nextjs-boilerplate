import {css} from '@emotion/react'
import {Swiper, SwiperProps, SwiperSlide} from 'swiper/react'
import {Navigation} from 'swiper'
import 'swiper/css'
import 'swiper/css/pagination'
import { Button, Stack, Typography, useTheme } from '@mui/material'
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material'
import {ElementType, useMemo} from 'react'
import {EmotionJSX} from '@emotion/react/types/jsx-namespace'
import GgjLazyRenderComp from '../GgjLazyRenderComp'

export const GGJ_SLIDE_CLASS = 'lazy-slide-item'

export interface GgjSlideProps<T> {
  slideProps?: SwiperProps //https://swiperjs.com/swiper-api
  title: string | EmotionJSX.Element
  list: T[]
  component: ElementType
  showNavBtn?: boolean
  className?: string
  id: string  // need unique id for multiple slide in a page.
  minHeight?: number | string
}

const GgjSlide = <T,>(props: GgjSlideProps<T>) => {
  const theme = useTheme()
  const navClassSuffix = useMemo(() => props.id ? `_${props.id}` : '', [])
  const buttonStyled = css`
    background-color: #fafafa;
    color: ${theme.palette.primary.main};
    box-shadow: 0 3px 6px #00000029;
    min-width: 44px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    &:disabled {
      color: ${theme.palette.primary.light};
    }
  `
  const El = props.component
  return (
    <div className={props.className}>
      <Stack
        spacing={3}
        direction={'row'}
        justifyContent="space-between"
      >
        {props.title && <Typography css={css`line-height: 24px;`} variant="h6" component="h2">{props.title}</Typography>}
        {props.showNavBtn && (
          <Stack direction="row" spacing={3} css={css`
            display: none;
            @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
              display: flex;
            }
          `}>
            <Button css={buttonStyled} className={`custom_prev${navClassSuffix}`}>
              <ArrowBackIosNew />
            </Button>
            <Button css={buttonStyled} className={`custom_next${navClassSuffix}`}>
              <ArrowForwardIos />
            </Button>
          </Stack>
        )}
      </Stack>
      <Swiper
        css={css`
          padding: 32px 2px !important;
        `}
        modules={[Navigation]}
        navigation={{
          nextEl: `.custom_next${navClassSuffix}`,
          prevEl: `.custom_prev${navClassSuffix}`,
        }}
        {...props.slideProps}
      >
        {props.list.map((item, index) => (
          <SwiperSlide key={index}>
            <GgjLazyRenderComp
              className={GGJ_SLIDE_CLASS}
              component={El}
              minHeight={props.minHeight || 100}
              componentProps={{data: item}}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default GgjSlide
