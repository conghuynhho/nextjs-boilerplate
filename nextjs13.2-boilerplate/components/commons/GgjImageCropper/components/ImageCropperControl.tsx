import { memo, MutableRefObject } from 'react'
import { css } from '@emotion/react'
import { Stack, IconButton, Button, Tooltip, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'next-i18next'

import { ZOOM_IN_VALUE, ZOOM_OUT_VALUE, ROTATE_LEFT_VALUE, ROTATE_RIGHT_VALUE } from '../consts'
import { RotateLeft, RotateRight, ZoomIn, ZoomOut } from '@mui/icons-material'
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined'
import CheckIcon from '@mui/icons-material/Check'

import { nsGgjImageCropper } from '../'

function ImageCropperControl(props: {
  cropperRef: MutableRefObject<null> | null,
  handleImageChange: (eventFiles: FileList | null) => void,
  handleImageSave: () => void,
  accept?: string
}) {
  const {t} = useTranslation(nsGgjImageCropper)
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))
  const { cropperRef, handleImageChange, handleImageSave, accept } = props

  const zoom = (value: number) => {
    if (cropperRef && cropperRef.current) {
      // @ts-ignore: Overloading FixedCropperRef & CropperRef
      cropperRef.current.zoomImage(value)
    }
  }

  const rotate = (value: number) => {
    if (cropperRef && cropperRef.current) {
      // @ts-ignore: Overloading FixedCropperRef & CropperRef
      cropperRef.current.rotateImage(value)
    }
  }

  return (
    <Stack
      direction='row'
      spacing={1}
      css={css`
        padding: ${theme.spacing(2)};
      `}
    >
      <Stack
        alignItems='center'
        justifyContent='flex-start'
        spacing={1}
        direction='row'
      >
        {!isSmallScreen && <Tooltip title={t('btn-rotate-left-tooltip')}>
          <IconButton onClick={() => rotate(ROTATE_LEFT_VALUE)}><RotateLeft/></IconButton>
        </Tooltip>}
        <Tooltip title={t('btn-rotate-right-tooltip')}>
          <IconButton onClick={() => rotate(ROTATE_RIGHT_VALUE)}><RotateRight/></IconButton>
        </Tooltip>
        <Tooltip title={t('btn-zoom-out-tooltip')}>
          <IconButton onClick={() => zoom(ZOOM_OUT_VALUE)}><ZoomOut/></IconButton>
        </Tooltip>
        <Tooltip title={t('btn-zoom-in-tooltip')}>
          <IconButton onClick={() => zoom(ZOOM_IN_VALUE)}><ZoomIn/></IconButton>
        </Tooltip>
      </Stack>
      <div css={css`flex-grow: 1;`} />
      <Stack
        alignItems='center'
        justifyContent='flex-end'
        direction='row'
        spacing={1}
        css={css`flex-grow: 1;`}
      >
        <label htmlFor='upload-avatar'
          css={css`width: 50%;`}
          style={{ marginBottom: 0 }}
        >
          <Button
            variant='outlined'
            component='span'
            startIcon={<CachedOutlinedIcon />}
            size='small'
            fullWidth
            css={css`
              font-weight: 400;
              white-space: nowrap;
              text-overflow: ellipsis;
            `}>
            <input
              type='file'
              accept={accept}
              name='upload-avatar'
              id='upload-avatar'
              style={{ display:'none' }}
              onChange={(e) => handleImageChange(e.target.files)}
            />
            {t('btn-change')}
          </Button>
        </label>
        <Button
          onClick={handleImageSave}
          variant='contained'
          startIcon={<CheckIcon/>}
          size='small'
          css={css`
            font-weight: 400;
            white-space: nowrap;
            text-overflow: ellipsis;
            width: 50%;
          `}
        >
          {t('btn-save')}
        </Button>
      </Stack>
    </Stack>
  )
}

export default memo(ImageCropperControl)
