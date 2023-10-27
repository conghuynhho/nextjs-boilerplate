import {ReactNode, memo, useEffect, useState} from 'react'
import {Dialog, Divider, useMediaQuery, useTheme} from '@mui/material'
import ModalTitle from './components/ModalTitle'
import GgjImageCropper from './GgjImageCropper'
import {
  ICommonCropperProps,
  DEFAULT_FIXED_STENCIL_SIZE,
  DEFAULT_OUTPUT_MAX_HEIGHT,
  DEFAULT_OUTPUT_MAX_WIDTH,
} from './consts'
import {cleanBlobUrlIfExist} from './utils'

export interface IGgjImageCropperModalProps extends ICommonCropperProps {
  /**
   * Toggle modal display
   */
  open: boolean
  /**
   * Modal close handler function
   */
  onClose: () => void
  /**
   * The callback called when user hit the save button
   */
  callbackOnSave: (url: string) => void,
  /**
   * Disable revoke blob on close behavior
   */
  disableRevokeOnClose?: boolean
  /**
   * Title of image cropper modal
   */
  title?: ReactNode
}

function GgjImageCropperModal(props: IGgjImageCropperModalProps) {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))
  const [imageUrl, setImageUrl] = useState<string | undefined>(props.imageUrl)

  // Keep local state in sync when outer state changes
  useEffect(() => {
    setImageUrl(props.imageUrl)
  }, [props.imageUrl])

  const onClose = () => {
    if (!props.disableRevokeOnClose || imageUrl !== props.imageUrl) {
      cleanBlobUrlIfExist(imageUrl)
    }
    // Reset local state to be in sync with outer
    setImageUrl(props.imageUrl)
    props.onClose()
  }

  const onSave = (url: string) => {
    props.callbackOnSave(url)
    onClose()
  }

  const onImageUrlChange = (url: string) => {
    setImageUrl(url)
  }

  return (
    <Dialog
      open={props.open}
      maxWidth="xs"
      fullWidth
      PaperProps={isSmallScreen ? {
        style: {
          margin: '16px',
          maxWidth: 'calc(100% - 32px)',
          width: 'calc(100% - 32px)'
        }
      } : undefined}
    >
      <ModalTitle title={props.title} onClose={onClose}/>
      <Divider/>
      <GgjImageCropper
        callbackOnSave={onSave}
        imageUrl={imageUrl}
        onImageUrlChange={onImageUrlChange}
        maxSize={props.maxSize}
        accept={props.accept}
        aspectRatio={props.aspectRatio}
        isFixed={props.isFixed}
        fixedSize={props.fixedSize}
        isCircle={props.isCircle}
        outputMaxWidth={props.outputMaxWidth}
        outputMaxHeight={props.outputMaxHeight}
        outputMinHeight={props.outputMinHeight}
        outputMinWidth={props.outputMinWidth}
        outputWidth={props.outputWidth}
        outputHeight={props.outputHeight}
        defaultCoordinates={props.defaultCoordinates}
        defaultSize={props.defaultSize}
        sizeRestriction={props.sizeRestriction}
      />
    </Dialog>
  )
}

GgjImageCropperModal.defaultProps = {
  accept: '.png,.jpg,.jpeg',
  maxSize: 5, //MB
  fixedSize: DEFAULT_FIXED_STENCIL_SIZE,
  outputMaxWidth: DEFAULT_OUTPUT_MAX_WIDTH,
  outputMaxHeight: DEFAULT_OUTPUT_MAX_HEIGHT,
}

export default memo(GgjImageCropperModal)
