import {memo, MutableRefObject, useMemo} from 'react'
import {ClassNames, css} from '@emotion/react'
import {Box} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import {Cropper, FixedCropper, ImageRestriction} from 'react-advanced-cropper'
import 'react-advanced-cropper/dist/style.css'
import 'react-advanced-cropper/dist/themes/corners.css'
import {DEFAULT_FIXED_STENCIL_SIZE, SizeRestriction, ZOOM_MAX_SIZE, ZOOM_MIN_SIZE} from '../consts'
import {calcDefaultSize, getCropShape, defaultPercentsRestriction} from '../utils'
import {DefaultCoordinates, DefaultSize, RawAspectRatio} from 'advanced-cropper'

const staticCropperProps = {
  minWidth: ZOOM_MIN_SIZE,
  minHeight: ZOOM_MIN_SIZE,
  maxWidth: ZOOM_MAX_SIZE,
  maxHeight: ZOOM_MAX_SIZE,
  css: css`width: 100%; height: 100%;`,
}

function ImageCropper(props: {
  cropperRef: MutableRefObject<null> | null,
  isFixed?: boolean,
  imageUrl?: string,
  aspectRatio?: RawAspectRatio | (() => RawAspectRatio),
  defaultSize?: DefaultSize,
  defaultCoordinates?: DefaultCoordinates,
  sizeRestriction?: SizeRestriction,
  isCircle?: boolean,
  fixedSize?: {
    width: number,
    height: number
  }
}) {
  const theme = useTheme()
  const { isFixed, cropperRef, imageUrl, aspectRatio, isCircle, fixedSize, defaultSize, defaultCoordinates, sizeRestriction } = props
  const CropShape = useMemo(() => getCropShape(isCircle || false), [isCircle])

  return (
    <Box
      css={css`
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
      `}
    >
      <ClassNames>
        {({css}) => {
          const overlayClassName = css({ color: theme.palette.smoke.dark, opacity: 0.6, })
          const backgroundClassName = css({ background: theme.palette.smoke.light })
          const handlerStyleClassName = css({ color: theme.palette.primary.main })

          const commonProps = Object.assign({
            ref: cropperRef,
            src: imageUrl,
            stencilComponent: CropShape,
            backgroundClassName: backgroundClassName,
            defaultSize: defaultSize || calcDefaultSize,
            defaultCoordinates: defaultCoordinates,
            sizeRestrictions: sizeRestriction || defaultPercentsRestriction,
          }, staticCropperProps)
          const commonStencilProps = {
            aspectRatio: aspectRatio,
            overlayClassName: overlayClassName,
            handlerClassNames: {
              default: handlerStyleClassName,
            },
          }

          // useRef not recognize component ref
          // const FixedCropper = dynamic(() => import('react-advanced-cropper').then(
          //   (module) => module.FixedCropper
          // ))

          return (
            <>
              {isFixed ? (
                <FixedCropper
                  {...commonProps}
                  stencilProps={Object.assign({
                    handlers: false,
                    lines: false,
                    movable: false,
                    resizable: false,
                    grid: true,
                  }, commonStencilProps)}
                  imageRestriction={ImageRestriction.stencil}
                  stencilSize={fixedSize || DEFAULT_FIXED_STENCIL_SIZE}
                />
              ) : (
                <Cropper
                  {...commonProps}
                  stencilProps={Object.assign({
                    grid: true,
                  }, commonStencilProps)}
                  imageRestriction={ImageRestriction.fitArea}
                />
              )}
            </>
          )
        }}
      </ClassNames>
    </Box>
  )
}

export default memo(ImageCropper)
