import {memo, useState} from 'react'
import {css} from '@emotion/react'
import {Backdrop, BackdropProps, Box, ButtonGroup, Dialog, IconButton, Tooltip} from '@mui/material'
import {styled, useTheme} from '@mui/material/styles'
import {Close, FileDownloadOutlined, ZoomIn, ZoomOut} from '@mui/icons-material'
import {rgba} from 'emotion-rgba'
import {useAppDispatch, useAppSelector} from 'store/hooks'
import {actions, IImageViewer, ns} from './ImageViewerSlice'
import {Swiper, SwiperSlide, useSwiper} from 'swiper/react'
import SwiperCore, {FreeMode, Navigation, Thumbs, Zoom} from 'swiper'
import 'swiper/css'
import 'swiper/css/zoom'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import 'swiper/css/free-mode'


const CustomBackdrop = styled(Backdrop)<BackdropProps>(({theme}) => {
  return {
    backgroundColor: theme.palette.text.primary,
  }
})

const ToolbarGroup = memo(function ToolbarGroup() {
  const theme = useTheme()
  const swiper = useSwiper()

  const handleZoomIn = () => {
    swiper?.zoom?.in()
  }
  const handleZoomOut = () => {
    swiper?.zoom?.out()
  }
  return (
    <ButtonGroup
      variant="contained"
      css={css`
        background: ${rgba(theme.palette.jade.light, 0.5)};
        position: absolute;
        z-index: 1;
        left: 50%;
        bottom: -20px;
        transform: translateX(-50%);
        height: 40px;
        @media (min-width: ${theme.breakpoints.values.md}px) and (min-height: ${theme.breakpoints.values.md}px) {
          bottom: -${theme.spacing(4)};
          height: 48px;
          svg {
            height: 32px;
            width: 32px;
          }
        }
      `}
    >
      <Tooltip title="Zoom In">
        <IconButton onClick={handleZoomIn}>
          <ZoomIn css={css` color: #ffffff;`}/>
        </IconButton>
      </Tooltip>
      <Tooltip title="Zoom Out">
        <IconButton onClick={handleZoomOut}>
          <ZoomOut css={css` color: #ffffff;`}/>
        </IconButton>
      </Tooltip>
    </ButtonGroup>
  )
})

const DownloadButton = function DownloadButton({item}:{item: IImageViewer}) {
  const theme = useTheme()

  if(!item) return null

  return (
    <div id="image-viewer-download">
      <a href={item.url} download={item.name} >
        <Tooltip title="Download">
          <IconButton
            css={css`
            position: fixed;
            z-index: 2;
            right: calc(${theme.spacing(7)} + 16px);
            top: ${theme.spacing(5)};
            color: #ffffff;
            background: ${theme.palette.jade.light};

            &:hover {
              background: ${theme.palette.smoke.dark};
            }
          `}
          >
            <FileDownloadOutlined/>
          </IconButton>
        </Tooltip>
      </a>
    </div>
  )
}

