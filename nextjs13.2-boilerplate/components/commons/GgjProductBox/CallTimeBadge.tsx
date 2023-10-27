import {memo} from 'react'
import {useTranslation} from 'next-i18next'
import {nsGgjProductBox} from './index'
import Typography from '@mui/material/Typography'
import {css, SerializedStyles} from '@emotion/react'
import {useTheme} from '@mui/material/styles'

const CallTimeBadge = ({time, cusCss}:{time: number, cusCss?: SerializedStyles}) => {
  const theme = useTheme()
  const {t} = useTranslation(nsGgjProductBox)

  if(!time) return <></>

  return <Typography variant="caption" css={css`
    margin-left: ${theme.spacing(1)};
    ${cusCss}
  `}>
    {`/${time}${t('minute')}`}
  </Typography>
}
export default memo(CallTimeBadge)
