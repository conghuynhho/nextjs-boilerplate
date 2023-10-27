import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import {memo, useContext, useMemo} from 'react'
import {css} from '@emotion/react'
import {GgjContainButton} from '../GgjButton'
import {
  Action,
  DispatchContext,
  IsShowPopupErrorContext,
  OptFileContext
} from './UploadImagesOrFilesContext'
import {Typography} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import {nsTranUploadFiles} from './index'
import {useTranslation} from 'next-i18next'
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded'

const PopupError = () => {
  const {t} = useTranslation(nsTranUploadFiles)
  const isShowPopupError = useContext(IsShowPopupErrorContext)
  const dispatch = useContext(DispatchContext)
  const {maxFiles, acceptType, maxSize} = useContext(OptFileContext)
  const theme = useTheme()
  const isOpen = useMemo(() => isShowPopupError ? true : false, [isShowPopupError])
  return <Dialog
    open={isOpen}
    css={css`z-index: 99999`}
  >
    <DialogTitle>
      Warning!
    </DialogTitle>
    <DialogContent css={css`max-width: 500px;
      @media screen and (min-width: ${theme.breakpoints.values.lg}px) {
        min-width: 500px;
      }
      @media screen and (max-width: ${theme.breakpoints.values.lg - 1}px) {
        min-width: 320px;
      }
    `}
    >
      <ul css={css`list-style: none; padding-left: ${theme.spacing(3)}`}>
        <li css={css`display: flex`}>
          <ArrowRightRoundedIcon/>
          <Typography variant={'subtitle1'}>
            {t('アップロードできるファイル：{{acceptType}}',
              {acceptType})}
          </Typography>
        </li>
        <li css={css`display: flex`}>
          <ArrowRightRoundedIcon/>
          <Typography variant={'subtitle1'}>
            {t('添付ファイル：{{maxFiles}}つまで',
              {maxFiles})}
          </Typography>
        </li>
        <li  css={css`display: flex`}>
          <ArrowRightRoundedIcon/>
          <Typography variant={'subtitle1'}>
            {t('1ファイル{{maxSize}}まで',
              {maxSize})}
          </Typography>
        </li>
      </ul>
    </DialogContent>
    <DialogActions css={css`padding: 24px`}>
      <GgjContainButton autoFocus onClick={() => dispatch({type: Action.ClosePopupMaxFiles})}>
        Ok
      </GgjContainButton>
    </DialogActions>
  </Dialog>
}

export default memo(PopupError)
