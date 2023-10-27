import {memo, useMemo, useRef, useState} from 'react'
import {css} from '@emotion/react'
import {Box, Divider} from '@mui/material'
import {
  ICommonCropperProps,
  DEFAULT_CROP_BG_COLOR,
  DEFAULT_FIXED_STENCIL_SIZE,
  DEFAULT_HEIGHT,
  DEFAULT_OUTPUT_MAX_HEIGHT,
  DEFAULT_OUTPUT_MAX_WIDTH,
  DEFAULT_OUTPUT_QUALITY,
} from './consts'
import {cleanBlobUrlIfExist, resolveImageMimeType, validateImage} from './utils'
import ImageCropperControl from './components/ImageCropperControl'
import ImageCropper from './components/ImageCropper'
import SelectorEmptyImage from './components/SelectorEmptyImage'
import PopupError from './components/PopupError'

export interface IGgjImageCropperProps extends ICommonCropperProps {
  /**
   * The callback called when user hit the save button
   */
  callbackOnSave: (url: string) => void
  /**
   * Callback called when user change their image
   */
  onImageUrlChange: (url: string, mimeType: string) => void
}

function GgjImageCropper(props: IGgjImageCropperProps) {
  const {callbackOnSave, imageUrl, onImageUrlChange, aspectRatio, accept, maxSize, isFixed, isCircle, fixedSize, defaultSize, defaultCoordinates, sizeRestriction} = props
  const isEmptyImage = useMemo(() => !imageUrl, [imageUrl])
  const cropperRef = useRef(null)
  const [isShowPopupError, setIsShowPopupError] = useState(false)

  const toggleShowPopupError = () => {
    setIsShowPopupError(!isShowPopupError)
  }

  const handleImageChange = (eventFiles: FileList | null) => {
    if (!eventFiles) return
    const image = eventFiles[0]

    if (!validateImage(image, accept, maxSize)) {
      toggleShowPopupError()
      return
    }
    cleanBlobUrlIfExist(imageUrl)
    const url = URL.createObjectURL(image)
    onImageUrlChange(url, image.type)
  }

  const handleImageSave = () => {
    if (!cropperRef.current) {
      return
    }
    // @ts-ignore: Overloading default & fixed ref
    const canvas = cropperRef.current.getCanvas({
      fillColor: DEFAULT_CROP_BG_COLOR,
      width: props.outputWidth,
      height: props.outputHeight,
      minWidth: props.outputMinWidth,
      minHeight: props.outputMinHeight,
      maxWidth: props.outputMaxWidth,
      maxHeight: props.outputMaxHeight,
    })

    if (!canvas) {
      return
    }
    // @ts-ignore: Overloading default & fixed ref
    const cropperImage = cropperRef.current.getImage()
    const mimeType =resolveImageMimeType(cropperImage?.arrayBuffer)

    canvas.toBlob((blob: Blob) => {
      if (blob) {
        const respUrl = URL.createObjectURL(blob)
        callbackOnSave(respUrl)
      }
    },
    mimeType,
    DEFAULT_OUTPUT_QUALITY
    )
  }

  return (
    <>
      <Box css={css`
        height: ${DEFAULT_HEIGHT}px;
      `}>
        {isEmptyImage ?
          <SelectorEmptyImage
            accept={accept}
            maxSize={maxSize}
            handleImageChange={handleImageChange}
          />
          :
          <ImageCropper
            cropperRef={cropperRef}
            imageUrl={imageUrl}
            aspectRatio={aspectRatio}
            isFixed={isFixed}
            fixedSize={fixedSize}
            isCircle={isCircle}
            defaultCoordinates={defaultCoordinates}
            defaultSize={defaultSize}
            sizeRestriction={sizeRestriction}
          />
        }
      </Box>
      <PopupError
        isShowPopupError={isShowPopupError}
        closePopupError={toggleShowPopupError}
        acceptType={accept}
        maxSize={maxSize}
      />
      {!isEmptyImage && <>
        <Divider/>
        <ImageCropperControl
          cropperRef={cropperRef}
          accept={accept}
          handleImageChange={handleImageChange}
          handleImageSave={handleImageSave}
        />
      </>}
    </>
  )
}

GgjImageCropper.defaultProps = {
  accept: '.png,.jpg,.jpeg',
  maxSize: 5, //MB
  fixedSize: DEFAULT_FIXED_STENCIL_SIZE,
  outputMaxWidth: DEFAULT_OUTPUT_MAX_WIDTH,
  outputMaxHeight: DEFAULT_OUTPUT_MAX_HEIGHT,
}

export default memo(GgjImageCropper)
