import {Stack, Typography, useTheme} from '@mui/material'
import {ChangeEvent, DragEvent, memo, useCallback, useContext, useMemo, useRef, useState} from 'react'
import {css} from '@emotion/react'
import Title from './Title'
import {GgjOutlineButton, MARGIN_RIGHT_ICON} from '../GgjButton'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import {Action, DispatchContext, IsMaxFileContext, OptFileContext} from './UploadImagesOrYoutubeContext'
import {nsTranUploadImages} from './index'
import {useTranslation} from 'next-i18next'
import {formatDate} from '../../../common/date'
import useMediaQuery from '@mui/material/useMediaQuery'

const UploadImages = () => {
  const theme = useTheme()
  const date = formatDate(new Date(), 'yyyy年MM月dd日')
  const {t} = useTranslation(nsTranUploadImages)
  const fileInputField = useRef<HTMLInputElement>(null)
  const dispatch = useContext(DispatchContext)
  const isMaxFileContext = useContext(IsMaxFileContext)
  const {maxFiles, maxSize, acceptType, isMobile} = useContext(OptFileContext)
  const breakPointXs = useMediaQuery(`(max-width:${theme.breakpoints.values.md - 1}px)`)
  const isMobileMode = useMemo(() => isMobile || breakPointXs, [breakPointXs, isMobile])
  const [isDragOver, setIsDragOver] = useState<boolean>(false)

  const dropImages = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      if (event.dataTransfer) {
        const files = event.dataTransfer.files
        handleUpload(files)
      }
      setIsDragOver(false)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const uploadImages = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const {files} = event.target
    if (files) {
      handleUpload(files)
    }
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [])

  const handleUpload = async(files: FileList) => {
    if (files.length == 0)
      return
    await dispatch({
      type: Action.AddImages, payload: {files, maxFiles, date, acceptType, maxSize}
    })
    if (fileInputField.current) {
      fileInputField.current.value = ''
    }
  }

  const handleClickUpload = useCallback(() => {
    if (fileInputField.current) {
      fileInputField.current.click()
    }
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [])

  const preventDefault = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [])

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [])

  const fontSize = isMobileMode ? 'font-size:14px' : 'font-size:16px'

  return (<>
    <Title>{t('1')}</Title>
    <div
      draggable
      onDrop={dropImages}
      onDragOver={preventDefault}
      onDragLeave={handleDragLeave}
      onDragEnd={handleDragLeave}
      css={css`
        margin-top: ${theme.spacing(3)};
        min-height: 130px;
        width: 100%;
        background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%23626262FF' stroke-width='2' stroke-dasharray='8%2c8' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e");
        background-color: ${isDragOver ? theme.palette.success.light : '#ffffff'};
        border-radius: 10px;
        padding: ${theme.spacing(4)};
        box-shadow: ${isDragOver ? 'rgba(0, 0, 0, 0.1) 0px 10px 50px' : 'none'};
        transition: box-shadow 0.3s ease-in;
      `}
    >
      <input type={'file'} multiple={maxFiles > 1} css={css`display: none`} accept={acceptType} ref={fileInputField}
        onChange={e => {
          uploadImages(e)
        }}/>
      <Stack direction={'column'} alignItems={'center'}>
        <Stack alignItems={'center'} justifyContent="center" rowGap={2} flexWrap={'wrap'}
          css={css`
                 width: ${isMobileMode ? '100%' : 'auto'};
                 flex-direction: ${isMobileMode ? 'column' : 'row'};
               `}
        >
          <Typography variant={'subtitle1'}
            fontWeight="medium"
            css={css`
                        margin-right: ${isMobileMode ? 0 : theme.spacing(4)};
                        ${fontSize};
                      `
            }>
            {t('2')}
          </Typography>
          <Stack direction={'row'} alignItems={'center'} justifyContent={'center'}
            css={css`
                   width: ${isMobileMode ? '100%' : 'auto'};
                   padding: ${isMobile ? theme.spacing(4) : '0'} 0;
                 `}>
            <GgjOutlineButton onClick={handleClickUpload} disabled={isMaxFileContext}>
              <UploadFileIcon css={css`margin-right: ${MARGIN_RIGHT_ICON}`}/>{t('3')}
            </GgjOutlineButton>
          </Stack>
        </Stack>
        <Typography variant={'subtitle1'} fontWeight="medium" css={css`margin-top: 14px;
          ${fontSize}`}>
          {t('4')}
        </Typography>

      </Stack>
    </div>
  </>)
}

export default memo(UploadImages)
