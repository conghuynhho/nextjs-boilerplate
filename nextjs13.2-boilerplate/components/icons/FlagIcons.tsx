import {Tooltip, TooltipProps} from '@mui/material'
import { css, SerializedStyles } from '@emotion/react'
import { ElementType } from 'react'
import {useTranslation} from 'next-i18next'

export const nsTranGgjCountry = 'common@ggj-country'

interface FlagIconsProps {
  countryIsoName: string
  cssString?: SerializedStyles
  as?: ElementType
  ratio?: '4x3' | '1x1'
  isShowTooltip?: boolean,

  tooltipProps?: Omit<TooltipProps, 'title' | 'children'>
}

function FlagIcons(
  {
    countryIsoName,
    cssString,
    ratio = '4x3',
    as: Tag = 'div',
    isShowTooltip = true,
    tooltipProps
  }: FlagIconsProps) {
  const {t} = useTranslation()
  if(!countryIsoName) return null
  const title = isShowTooltip ? t(countryIsoName.toUpperCase(), {ns: nsTranGgjCountry}) : ''
  return (
    <Tooltip
      title={title}
      {...tooltipProps}
    >
      <Tag css={css`
        display: inline-block;
        width: 24px;
        line-height: 1em;
        background: url('/img/v3/static/flags/${ratio}/${countryIsoName.toLowerCase()}.svg') no-repeat center center;
        background-size: contain;

        &:before {
          content: '\\00a0';
        }

        ${cssString}
      `}/>
    </Tooltip>
  )
}

export default FlagIcons
