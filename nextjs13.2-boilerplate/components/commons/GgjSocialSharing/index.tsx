import getConfig from 'next/config'
import {IconButton, Stack} from '@mui/material'
import {FacebookRounded, Twitter} from '@mui/icons-material'
import {css} from '@emotion/react'
import LineIcon from '../../icons/LineIcon'
import {memo} from 'react'

const SocialType = {
  facebook: 'facebook',
  twitter: 'twitter',
  line: 'line'
}

const {publicRuntimeConfig: {SKJ_HOST_URL}} = getConfig()
const shareSocialByType = (socialType: string, skillId: number) => {
  const windowConfig = 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=800,width=600'
  const productUrl = `${SKJ_HOST_URL}/skill/${skillId}`
  switch (socialType) {
  case  SocialType.facebook: {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${productUrl}`, '', windowConfig)
    break
  }
  case  SocialType.twitter: {
    window.open(`https://twitter.com/intent/tweet?hashtags=Skijan&url=${productUrl}&via=${SKJ_HOST_URL}`, '', windowConfig)
    break
  }
  case  SocialType.line: {
    window.open(`https://social-plugins.line.me/lineit/share?url=${productUrl}`, '', windowConfig)
    break
  }
  }
}

export const GgjSocialSharing = memo(function SocialSharing ({skillId, className}:{skillId: number, className?: string}) {
  return <Stack justifyContent="space-around" direction="row" className={className}>
    <IconButton onClick={() => shareSocialByType(SocialType.facebook, skillId)}>
      <FacebookRounded css={css` color: #4267B2; font-size: 40px;`}/>
    </IconButton>
    <IconButton onClick={() => shareSocialByType(SocialType.twitter, skillId)}>
      <Twitter css={css` color: #1d9bf0; font-size: 40px; `}/>
    </IconButton>
    <IconButton onClick={() => shareSocialByType(SocialType.line, skillId)}>
      <LineIcon css={css` font-size: 40px; `}/>
    </IconButton>
  </Stack>
})
