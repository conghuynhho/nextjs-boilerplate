import {Stack, Typography, useTheme} from '@mui/material'
import {ChangeEvent, DragEvent, memo, useCallback, useContext, useRef, useState} from 'react'
import {css} from '@emotion/react'
import {GgjOutlineButton, MARGIN_RIGHT_ICON} from '../GgjButton'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import {Action, DispatchContext, IsMaxFileContext, OptFileContext} from './UploadImagesOrFilesContext'
import {useTranslation} from 'next-i18next'
import {nsTranUploadFiles} from './index'

const UploadPanel = () => {
  const theme = useTheme()
  const {t} = useTranslation(nsTranUploadFiles)
  const fileInputField = useRef<HTMLInputElement>(null)
  const dispatch = useContext(DispatchContext)
  const isMaxFileContext = useContext(IsMaxFileContext)
  const {maxFiles, acceptType, maxSize} = useContext(OptFileContext)
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
    []
  )

  const uploadImages = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const {files} = event.target
    if (files) {
      handleUpload(files)
    }
  }, [])

  const handleUpload = useCallback(async(files: FileList) => {
    if (files.length == 0) return
    await dispatch({
      type: Action.AddFiles, payload: {files, maxFiles, acceptType, maxSize}
    })
    if (fileInputField.current) {
      fileInputField.current.value = ''
    }
  }, [])

  const handleClickUpload = useCallback(() => {
    if (fileInputField.current) {
      fileInputField.current.click()
    }
  }, [])

  const preventDefault = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  },[])
  const arrayAcceptType = acceptType.replaceAll('.', '').replaceAll(',', ' / ').toLocaleUpperCase()
  return (<>
    <div
      onDrop={dropImages}
      onDragOver={preventDefault}
      onDragLeave={handleDragLeave}
      onDragEnd={handleDragLeave}
      css={css`
        margin-top: ${theme.spacing(3)};
        min-height: 130px;
        width: 100%;
        background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='10' ry='10' stroke='%23626262FF' stroke-width='2' stroke-dasharray='8' stroke-dashoffset='8' stroke-linecap='butt'/%3e%3c/svg%3e");
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
        <Stack alignItems={'center'} flexWrap={'wrap'}>
          <Stack direction={'row'} alignItems={'center'} justifyContent={'center'}
            css={css`margin-top: ${theme.spacing(2)}`}>
            <GgjOutlineButton onClick={handleClickUpload} disabled={isMaxFileContext}>
              <UploadFileIcon css={css`margin-right: ${MARGIN_RIGHT_ICON}`}/>{t('2')}
            </GgjOutlineButton>
          </Stack>
          <Stack css={css`margin-top: ${theme.spacing(2)};
            text-align: center;
            margin-bottom: 0;
            user-select: none;
          `}>
            <Typography variant="caption" css={css`line-height: 20px;
              display: flex;`}>{arrayAcceptType}
            </Typography>
            <Typography variant="caption" css={css`line-height: 20px`}>{t('添付は{{maxFiles}}個まで', {maxFiles})}</Typography>
            <Typography variant="caption" css={css`line-height: 20px`}>{t('1ファイル{{maxSize}}MBまで', {maxSize})}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </div>
  </>)
}

export default memo(UploadPanel)
