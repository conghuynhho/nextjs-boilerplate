import { useState, ChangeEvent, DragEvent, memo } from 'react'
import { css } from '@emotion/react'
import { Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import PhotoSizeSelectActualOutlinedIcon from '@mui/icons-material/PhotoSizeSelectActualOutlined'
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined'
import { GgjContainButton} from 'components/commons/GgjButton'
import { useTranslation } from 'next-i18next'

import { nsGgjImageCropper } from '../'

function SelectorEmptyImage(props: {
  accept?: string,
  maxSize?: number,
  handleImageChange: (eventFiles: FileList | null) => void,
}) {
  const { handleImageChange, accept, maxSize } = props
  const { t } = useTranslation(nsGgjImageCropper)
  const theme = useTheme()
  const [isDragOver, setIsDragOver] = useState<boolean>(false)

  const handleFileChange = (e : ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    handleImageChange(e.target.files)
  }
  const handleDragOver = (e : DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }
  const handleDragLeave = (e : DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }
  const handleDrop = (e : DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    handleDragLeave(e)
    handleImageChange(e.dataTransfer.files)
  }

  return (
    <Box
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={handleDragLeave}
      css={css`
        width: 100%;
        height: 100%;
        padding: ${theme.spacing(3)};
      `}
    >
      <label htmlFor="upload-image" style={{ marginBottom: 0 }}>
        <Box
          css={css`
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: #f1f5fb;
            background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%23333' stroke-width='1' stroke-dasharray='8' stroke-dashoffset='27' stroke-linecap='round'/%3e%3c/svg%3e");
            border-radius: 8px;
            padding: ${theme.spacing(6)} ${theme.spacing(4)};
            opacity: ${isDragOver ? '0.7' : '1'};
            cursor: pointer;
        `}>
          <PhotoSizeSelectActualOutlinedIcon css={css`
            font-size: ${theme.spacing(7)};
            color: ${theme.palette.primary.dark};
            margin-bottom:10px;
          `} />
          <Typography align='center' variant='h6' css={css`
            color: #000;
            margin-bottom:20px;
          `}>
            {t('title-upload')}
          </Typography>
          <input
            type="file"
            accept={accept}
            name="upload-image"
            id="upload-image"
            style={{ display:'none' }}
            onChange={handleFileChange}
          />
          <GgjContainButton
            // @ts-ignore: component props exist
            component='span'
            startIcon={<FileUploadOutlinedIcon/>}
            css={css`
              white-space: nowrap;
              text-overflow: ellipsis;
              margin: ${theme.spacing(1)} 0;
          `}>
            {t('btn-upload')}
          </GgjContainButton>
          <div css={css`
            margin-top:10px;
            font-size:12px;
          `}>
            <Typography align='center' variant='caption'>
              {t('text-allow-type', {accept})}
            </Typography>
            <Typography align='center' variant='caption'>
              {t('text-allow-maxsize', {maxSize})}
            </Typography>
          </div>
        </Box>
      </label>
    </Box>
  )
}

export default memo(SelectorEmptyImage)
