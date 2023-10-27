import {memo, useContext} from 'react'
import {Box, useTheme} from '@mui/material'
import {css, SerializedStyles} from '@emotion/react'
import Title from './Title'
import ListImages from './ListImages'
import {OptFileContext, StateContext} from './UploadImagesOrYoutubeContext'
import {useTranslation} from 'next-i18next'
import {nsTranUploadImages} from './index'

const Wrapper = () => {
  const state = useContext(StateContext)
  const {maxFiles} = useContext(OptFileContext)
  const {t} = useTranslation(nsTranUploadImages)
  if (state.listImagesOrYoutube.length == 0) return null
  return <>
    {
      maxFiles > 1 && <Title>{t('7')}</Title>
    }
    <ListImages/>
  </>
}

export const SKILL_DISPLAY_PANEL = 'SKILL_DISPLAY_PANEL'

const DisplayPanel = ({panelCss}: { panelCss: SerializedStyles }) => {
  const theme = useTheme()
  return (
    <Box
      mt={{xs: 3, md: 4, lg: 5}}
      ml={{xs: 0, md: 4, lg: 5}}
      mr={{xs: 0, md: 2, lg: 4}}
      id={SKILL_DISPLAY_PANEL}
      css={css`
        ${panelCss};
        @media (min-width: 1150px) {
          margin-left: ${theme.spacing(8)};
          margin-right: ${theme.spacing(6)};
        }
    `}>
      <Wrapper/>
    </Box>
  )
}

export default memo(DisplayPanel)
