import {memo, useContext} from 'react'
import GgjImageCropper from '../GgjImageCropper'
import {Action, DispatchContext, ImageTypes, StateContext, UploadTypes} from './UploadImagesOrYoutubeContext'
import {
  convertBannerUrlSurfaceToMypage,
  MAX_BANNER_OUTPUT_HEIGHT,
  MAX_BANNER_OUTPUT_WIDTH,
  MIN_BANNER_OUTPUT_HEIGHT,
  MIN_BANNER_OUTPUT_WIDTH,
} from './const'
import {dateFormat, formatDate} from '../../../common/date'
import {squareAnd50PercentsRestriction, squareRatioCenterCoordinates} from '../GgjImageCropper/utils'

function ModalEditImage() {
  const dispatch = useContext(DispatchContext)
  const { editItem } = useContext(StateContext)
  const item = editItem?.item
  const index = editItem?.index

  const isOpen = item ? item.type === UploadTypes.Image : false
  const imageUrl = item ? convertBannerUrlSurfaceToMypage((item as ImageTypes).imageUrl) : undefined

  const date = formatDate(new Date(), dateFormat)

  const handleClose = () => {
    dispatch({
      type: Action.ToggleEdit,
      payload: {
        index: -1
      }
    })
  }

  const handleSave = (url: string) => {
    dispatch({
      type: Action.UpdateImage,
      payload: {
        index: index,
        item: {
          ...item,
          imageUrl: url,
          createdAt: date,
          updatedAt: date,
        }
      }
    })
  }

  return (
    <GgjImageCropper
      open={isOpen}
      onClose={handleClose}
      callbackOnSave={handleSave}
      imageUrl={imageUrl}
      disableRevokeOnClose
      outputMinHeight={MIN_BANNER_OUTPUT_HEIGHT}
      outputMinWidth={MIN_BANNER_OUTPUT_WIDTH}
      outputMaxHeight={MAX_BANNER_OUTPUT_HEIGHT}
      outputMaxWidth={MAX_BANNER_OUTPUT_WIDTH}
      defaultCoordinates={squareRatioCenterCoordinates}
      sizeRestriction={squareAnd50PercentsRestriction}
    />
  )
}

export default memo(ModalEditImage)
