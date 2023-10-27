import React, { useMemo} from 'react'
import {Box, Button, Stack, Typography,NoSsr} from '@mui/material'
import RepeatIcon from '@mui/icons-material/Repeat'
import { css } from '@emotion/react'
import {nsModalRedirect, redirectSite, termModalRedirect} from './const'
import {useTranslation} from 'next-i18next'
import getConfig from 'next/config'
import {useAppSelector} from '../../../store/hooks'
import {ns as appDetailSliceNs} from '../../../store/appSlice'
import Link from 'next/link'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import {useModalRedirectContext} from '../../../contexts/ModalRedirectContext'
import {useTheme} from '@mui/material/styles'
import  {termType} from './index'


function ModalElement() {
  const theme= useTheme()
  const {
    publicRuntimeConfig: { WEBSITE_LANGUAGE , SKJ_HOST_URL},
  } = getConfig()
  const { termLanguage} = useAppSelector(
    (state) => state[appDetailSliceNs].auth
  )

  const redirectPath = useMemo(() => redirectSite(termLanguage), [])

  const {pathPage} = useModalRedirectContext()
  const handleRedirect = () => {
    if(pathPage) {
      window.location.href = `${SKJ_HOST_URL}/${redirectPath}${pathPage}`
    }
    else{
      const location: string = window.location.href
      window.location.href = location.replace(
        `/${WEBSITE_LANGUAGE}`,
        `/${redirectPath}`
      )
    }
  }
  const { t } = useTranslation(nsModalRedirect)
  const { handleClose } = useModalRedirectContext()

  const userLang = termModalRedirect[termLanguage as termType]
  return (
    <>
      <Box css={css`
      max-width: 600px;
        margin: 0 auto;
      `}>
        {/* Noti 1*/}
        <Box sx={{
          margin:`${theme.spacing(5)} 0`
        }}>
          <Typography
            css={css`
              text-align: center;
              @media only screen and (max-width: ${theme.breakpoints.values.lg}px) {
                font-size: 16px;
              }
                `}
            variant="h6"
            component={'h2'}
          >
            {t('1',{country:t(userLang)})}
          </Typography>
          <Typography
            css={css`
              text-align: center;
              font-style: italic;
              margin: ${theme.spacing(2)} 0;
              @media only screen and (max-width: ${theme.breakpoints.values.lg}px) {
                font-size: 16px;
              }
            `}
            variant="h6"
            component={'h2'}
          >
            {t('1',{country:t(userLang,{lng:userLang}),lng:userLang})}
          </Typography>
        </Box>
        {/* Noti 2*/}
        <Box sx={{
          marginBottom:`${theme.spacing(5)}`
        }}>
          <Typography
            variant="body1"
            component={'p'}
            css={css`
              color: rgba(0, 0, 0, 0.6);
              text-align: center;
              @media only screen and (max-width: ${theme.breakpoints.values.lg}px) {
                font-size:14px;
              }
            `}
          >
            {t('2')}
          </Typography>
          <Typography
            variant="body1"
            component={'p'}
            css={css`
              color: rgba(0, 0, 0, 0.6);
              text-align: center;
              font-style: italic;
              margin: ${theme.spacing(2)} 0;
              @media only screen and (max-width: ${theme.breakpoints.values.lg}px) {
                font-size:14px;
              }
            `}
          >
            {t('2',{lng:userLang})}
          </Typography>
        </Box>
        {/* Button redirect */}
        <Stack
          direction="column"
          justifyContent={{xs:'center',md:'space-around'}}
          alignItems={'center'}
          spacing={3}
        >
          <Button
            onClick={handleRedirect}
            variant="contained"
            startIcon={<RepeatIcon />}
            css={css`
              display: flex;
              flex-direction: row;
              font-size:12px;
              max-width:220px;
              @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
                max-width:none;
                font-size:14px;
              }
              `}
          >
            <Stack direction={'row'} sx={{
              flexWrap:'wrap'
            }}>
              <span>
                {t('3')}
              </span>
              <span css={css`
                  font-style: italic;
                  @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
                    margin-left: ${theme.spacing(2)}
                  }
                `}>
                {`(${t('3', { lng: userLang })})`}
              </span>
            </Stack>
          </Button>
          <Link href={`${SKJ_HOST_URL}/${redirectPath}/inquiry`}
            css={css`
              text-decoration-color: ${theme.palette.primary.main}
          `}
          >
            <Button
              onClick={handleClose}
              variant="text"
              startIcon={<MailOutlineIcon />}
              css={css`
                display: flex;
                flex-direction: row;
                font-size:12px;
                padding-left: 16px;
                padding-right: 16px;
                @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
                  font-size:14px;
                }
              `}
            >
              <Stack direction={'row'} sx={{
                flexWrap: 'wrap'
              }}>
                <span>
                  {t('5')}
                </span>
                <span css={css`
                    font-style: italic;
                    margin-left: ${theme.spacing(2)}
                  `}>
                  {`(${t('5', { lng: userLang })})`}
                </span>
              </Stack>
            </Button>
          </Link>
        </Stack>
      </Box>
    </>
  )
}
function ModalContent(){
  return (
    <NoSsr>
      <ModalElement/>
    </NoSsr>
  )
}

export default ModalContent
