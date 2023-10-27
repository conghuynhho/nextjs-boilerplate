import {memo} from 'react'
import {NoSsr} from '@mui/material'
import PopupError from './PopupError'
import UploadPanel from './UploadPanel'
import {UploadImagesOrFilesProvider} from './UploadImagesOrFilesContext'
import DisplayPanel from './DisplayPanel'
import {FileTypes} from './const'

function UploadImagesOrFiles(props: {
  maxSize: number,
  maxFiles: number,
  acceptType: string,
  onChange: (listFiles: Array<FileTypes>) => void,
  onRemove: (listRemoveFiles: Array<FileTypes>) => void,
  value: Array<FileTypes>
}) {
  const optFile = {
    maxFiles: props.maxFiles,
    acceptType: props.acceptType,
    maxSize: props.maxSize
  }
  return (
    <NoSsr>
      <UploadImagesOrFilesProvider
        onChange={props.onChange}
        onRemove={props.onRemove}
        value={props.value}
        optFile={optFile}>
        <UploadPanel/>
        <DisplayPanel/>
        <PopupError/>
      </UploadImagesOrFilesProvider>
    </NoSsr>
  )
}

UploadImagesOrFiles.defaultProps = {
  maxFiles: 1,
  maxSize: 5,
  acceptType: '.png,.jpg,.pdf'
}

export const GgjUploadImagesOrFiles = memo(UploadImagesOrFiles)
