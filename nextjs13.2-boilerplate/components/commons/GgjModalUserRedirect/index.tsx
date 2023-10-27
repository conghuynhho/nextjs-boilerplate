import React from 'react'
import {Box, IconButton, Modal, Stack, Typography} from '@mui/material'
import { css } from '@emotion/react'
import ModalContent from './ModalContent'
import { useModalRedirectContext } from '../../../contexts/ModalRedirectContext'
import { CloseOutlined } from '@mui/icons-material'
import { useTranslation } from 'next-i18next'
import { nsModalRedirect,termModalRedirect } from './const'
import {useTheme} from '@mui/material/styles'
import {useAppSelector} from '../../../store/hooks'
import {ns as appDetailSliceNs} from '../../../store/appSlice'

interface headerProps {
  userLang: string 
  onClose: () => void
  theme: any
}
export type termType = 1 | 2 | 3| 4 | 5 | 6
const ModalHeader = ({userLang,onClose,theme}:headerProps) => { 

  const { t } = useTranslation(nsModalRedirect)
  return (
    <Box
      css={css`
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
      `}
    >
      <Stack direction={'row'} >
        <Typography
          variant="h6"
          component={'h6'}
          css={css`
            @media (min-width: ${theme.breakpoints.values.lg}px) {
              margin-left: 10px;
            }
          `}
        >
          {`${t('4')} /` }
        </Typography>
        <Typography
          variant="h6"
          component={'h6'}
          fontWeight={400}
        >
          &nbsp;{t('4',{lng:userLang})}
        </Typography>
      </Stack>
      <IconButton onClick={onClose}>
        <CloseOutlined />
      </IconButton>
    </Box>
  )
}
function Index() {
  const { open,handleClose } = useModalRedirectContext()
  const theme = useTheme()
  const { termLanguage} = useAppSelector(
    (state) => state[appDetailSliceNs].auth
  )
  const user_lang = termModalRedirect[termLanguage as termType]
  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box
          css={css`
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #fff;
            padding: 10px 20px 48px 20px;
            border-radius: 4px;
            @media (min-width: ${theme.breakpoints.values.xs}px) {
              width: 90vw;
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            @media (min-width: ${theme.breakpoints.values.md}px) {
              width: 600px;
            }
          `}
        >
          <ModalHeader userLang={user_lang} onClose={handleClose} theme={theme} />
          <ModalContent />
        </Box>
      </Modal>
    </div>
  )
}

export default Index