const SwiperImageViewer = memo(function SwiperImageViewer({images} : {
  images: IImageViewer[]
}) {
  const theme = useTheme()
  const firstViewingImageIndex = useAppSelector(state => state[ns].firstViewingImageIndex)
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore>()

  const handleChangeSlides = (item: IImageViewer) => {
    const downloadButton = document?.getElementById('image-viewer-download') as HTMLAnchorElement
    downloadButton.download = item.url
  }

  return (
    <Box css={css`
      width: 100%;
      height: 100%;
      margin: 0 auto;
      @media (min-width: ${theme.breakpoints.values.md}px) {
        max-width: 700px;
      }
      @media (min-width: ${theme.breakpoints.values.lg}px) {
        max-width: 80%;
      }
      .swiper {
        overflow: visible;
      }`
    }>
      <Swiper
        modules={[Zoom, FreeMode, Navigation, Thumbs]}
        spaceBetween={100}
        navigation={true}
        thumbs={{swiper: thumbsSwiper, autoScrollOffset: 1}}
        zoom={{
          toggle: true,
          maxRatio: 2,
        }}
        onAfterInit={swiper => swiper.slideTo(firstViewingImageIndex, 0)}
        onActiveIndexChange={swiper => handleChangeSlides(images[swiper.activeIndex])}
        css={css`
          --swiper-navigation-color: #ffffff;
          height: calc(100% - 90px);
          @media (min-width: ${theme.breakpoints.values.md}px) and (min-height: ${theme.breakpoints.values.md}px) {
            height: calc(100% - 132px);
          }

          .swiper-wrapper {
            align-items: center;
          }
        `}
      >
        {
          images.map(item => (
            <SwiperSlide key={item.url}>
              <Box
                className="swiper-zoom-container"
                css={css` margin: 0 auto; `}
              >
                <img
                  css={css`
                    max-width: 100%;
                    height: auto;
                    max-height: 80% !important;
                    @media (min-width: ${theme.breakpoints.values.md}px) {
                      max-width: 80%;
                    }
                  `}
                  src={item.url}
                  alt="Image Viewer"
                />
              </Box>
            </SwiperSlide>
          ))
        }

        <DownloadButton
          // @ts-ignore
          slot="container-start"
          item={images[firstViewingImageIndex]}
        />
        {/* @ts-ignore */}
        <ToolbarGroup slot="container-end"/>
      </Swiper>

      {/* Thumbs */}
      {images.length > 1 &&
        <Box css={css`
          width: 100%;
          //max-width: 500px;
          overflow: hidden;
          margin: 0 auto;
          padding-top: ${theme.spacing(5)};
          height: 84px;
          @media (min-width: ${theme.breakpoints.values.md}px) and (min-height: ${theme.breakpoints.values.md}px){
            height: 132px;
            padding-top: ${theme.spacing(6)};
          }

        `}>
          <Swiper
            modules={[Thumbs]}
            onSwiper={setThumbsSwiper}
            slidesPerView="auto"
            centeredSlides={true}
            watchSlidesProgress={true}
            spaceBetween={16}
            onAfterInit={swiper => swiper.slideTo(firstViewingImageIndex, 0)}
            css={css`
            .swiper-slide {
              opacity: 0.4;
              max-width: 48px;
              @media (min-width: ${theme.breakpoints.values.md}px) and (min-height: ${theme.breakpoints.values.md}px) {
                max-width: 60px;
              }
            }
            .swiper-slide-thumb-active {
              opacity: 1;
            }
        `}
          >
            {
              images.map(item => (
                <SwiperSlide key={item.url} >
                  <img
                    css={css`
                      height: 48px;
                      width: 48px;
                      cursor: pointer;
                      object-fit: cover;
                      border-radius: 10px;
                      @media (min-width: ${theme.breakpoints.values.md}px) and (min-height: ${theme.breakpoints.values.md}px) {
                        height: 60px;
                        width: 60px;
                      }
                    `}
                    src={item.url} alt="Image Viewer"/>
                </SwiperSlide>
              ))
            }
          </Swiper>
        </Box>}
    </Box>
  )
})

export const GgjChatImageViewer = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const viewingImages = useAppSelector(state => state[ns]?.viewingImages)

  const handleCloseViewer = () => {
    dispatch(actions.setViewingImages([]))
  }
  return (
    <Dialog
      open={viewingImages?.length > 0}
      onClose={handleCloseViewer}
      fullWidth={true}
      BackdropComponent={CustomBackdrop}
      PaperProps={{
        style: {
          background: 'none',
          boxShadow: 'none',
          width: '100%',
          height: '100%',
          maxHeight: '100%',
          margin: 0,
          overflow: 'visible'
        }
      }}
    >
      {/* close modal button*/}
      <Tooltip title="Close">
        <IconButton
          onClick={handleCloseViewer}
          css={css`
            position: fixed;
            z-index: 2;
            right: ${theme.spacing(5)};
            top: ${theme.spacing(5)};
            color: #ffffff;
            background: ${theme.palette.jade.light};

            &:hover {
              background: ${theme.palette.smoke.dark};
            }
          `}
        >
          <Close/>
        </IconButton>
      </Tooltip>

      <SwiperImageViewer images={viewingImages} />
    </Dialog>
  )
}


