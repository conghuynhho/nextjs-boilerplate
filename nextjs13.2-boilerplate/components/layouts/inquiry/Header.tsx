import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import { css } from '@emotion/react'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import { useCallback, useMemo } from 'react'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'next-i18next'
import { nsTranInquiryLayout } from './InquiryLayout'
import { NextRouter, useRouter } from 'next/router'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import {GgjDesktopHeader, GgjMobileHeader} from '../../commons/GgjHeader'
import {useMediaQuery} from '@mui/material'

export function Header() {
  const theme = useTheme()
  const breakPoint = useMediaQuery(`(min-width:${theme.breakpoints.values.lg}px)`)
  const isDesktop = useMemo(() => breakPoint, [breakPoint])
  return <>
    {isDesktop && <HeaderDesktop/>}
    <GgjMobileHeader/>
  </>
}

type TabValues = 'faq'|'guide'|'inquiry'|undefined

function getCurrentTab(router: NextRouter): TabValues {
  let m
  if ((m = /^\/(faq|guide|inquiry)/.exec(router.pathname)) !== null) {
    return m[1] as TabValues
  }
}

function RightTabs(props: {helpCenterType: TabValues}) {
  const router = useRouter()
  const {t} = useTranslation(nsTranInquiryLayout)
  const {helpCenterType} = props
  const val = useMemo(() => helpCenterType === 'inquiry' ? false : helpCenterType, [helpCenterType])

  const handleChange = useCallback(async (_, newValue: TabValues) => {
    await router.push(`/${newValue}` as string)
  }, [router])

  return (
    <Stack direction="row" alignItems="center" spacing={4}>
      <Tabs
        value={val}
        onChange={handleChange}
        css={css`
          min-height: 72px;
          padding: 0;
          .MuiTabs-scroller {
            display: flex;
            align-items: center;
          }
        `}
      >
        <Tab label={t('2')} value="faq" />
        <Tab label={t('3')} value="guide" />
      </Tabs>
    </Stack>
  )
}

function HeaderDesktop() {
  const theme = useTheme()
  const { t } = useTranslation(nsTranInquiryLayout)
  const router = useRouter()
  const helpCenterType: TabValues = useMemo(() => getCurrentTab(router), [router])
  const inqButtonType: 'contained'|'outlined' = useMemo(() => helpCenterType === 'inquiry' ? 'contained' : 'outlined', [helpCenterType])
  const goToInquiry = useCallback(async () => {
    await router.push('/inquiry')
  }, [router])

  return (
    <GgjDesktopHeader>
      <Typography
        variant="h6"
        component="p"
        css={css`
          display: flex;
          align-items: center;
          padding-left: ${theme.spacing(3)};
          margin-right: auto;
        `}
      >
        {t('help-center')}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={4}>
        <RightTabs helpCenterType={helpCenterType} />
        <Button
          onClick={goToInquiry}
          variant={inqButtonType}
          css={css`height: 44px;`}
          size="large"
          startIcon={<MailOutlineIcon />}
        >{t('1')}</Button>
      </Stack>
    </GgjDesktopHeader>
  )
}
