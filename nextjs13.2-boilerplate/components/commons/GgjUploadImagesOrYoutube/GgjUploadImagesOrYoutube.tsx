import {memo} from 'react'
import {NoSsr} from '@mui/material'
import UploadImages from './UploadImages'
import UploadYoutubeLinks from './UploadYoutubeLinks'
import DisplayPanel from './DisplayPanel'
import PopupError from './PopupError'
import { SerializedStyles } from '@emotion/react'
import {ImageTypes, UploadImagesOrYoutubeProvider, YoutubeTypes} from './UploadImagesOrYoutubeContext'
import ModalEditImage from './ModalEditImage'

/* eslint-disable @typescript-eslint/no-explicit-any */
function UploadImagesOrYoutube(props: {
  maxSize: number,
  maxFiles: number,
  acceptType: string,
  onChange: (listImages: Array<ImageTypes|YoutubeTypes>) => void,
  onRemove: (listImageRemove: Array<ImageTypes>) => void,
  isMobile: boolean,
  value: string,
  panelCss: SerializedStyles
}) {
  const optFile = {
    maxFiles: props.maxFiles,
    acceptType: props.acceptType,
    maxSize: props.maxSize,
    isMobile: props.isMobile
  }
  return (
    <NoSsr>
      <UploadImagesOrYoutubeProvider
        onChange={props.onChange}
        onRemove={props.onRemove}
        value={props.value}
        optFile={optFile}>
        <UploadImages/>
        <UploadYoutubeLinks/>
        <DisplayPanel panelCss={props.panelCss}/>
        <PopupError/>
        <ModalEditImage />
      </UploadImagesOrYoutubeProvider>
    </NoSsr>
  )
}

UploadImagesOrYoutube.defaultProps = {
  maxFiles: 1,
  maxSize: 5,
  acceptType: '.png,.jpg,.jpeg',
  isMobile: false,
  panelCss: ''
}

export const GgjUploadImagesOrYoutube = memo(UploadImagesOrYoutube)
